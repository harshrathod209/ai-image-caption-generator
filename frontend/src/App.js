import { useState, useRef } from "react";
import Header from "./components/Header";
import FileDropZone from "./components/FileDropZone";
import PromptSection from "./components/PromptSection";
import CaptionsSection from "./components/CaptionsSection";
import { useCaptionGenerator } from "./hooks/useCaptionGenerator";
import { downloadCaptions } from "./utils/downloadCaptions";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [systemPrompt, setSystemPrompt] = useState("Describe this image in a short caption.");
  const [userPrompt, setUserPrompt] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const fileInputRef = useRef(null);
  const validTypes = ["image/jpeg", "image/png", "image/webp"];

  const { captions, loading, error, setError, setCaptions, generateCaption } = useCaptionGenerator();

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

  const handleUpload = () => generateCaption(file, systemPrompt, userPrompt);

  const handleCopy = (caption, index) => {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleClearCaptions = () => {
    setCaptions([]);
    setCopiedIndex(null);
  };

  return (
    <div className="app-container">
      <Header />
      <FileDropZone file={file} preview={preview} onFileChange={handleFileChange} onClear={handleClearImage} fileInputRef={fileInputRef} />
      {error && <p className="error">{error}</p>}
      {file && (
        <PromptSection
          systemPrompt={systemPrompt}
          userPrompt={userPrompt}
          setSystemPrompt={setSystemPrompt}
          setUserPrompt={setUserPrompt}
          onUpload={handleUpload}
          loading={loading}
        />
      )}
      {captions.length > 0 && (
        <CaptionsSection
          captions={captions}
          copiedIndex={copiedIndex}
          onCopy={handleCopy}
          onDownload={() => downloadCaptions(captions)}
          onClear={handleClearCaptions}
        />
      )}
    </div>
  );
}

export default App;
