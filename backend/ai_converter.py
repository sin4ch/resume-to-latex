import logging
from typing import AsyncGenerator
from google import genai
from config import logger, log_with_extra, GEMINI_API_KEY, get_prompt


class AIConverter:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.prompt = get_prompt()
        logger.info("AI Converter initialized", extra={"extra_data": {"prompt_length": len(self.prompt)}})

    @log_with_extra(stage="convert")
    async def convert_to_latex(self, resume_text: str) -> AsyncGenerator[str, None]:
        try:
            logger.info(
                "Starting LaTeX conversion",
                extra={"extra_data": {"input_length": len(resume_text)}},
            )

            full_prompt = f"{self.prompt}\n\nResume text:\n{resume_text}"

            response = self.client.models.generate_content_stream(
                model="gemini-2.5-flash",
                contents=full_prompt,
            )

            logger.info("Conversion stream started")

            total_chars = 0
            for chunk in response:
                if chunk.text:
                    total_chars += len(chunk.text)
                    logger.debug(
                        "Streaming chunk",
                        extra={"extra_data": {"chunk_length": len(chunk.text), "total_chars": total_chars}},
                    )
                    yield chunk.text

            logger.info(
                "Conversion completed",
                extra={"extra_data": {"total_chars": total_chars}},
            )

        except Exception as e:
            logger.error(
                f"AI conversion failed: {str(e)}",
                extra={"extra_data": {"error": str(e), "error_type": type(e).__name__}},
            )
            raise
