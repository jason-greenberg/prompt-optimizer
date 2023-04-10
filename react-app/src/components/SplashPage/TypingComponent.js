import { useState, useEffect } from "react";

const PAUSE_DURATION = {
  letter: 20,
  punctuation: 80,
  whitespace: 40,
};

const getPauseDuration = (char) => {
  if (/\s/.test(char)) {
    return PAUSE_DURATION.whitespace;
  }
  if (/[.,?!;:]/.test(char)) {
    return PAUSE_DURATION.punctuation;
  }
  return PAUSE_DURATION.letter;
};

export default function TypingComponent({
  text = "write a cover letter.",
  Markup = "span",
}) {
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingInProgress, setTypingInProgress] = useState(false);

  const typingRender = (text, updater) => {
    let localTypingIndex = 0;
    let localTyping = "";
    if (text) {
      const typeCharacter = () => {
        if (localTypingIndex < text.length) {
          setTypingInProgress(true);
          updater((localTyping += text[localTypingIndex]));
          localTypingIndex += 1;
          setTimeout(() => {
            setTypingInProgress(false);
            typeCharacter();
          }, getPauseDuration(text[localTypingIndex - 1]));
        } else {
          localTypingIndex = 0;
          localTyping = "";
          setTypingInProgress(false); // Reset the typingInProgress state
        }
      };
      typeCharacter();
    }
  };

  useEffect(() => {
    typingRender(text, setTypedText);
  }, [text]);

  useEffect(() => {
    if (!typingInProgress && typedText === text) {
      const cursorInterval = setInterval(() => {
        if (!typingInProgress && typedText === text) {
          setCursorVisible((prev) => !prev);
        } else {
          setCursorVisible(true)
        }
      }, 500);
      return () => clearInterval(cursorInterval);
    } else {
      setCursorVisible(true)
    }
  }, [typingInProgress, text]);

  const cursorStyle = {
    color: "#5DEBC4",
    marginLeft: "0px",
    opacity: cursorVisible ? 1 : 0,
    transition: "opacity 0.25s",
    fontWeight: "700",
  };

  return (
    <Markup>
      {typedText}
      <span className="cursor" style={cursorStyle}>|</span>
    </Markup>
  );
}
