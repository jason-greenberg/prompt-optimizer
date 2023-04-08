import { useState, useEffect } from "react";

export default function TypingComponent({
  text = "write a cover letter.",
  interval = 50,
  Markup = "span"
}) {
  const [typedText, setTypedText] = useState("");

  const typingRender = (text, updater, interval, setter, value) => {
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
          //  return setter && setter(value)
        }
      }, interval);
    }
  };
  useEffect(() => {
    typingRender(text, setTypedText, interval);
  }, [text, interval]);

  //   const [showPrompt, setShowPrompt] = useState(true);
  // useEffect(() => {
  //     // Change the state every second or the time given by User.
  //     const interval = setInterval(() => {
  //       setShowPrompt((showPrompt) => !showPrompt);
  //     }, 400);
  //     return () => clearInterval(interval);
  //   }, []);

  return (
    <Markup>
      {typedText}
      {/* <span>{showPrompt ? '_' : ' '}</span> */}
    </Markup>
  );
}
