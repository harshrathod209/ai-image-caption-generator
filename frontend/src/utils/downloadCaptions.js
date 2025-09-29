export function downloadCaptions(captions) {
    const blob = new Blob([captions.join("\n\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "captions.txt";
    link.click();
}
