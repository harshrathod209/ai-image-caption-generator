import { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    "Describe this image in a short caption."
  );
  const [userPrompt, setUserPrompt] = useState("");
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const fileInputRef = useRef(null);
  const validTypes = ["image/jpeg", "image/png", "image/webp"];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!validTypes.includes(selectedFile.type)) {
      setError("Only JPEG, PNG, and WebP images are supported.");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError("");
    setCaptions([]);
  };

  const handleClearImage = () => {
    setFile(null);
    setPreview(null);
    setCaptions([]);
    setError("");
    setCopiedIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select an image first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("system_prompt", systemPrompt);
    formData.append("user_prompt", userPrompt);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/generate-caption/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.error) {
        setError(JSON.stringify(res.data.error));
      } else {
        setCaptions((prev) => [...prev, res.data.caption]);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Error generating caption");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (caption, index) => {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleClearCaptions = () => {
    setCaptions([]);
    setCopiedIndex(null);
  };

  const handleDownload = () => {
    if (!captions.length) return;
    const blob = new Blob([captions.join("\n\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "captions.txt";
    link.click();
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Image Caption Generator</h1>
        <p>Upload an image and get short descriptive captions using AI.</p>
      </header>

      <div
        className={`file-drop-zone ${file ? "has-file" : ""}`}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="preview-image-drop" />
        ) : (
          <p>Click or drag & drop an image here</p>
        )}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden-input"
        />
      </div>
      {error && <p className="error">{error}</p>}
      {file && (
        <button className="clear-btn" onClick={handleClearImage}>
          Clear Image
        </button>
      )}

      {file && (
        <div className="prompt-section">
          <div className="prompt-info">
            <p>
              <strong>System Prompt:</strong> The AI will use this to understand
              what type of caption to generate.
            </p>
            <p>
              <strong>User Prompt:</strong> Optional additional instructions for
              more customized captions.
            </p>
          </div>

          <textarea
            rows="2"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter system prompt"
          />
          <textarea
            rows="2"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Enter user prompt"
          />
          <button
            className="generate-btn"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Caption"}
          </button>
        </div>
      )}

      {captions.length > 0 && (
        <div className="captions-section">
          <h3>Generated Captions</h3>
          <ul>
            {captions.map((cap, idx) => (
              <li key={idx} className="caption-card">
                <span>{cap}</span>
                <div className="caption-actions">
                  <button onClick={() => handleCopy(cap, idx)}>Copy</button>
                  {copiedIndex === idx && (
                    <span className="copied-tooltip">Copied!</span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="caption-buttons">
            <button onClick={handleDownload} className="download-btn">
              Download Captions
            </button>
            <button
              onClick={handleClearCaptions}
              className="clear-captions-btn"
            >
              Clear All Captions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
