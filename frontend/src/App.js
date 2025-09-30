// Import React hooks and dependencies
import { useState, useRef } from "react";
import axios from "axios";
import "./App.css"; // Import styling

function App() {
  // -------------------- State Management --------------------
  const [file, setFile] = useState(null); // Uploaded image file
  const [preview, setPreview] = useState(null); // Image preview URL
  const [captions, setCaptions] = useState([]); // List of generated captions
  const [loading, setLoading] = useState(false); // Loading state for caption generation
  const [systemPrompt, setSystemPrompt] = useState(
    "Describe this image in a short caption." // Default system prompt
  );
  const [userPrompt, setUserPrompt] = useState(""); // Optional user prompt
  const [error, setError] = useState(""); // Error message
  const [copiedIndex, setCopiedIndex] = useState(null); // Tracks which caption was copied
  const fileInputRef = useRef(null); // Ref for hidden file input

  const validTypes = ["image/jpeg", "image/png", "image/webp"]; // Supported image types

  // -------------------- Handlers --------------------

  // Handles image selection and validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!validTypes.includes(selectedFile.type)) {
      setError("Only JPEG, PNG, and WebP images are supported.");
      setFile(null);
      setPreview(null);
      return;
    }

    // Set file and preview
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError("");
    setCaptions([]);
  };

  // Clears uploaded image and resets state
  const handleClearImage = () => {
    setFile(null);
    setPreview(null);
    setCaptions([]);
    setError("");
    setCopiedIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Sends image and prompts to backend for caption generation
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
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Handle API response
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

  // Copies caption to clipboard and shows tooltip
  const handleCopy = (caption, index) => {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Clears all generated captions
  const handleClearCaptions = () => {
    setCaptions([]);
    setCopiedIndex(null);
  };

  // Downloads all captions as a .txt file
  const handleDownload = () => {
    if (!captions.length) return;
    const blob = new Blob([captions.join("\n\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "captions.txt";
    link.click();
  };

  // -------------------- UI Rendering --------------------
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>AI Image Caption Generator</h1>
        <p>Upload an image and get short descriptive captions using AI.</p>
      </header>

      {/* Image Upload Section */}
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

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Clear Image Button */}
      {file && (
        <button className="clear-btn" onClick={handleClearImage}>
          Clear Image
        </button>
      )}

      {/* Prompt Input Section */}
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

      {/* Captions Display Section */}
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

          {/* Caption Action Buttons */}
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
