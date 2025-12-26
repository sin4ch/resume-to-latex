const API_BASE_URL = "http://localhost:8000";

export const uploadFile = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.open("POST", `${API_BASE_URL}/upload`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        const speed = (event.loaded / (event.timeStamp - xhr.upload.startTime)) * 1000;
        onProgress({ percent: percentComplete, speed: speed });
      }
    };

    xhr.upload.onloadstart = () => {
      xhr.upload.startTime = Date.now();
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error("Invalid response from server"));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };

    xhr.send(formData);
  });
};

export const streamLatexConversion = (fileId, onData, onError, onComplete) => {
  const eventSource = new EventSource(
    `${API_BASE_URL}/convert/${fileId}`
  );

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.error) {
        onError(data.error);
        eventSource.close();
        return;
      }

      if (data.content) {
        onData(data.content);
      }

      if (data.done) {
        onComplete();
        eventSource.close();
      }
    } catch (e) {
      console.error("Failed to parse SSE message:", e);
    }
  };

  eventSource.onerror = (error) => {
    onError("Connection error during conversion");
    eventSource.close();
  };

  return eventSource;
};

export const formatSpeed = (bytesPerSecond) => {
  if (bytesPerSecond === 0) return "0 B/s";

  const units = ["B/s", "KB/s", "MB/s", "GB/s"];
  const exponent = Math.floor(Math.log(bytesPerSecond) / Math.log(1024));
  const value = bytesPerSecond / Math.pow(1024, exponent);

  return `${value.toFixed(2)} ${units[exponent]}`;
};
