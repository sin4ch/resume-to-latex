import { useState } from "react";
import FileUpload from "./components/FileUpload";
import UploadProgress from "./components/UploadProgress";
import LatexDisplay from "./components/LatexDisplay";
import { uploadFile, streamLatexConversion, formatSpeed } from "./api/convert";
import { AlertCircle, Info, Clock, ExternalLink } from "lucide-react";

function App() {
  const [stage, setStage] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState("0 B/s");
  const [latexContent, setLatexContent] = useState("");
  const [error, setError] = useState(null);
  const [fileId, setFileId] = useState(null);

  const getErrorMessage = (error) => {
    if (error.includes("API key not valid") || error.includes("INVALID_ARGUMENT")) {
      return "The AI service API key is not configured. Please contact the administrator.";
    }
    if (error.includes("File too large")) {
      return "The file is too large. Please upload a file smaller than 10MB.";
    }
    if (error.includes("Invalid file type")) {
      return "This file type is not supported. Please upload a PDF or DOCX file.";
    }
    if (error.includes("Network error")) {
      return "Network connection failed. Please check your internet connection and try again.";
    }
    if (error.includes("429") || error.includes("RESOURCE_EXHAUSTED") || error.toLowerCase().includes("quota") || error.toLowerCase().includes("rate limit")) {
      return "API rate limit has been exhausted. Please wait a moment and try again.";
    }
    return "An error occurred while processing your file. Please try again.";
  };

  const handleFileSelect = async (file) => {
    setError(null);
    setLatexContent("");
    setStage("uploading");
    setProgress(0);
    setSpeed("0 B/s");

    try {
      const response = await uploadFile(file, (progressData) => {
        setProgress(progressData.percent);
        setSpeed(formatSpeed(progressData.speed));
      });

      setFileId(response.file_id);
      setStage("processing");

      await streamLatexConversion(
        response.file_id,
        (chunk) => {
          setLatexContent((prev) => prev + chunk);
        },
        (error) => {
          setError(getErrorMessage(error));
          setStage("idle");
        },
        () => {
          setStage("completed");
        }
      );
    } catch (err) {
      setError(getErrorMessage(err.message));
      setStage("idle");
    }
  };

  const handleReset = () => {
    setStage("idle");
    setLatexContent("");
    setError(null);
    setFileId(null);
    setProgress(0);
    setSpeed("0 B/s");
  };

  const handleCopy = () => {
    console.log("LaTeX content copied to clipboard");
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <header className="flex-none py-8">
        <div className="container mx-auto px-4 max-w-3xl flex flex-col items-center text-center">
          <h1 className="text-4xl font-medium tracking-tight text-foreground mb-3">
            Resume to LaTeX
          </h1>
          <p className="text-base text-muted-foreground max-w-md">
            Convert resumes (PDF, DOCX) to clean LaTeX format.
          </p>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 max-w-3xl flex flex-col min-h-0">
        {error && (
          <div className={`mb-4 p-3 flex-none ${error.includes("rate limit") ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800" : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"} border rounded-lg flex items-start gap-3`}>
            {error.includes("rate limit") ? (
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${error.includes("rate limit") ? "text-amber-800 dark:text-amber-200" : "text-red-800 dark:text-red-200"}`}>{error.includes("rate limit") ? "Rate Limit Exceeded" : "Error"}</p>
              <p className={`text-sm ${error.includes("rate limit") ? "text-amber-700 dark:text-amber-300" : "text-red-700 dark:text-red-300"}`}>{error}</p>
            </div>
          </div>
        )}

        <section className="mb-4 w-full flex-none">
          {stage === "idle" && (
            <FileUpload onFileSelect={handleFileSelect} isDisabled={false} />
          )}

          {(stage === "uploading" || stage === "processing" || stage === "completed") && (
            <UploadProgress
              progress={progress}
              speed={speed}
              stage={stage}
            />
          )}
        </section>

        {(latexContent || stage === "processing") && (
          <div className="mb-4 w-full flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0">
              <LatexDisplay
                content={latexContent}
                showCopyButton={stage === "completed"}
                onCopy={handleCopy}
              />
            </div>
            {stage === "completed" && (
              <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mt-6 flex-none">
                <Info className="w-4 h-4" />
                <span>
                  Paste LaTeX in a new project on <a href="https://overleaf.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline underline-offset-4 inline-flex items-center gap-0.5">Overleaf <ExternalLink className="w-3 h-3" /></a>
                </span>
              </div>
            )}
          </div>
        )}

        {stage !== "idle" && (
           <div className="text-center mt-4 w-full flex-none">
             <button
               onClick={handleReset}
               className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md h-9 px-3 text-sm font-medium"
             >
               Convert Another
             </button>
           </div>
         )}
      </div>

      <footer className="flex-none py-8 text-center text-sm text-muted-foreground">
        <p>Built by <a href="https://x.com/sin4ch" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline underline-offset-4">@sin4ch</a> • <a href="https://github.com/sin4ch/resume-to-latex" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline underline-offset-4">⭐ Star on GitHub</a></p>
      </footer>
    </main>
  );
}

export default App;
