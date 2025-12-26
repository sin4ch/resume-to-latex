import json
from contextlib import asynccontextmanager
from typing import Dict
from fastapi import FastAPI, UploadFile, HTTPException, status
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from file_processor import FileProcessor
from ai_converter import AIConverter
from config import logger, ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE

file_store: Dict[str, str] = {}
ai_converter = AIConverter()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application starting up")
    yield
    logger.info("Application shutting down")


app = FastAPI(
    title="Resume to LaTeX Converter",
    description="Convert PDF/DOCX resumes to LaTeX format using Gemini 3 Flash",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/upload")
async def upload_file(file: UploadFile):
    try:
        logger.info(
            "Received file upload",
            extra={
                "extra_data": {
                    "filename": file.filename,
                    "content_type": file.content_type,
                }
            },
        )

        content = await file.read()

        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="No filename provided"
            )

        processor = FileProcessor(file.filename, content)
        extracted_text = processor.process()

        file_store[processor.file_id] = extracted_text

        logger.info(
            "File processed successfully",
            extra={
                "extra_data": {
                    "file_id": processor.file_id,
                    "filename": file.filename,
                    "extracted_length": len(extracted_text),
                }
            },
        )

        return {
            "file_id": processor.file_id,
            "filename": file.filename,
            "message": "File processed successfully",
        }

    except ValueError as e:
        logger.error(
            f"Validation error: {str(e)}",
            extra={"extra_data": {"error": str(e), "filename": file.filename}},
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )
    except Exception as e:
        logger.error(
            f"Upload error: {str(e)}",
            extra={"extra_data": {"error": str(e), "filename": file.filename}},
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process file: {str(e)}",
        )


@app.get("/convert/{file_id}")
async def convert_to_latex_stream(file_id: str):
    if file_id not in file_store:
        logger.error(
            "File ID not found", extra={"extra_data": {"file_id": file_id}}
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File ID not found"
        )

    resume_text = file_store[file_id]

    async def generate():
        try:
            async for chunk in ai_converter.convert_to_latex(resume_text):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            logger.error(
                f"Streaming error: {str(e)}",
                extra={"extra_data": {"file_id": file_id, "error": str(e)}},
            )
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        generate(), media_type="text/event-stream", headers={"Cache-Control": "no-cache"}
    )


@app.get("/")
async def root():
    return {
        "message": "Resume to LaTeX Converter API",
        "version": "0.1.0",
        "endpoints": {
            "upload": "/upload - POST - Upload PDF/DOCX file",
            "convert": "/convert/{file_id} - GET - Stream LaTeX conversion (SSE)",
            "health": "/health - GET - Health check",
        },
    }
