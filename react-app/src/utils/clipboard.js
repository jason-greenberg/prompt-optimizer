// Function to handle the copy-to-clipboard functionality
export const handleCopyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(
    () => {
    },
    (err) => {
      console.error('Failed to copy text: ', err);
    },
  );
};
