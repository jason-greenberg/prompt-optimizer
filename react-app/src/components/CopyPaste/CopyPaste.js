import { useState } from "react";
import { copyToClipboardFormatted } from "../../utils/clipboard";
import { formatPromptForCopy } from "../../utils/format";
import copyIcon from "../CoverLetters/CoverLetterDetails/assets/copy-icon-grey.png"

export default function CopyPaste({ textToCopy }) {
  const [copySelected, setCopySelected] = useState(false);
  
  return (
    <img
      src={copyIcon}
      alt="Copy"
      className="copy-icon copy-cover"
      onClick={(e) => {
        setCopySelected(true)
        e.stopPropagation();
        copyToClipboardFormatted(textToCopy);
      }}
    />
  )
}
