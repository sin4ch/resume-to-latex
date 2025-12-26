import { FileText, Check } from "lucide-react";

function UploadProgress({ progress, speed, stage }) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-3">
          {stage === "uploading" && (
            <>
              <div className="relative w-5 h-5">
                <svg className="w-full h-full" viewBox="0 0 20 20">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-muted opacity-30"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="url(#spinnerGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="50"
                    strokeDashoffset="0"
                    className="animate-spin origin-center"
                  />
                  <defs>
                    <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="currentColor" className="text-foreground" stopOpacity="1" />
                      <stop offset="100%" stopColor="currentColor" className="text-muted" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-foreground">
                  Uploading... <span className="text-muted-foreground">{progress}%</span>
                </p>
              </div>
            </>
          )}

          {stage === "processing" && (
            <>
              <div className="relative w-4 h-4">
                <svg className="w-full h-full" viewBox="0 0 20 20">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-muted opacity-30"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="url(#spinnerGradient2)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="50"
                    strokeDashoffset="0"
                    className="animate-spin origin-center"
                  />
                  <defs>
                    <linearGradient id="spinnerGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="currentColor" className="text-foreground" stopOpacity="1" />
                      <stop offset="100%" stopColor="currentColor" className="text-muted" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">
                Converting...
              </p>
            </>
          )}

          {stage === "completed" && (
            <>
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600">Conversion complete</span>
            </>
          )}
        </div>

        {stage === "uploading" && (
          <div className="w-full max-w-xs h-0.5 bg-muted rounded-full">
            <div
              className="bg-foreground h-0.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadProgress;
