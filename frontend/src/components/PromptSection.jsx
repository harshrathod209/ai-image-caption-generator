export default function PromptSection({
  systemPrompt,
  userPrompt,
  setSystemPrompt,
  setUserPrompt,
  onUpload,
  loading,
}) {
  return (
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
      />
      <textarea
        rows="2"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />
      <button
        className="generate-btn"
        onClick={onUpload}
        disabled={loading}>
        {loading ? "Generating..." : "Generate Caption"}
      </button>
    </div>
  );
}
