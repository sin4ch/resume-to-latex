import os
import logging
import json
from datetime import datetime
from functools import wraps
from typing import Callable, Any
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

ALLOWED_FILE_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

PROMPT_FILE = "prompt.md"


class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        if hasattr(record, "extra_data"):
            log_data.update(record.extra_data)

        return json.dumps(log_data)


logger = logging.getLogger("resume_to_latex")
logger.setLevel(logging.INFO)

console_handler = logging.StreamHandler()
console_handler.setFormatter(JSONFormatter())
logger.addHandler(console_handler)


def log_with_extra(**extra_data: Any) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            logger.info(f"Starting {func.__name__}", extra={"extra_data": extra_data})
            try:
                result = func(*args, **kwargs)
                logger.info(f"Completed {func.__name__}", extra={"extra_data": extra_data})
                return result
            except Exception as e:
                logger.error(
                    f"Error in {func.__name__}: {str(e)}",
                    extra={"extra_data": {**extra_data, "error": str(e)}},
                )
                raise

        return wrapper

    return decorator


def get_prompt() -> str:
    prompt_path = os.path.join(os.path.dirname(__file__), PROMPT_FILE)
    if not os.path.exists(prompt_path):
        logger.warning(f"Prompt file not found at {prompt_path}, using default")
        return "Convert the following resume text to LaTeX format. Use clean, well-structured LaTeX code."

    with open(prompt_path, "r") as f:
        prompt = f.read()
    logger.info("Loaded prompt from file", extra={"extra_data": {"prompt_length": len(prompt)}})
    return prompt
