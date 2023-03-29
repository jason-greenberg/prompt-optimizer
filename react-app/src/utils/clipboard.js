// Function to handle the copy-to-clipboard functionality
export const handleCopyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
};
