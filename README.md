# Resume to LaTeX Converter

A simple, minimalist web application that converts PDF and DOCX resumes to LaTeX format using Gemini 3 Flash AI model.

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
3. Watch the upload progress
4. View the LaTeX code as it streams in
5. Click "Copy" to copy the generated LaTeX

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

