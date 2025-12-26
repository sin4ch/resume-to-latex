import { useState } from "react";
import { Copy, Check } from "lucide-react";

function LatexDisplay({ content, showCopyButton, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="bg-muted/50 px-4 py-2 border-b border-border flex justify-between items-center flex-none">
        <span className="text-sm font-medium text-foreground">LaTeX Output</span>
        {showCopyButton && (
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-3 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-8 px-4 text-sm font-medium"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        )}
      </div>
      <div className="overflow-auto flex-1">
        <pre className="p-4 text-sm text-foreground whitespace-pre-wrap font-mono bg-background">
          {content}
        </pre>
      </div>
    </div>
  );
}

export default LatexDisplay;
