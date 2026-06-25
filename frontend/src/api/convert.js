import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker source for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const uploadFile = async (file, onProgress) => {
  // Simulate progress
  onProgress({ percent: 10, speed: 0 });
  
  let extractedText = "";
  
  try {
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      onProgress({ percent: 50, speed: 0 });
      
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n";
      }
      extractedText = fullText;
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value;
    } else {
      throw new Error("Invalid file type. Please upload a PDF or DOCX file.");
    }
    
    onProgress({ percent: 100, speed: 0 });
    
    return { file_id: extractedText, message: "Extracted successfully" };
  } catch (error) {
    throw new Error(`Failed to process file: ${error.message}`);
  }
};

export const streamLatexConversion = async (text, onData, onError, onComplete) => {
  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText: text })
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || response.statusText);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.error) {
            onError(data.error);
            return;
          }
          if (data.content) {
            onData(data.content);
          }
          if (data.done) {
            onComplete();
            return;
          }
        } catch (e) {
          console.error("Failed to parse stream message:", e);
        }
      }
    }
    
    onComplete();
  } catch (error) {
    onError(error.message || "Connection error during conversion");
  }
};

export const formatSpeed = (bytesPerSecond) => {
  return "0 B/s";
};
