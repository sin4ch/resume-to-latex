# Resume to LaTeX Converter

A simple, minimalist web application that converts PDF and DOCX resumes to LaTeX format using the Gemini 3 Flash AI model.

## Features

- **Drag & Drop Upload**: Easily upload PDF or DOCX files
- **Real-time Progress**: See upload progress with download speed
- **Streaming Output**: LaTeX code streams in real-time during conversion
- **Copy to Clipboard**: One-click copy of generated LaTeX
- **Minimalist Design**: Clean black and white interface
- **Structured Logging**: Comprehensive logging for debugging

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework
- **Gemini 3 Flash**: AI model for conversion
- **PyPDF2**: PDF text extraction
- **python-docx**: DOCX text extraction
- **uv**: Fast Python package manager

### Frontend
- **React + Vite**: Modern React development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful, consistent icon library
- **EventSource API**: Server-Sent Events for streaming

## Project Structure

```
resume-to-latex/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Settings and logging
│   ├── file_processor.py    # PDF/DOCX extraction
│   ├── ai_converter.py      # Gemini AI integration
│   ├── prompt.md            # LaTeX conversion guidelines
│   ├── .env.example         # Environment variables template
│   └── pyproject.toml      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── UploadProgress.jsx
│   │   │   └── LatexDisplay.jsx
│   │   ├── api/
│   │   │   └── convert.js   # API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.12+
- Node.js 18+
- Gemini API key ([Get one here](https://aistudio.google.com/apikey))
- uv (Python package manager) - Install with: `pip install uv`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies with uv**
   ```bash
   uv sync
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run FastAPI server**
   ```bash
   uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Drag and drop your resume (PDF or DOCX, max 10MB)
3. Watch upload progress with real-time speed display
4. View the LaTeX code as it streams in
5. Click "Copy" to copy the generated LaTeX

## API Endpoints

### POST /upload
Upload a resume file (PDF or DOCX)

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` - Resume file

**Response:**
```json
{
  "file_id": "uuid-string",
  "filename": "resume.pdf",
  "message": "File processed successfully"
}
```

### GET /convert/{file_id}
Stream LaTeX conversion using Server-Sent Events (SSE)

**Request:**
- Method: `GET`
- Parameter: `file_id` - File ID from upload endpoint

**Response (SSE Stream):**
```
data: {"content": "LaTeX chunk"}
data: {"done": true}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "healthy"
}
```

## Customizing LaTeX Conversion

Edit `backend/prompt.md` to customize conversion guidelines. You can modify:

- Document structure preferences
- Section naming conventions
- Formatting rules
- Content preservation guidelines

## Logging

The backend uses structured JSON logging for easy debugging. Logs include:

- Timestamps
- Event stages (validation, processing, conversion)
- File metadata
- Error details

Logs are output to the console in JSON format.

## Development

### Backend Development
```bash
cd backend
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Troubleshooting

### Backend
- **Error: GEMINI_API_KEY not found**: Make sure you've created a `.env` file in the `backend/` directory with your API key
- **Error: File too large**: The maximum file size is 10MB. Check the file size before uploading
- **Error: Invalid file type**: Only PDF and DOCX files are supported

### Frontend
- **Upload fails**: Ensure the backend is running at `http://localhost:8000`
- **Streaming stops working**: Check the browser console for SSE connection errors
- **CORS errors**: The backend is configured to allow all origins, but check your browser settings

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
