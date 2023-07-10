import "./PromptBox.css";
import { useEffect, useState } from 'react';
import Navigation from "../Navigation";
import { useMenuSelector } from "../../context/Menu";
import { useDispatch, useSelector } from 'react-redux'
import { createResumeThunk } from "../../store/resume";
import { useHistory } from 'react-router-dom'
import { createPromptThunk, fetchAllPromptsThunk } from "../../store/prompt";

export default function PromptBox() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setSelectedLink } = useMenuSelector();
  const [prompt, setPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('...')
  const [errors, setErrors] = useState({});
  const gptPrompts = Object.values(useSelector(state => state.prompts.allPrompts));

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

  const onSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    // If no validation errors, submit prompt
    if (!Object.keys(validationErrors).length > 0) {
      const newPrompt = {
        prompt: prompt
      }

      await dispatch(createPromptThunk(newPrompt));
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
            />
            {errors.positionType && <div className="error-message">{errors.positionType}</div>}
          </div>
          <div className={`skill-box resume-input-box ${errors.skillLevel ? 'error' : ''}`}>
            <div className="input-msg">Our Prompt</div>
            <div>{gptPrompts && gptPrompts[gptPrompts.length - 1]?.prompt}</div>
            {errors.skillLevel && <div className="error-message">{errors.skillLevel}</div>}
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
