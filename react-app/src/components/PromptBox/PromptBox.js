import "./PromptBox.css";
import { useEffect, useState } from 'react';
import Navigation from "../Navigation";
import { useMenuSelector } from "../../context/Menu";
import { useDispatch } from 'react-redux'
import { createResumeThunk } from "../../store/resume";
import { useHistory } from 'react-router-dom'

export default function PromptBox() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setSelectedLink } = useMenuSelector();
  const [resumeText, setResumeText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [skillLevel, setSkillLevel] = useState('Entry Level');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSelectedLink('resumes')
  }, [])

  const validate = () => {
    const validationErrors = {}

    if (!prompt) validationErrors.positionType = 'Prompt is required.'

    return validationErrors;
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    // If no validation errors, submit resume
    if (!Object.keys(validationErrors).length > 0) {
      const newResume = {
        resume_text: resumeText,
        position_type: prompt,
        skill_level: skillLevel
      }

      const resume = await dispatch(createResumeThunk(newResume));
      history.push(`/resumes/${resume.id}`)
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
            <div>...</div>
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
