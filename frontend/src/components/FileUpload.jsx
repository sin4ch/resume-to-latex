import { Upload, FileText } from "lucide-react";

function FileUpload({ onFileSelect, isDisabled }) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (isDisabled) return;

    const files = e.target.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative rounded-lg border border-dashed p-8 text-center transition-colors
        ${isDisabled
          ? 'border-border bg-muted/30 cursor-not-allowed'
          : 'border-border hover:border-foreground/20 hover:bg-muted/30 cursor-pointer'
        }`}
    >
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileInput}
        disabled={isDisabled}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer ${isDisabled ? 'cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-muted p-2.5">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop your resume here
            </p>
            <p className="text-sm text-muted-foreground">
              PDF or DOCX, or click to browse
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md h-8 px-3 text-sm">
              Select file
            </button>
          </div>
        </div>
      </label>
    </div>
  );
}

export default FileUpload;
