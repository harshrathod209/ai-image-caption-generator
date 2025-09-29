export default function FileDropZone({
  file,
  preview,
  onFileChange,
  onClear,
  fileInputRef,
}) {
  return (
    <>
      <div
        className={`file-drop-zone ${file ? "has-file" : ""}`}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}>
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="preview-image-drop"
          />
        ) : (
          <p>Click or drag & drop an image here</p>
        )}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={onFileChange}
          className="hidden-input"
        />
      </div>
      {file && (
        <button
          className="clear-btn"
          onClick={onClear}>
          Clear Image
        </button>
      )}
    </>
  );
}
