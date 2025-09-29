export default function CaptionsSection({
  captions,
  copiedIndex,
  onCopy,
  onDownload,
  onClear,
}) {
  return (
    <div className="captions-section">
      <h3>Generated Captions</h3>
      <ul>
        {captions.map((cap, idx) => (
          <li
            key={idx}
            className="caption-card">
            <span>{cap}</span>
            <div className="caption-actions">
              <button onClick={() => onCopy(cap, idx)}>Copy</button>
              {copiedIndex === idx && (
                <span className="copied-tooltip">Copied!</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="caption-buttons">
        <button
          onClick={onDownload}
          className="download-btn">
          Download Captions
        </button>
        <button
          onClick={onClear}
          className="clear-captions-btn">
          Clear All Captions
        </button>
      </div>
    </div>
  );
}
