import "./PromptBox.css";
import { useEffect, useState } from 'react';
import Navigation from "../Navigation";
import { useMenuSelector } from "../../context/Menu";
import { useDispatch, useSelector } from 'react-redux'
import { createResumeThunk } from "../../store/resume";
import { useHistory } from 'react-router-dom'
import { createPromptThunk, fetchAllPromptsThunk } from "../../store/prompt";
import { formatPrompt, formatPromptForCopy } from "../../utils/format";
import copyIcon from "../CoverLetters/CoverLetterDetails/assets/copy-icon-grey.png"
import { copyToClipboardFormatted } from "../../utils/clipboard";
import LoadingDots from "../Loading/LoadingDots";

export default function PromptBox() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setSelectedLink } = useMenuSelector();
  const [prompt, setPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('...')
  const [errors, setErrors] = useState({});
  const gptPrompts = Object.values(useSelector(state => state.prompts.allPrompts));
  const [copySelected, setCopySelected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPromptsThunk())
  }, [])

  useEffect(() => {
  }, [gptPrompts.length])

  const validate = () => {
    const validationErrors = {}

    if (!prompt) validationErrors.positionType = 'Prompt is required.'

    return validationErrors;
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit(e)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    // If no validation errors, submit prompt
    if (!Object.keys(validationErrors).length > 0) {
      // Set loading to true
      setLoading(true);

      const newPrompt = {
        prompt: prompt
      }

      await dispatch(createPromptThunk(newPrompt));
      setLoading(false);
    }
  }

  return (
    <>
      <Navigation />
      <div className="create-resume-page-container">
        <div className="create-resume-body">
          <h1><span className="form-action">Prompt Optimizer</span></h1>
          <div className={`position-type-box resume-input-box ${errors.positionType ? 'error' : ''}`}>
            <div className="input-msg">Enter your LLM prompt below:</div>
            <input 
              type="text" 
              className="position-type-input"
              placeholder='"Create a lesson plan..."'
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value)
                setErrors({...errors, positionType: null})
              }}
              onKeyDown={(e) => handleKeyDown(e)} 
            />
            {errors.positionType && <div className="error-message">{errors.positionType}</div>}
          </div>
          <div className={`skill-box resume-input-box prompt-input-box ${errors.skillLevel ? 'error' : ''}`}>
            <div className="input-msg">Our Prompt</div>
            { loading && (
              <>
                <LoadingDots />
              </>
            )}
            { !loading && (
              <>
                <img
                    src={copyIcon}
                    alt="Copy"
                    className="copy-icon copy-cover"
                    onClick={(e) => {
                      setCopySelected(true)
                      e.stopPropagation();
                      copyToClipboardFormatted((formatPromptForCopy(gptPrompts[gptPrompts.length - 1].prompt)));
                    }}
                  />
                <div>{gptPrompts.length > 0 && formatPrompt(gptPrompts[gptPrompts.length - 1]?.prompt)}</div>
              </>
            )}
          </div>
          <div className="submit-container">
            <button 
              className="submit-button"
              onClick={onSubmit}
            >
              Optimize
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
