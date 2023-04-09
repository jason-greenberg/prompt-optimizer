import { useState, useEffect } from "react";

export default function TypingComponent({
  text = "write a cover letter.",
  interval = 50,
  Markup = "span"
}) {
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  const typingRender = (text, updater, interval) => {
    let localTypingIndex = 0;
    let localTyping = "";
    if (text) {
      let printer = setInterval(() => {
        if (localTypingIndex < text.length) {
          updater((localTyping += text[localTypingIndex]));
          localTypingIndex += 1;
        } else {
          localTypingIndex = 0;
          localTyping = "";
          clearInterval(printer);
        }
      }, interval);
    }
  };

  useEffect(() => {
    typingRender(text, setTypedText, interval);
  }, [text, interval]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const cursorStyle = {
    color: "#0AE0B6",
    marginLeft: "2px",
    opacity: cursorVisible ? 1 : 0,
    transition: "opacity 0.25s",
    fontWeight: "700"
  };

  return (
    <Markup>
      {typedText}
      <span style={cursorStyle}>|</span>
    </Markup>
  );
}
