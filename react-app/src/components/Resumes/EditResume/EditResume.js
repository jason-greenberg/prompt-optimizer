import '../CreateResume/CreateResume.css'
import { useEffect, useState } from 'react'
import Navigation from '../../Navigation'
import { useMenuSelector } from '../../../context/Menu'
import { useDispatch } from 'react-redux'
import { updateResumeThunk } from '../../../store/resume'
import { useHistory } from 'react-router-dom'

export default function EditResume() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setSelectedLink } = useMenuSelector();
  const [resumeText, setResumeText] = useState('');
  const [positionType, setPositionType] = useState('');
  const [skillLevel, setSkillLevel] = useState('Entry Level');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSelectedLink('resumes')
  }, [])

  const validate = () => {
    const validationErrors = {}

    if (!resumeText) validationErrors.resumeText = 'Resume text is required'
    if (!positionType) validationErrors.positionType = 'Postion type is required'
    if (positionType && positionType.split(' ').length > 3) validationErrors.positionType = 'Position type must be less than 3 words'
    if (!skillLevel) validationErrors.skillLevel = 'Skill level is required'

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
        position_type: positionType,
        skill_level: skillLevel
      }

      const resume = await dispatch(updateResumeThunk(newResume));
      history.push(`/resumes/${resume.id}`)
    }
  }

  return (
    <>
      <Navigation />
      <div className="create-resume-page-container">
        <div className="create-resume-body">
          <h1><span className="form-action">Edit</span> <span className="form-title">Resume</span></h1>
          <div>Update your resume details below</div>
          <div className={`resume-input-box ${errors.resumeText ? 'error' : ''}`}>
            <div className="input-msg">Paste resume</div>
            <textarea 
              placeholder='"Satya Nadella, Redmond WA..."'
              value={resumeText}
              onChange={(e) => {
                const cleanedText = e.target.value.replace(/\s{3,}/g, ' '); //remove triple whitespaces
                setResumeText(cleanedText);
                setErrors({...errors, resumeText: null})
              }}
            >
            </textarea>
            {errors.resumeText && <div className="error-message">{errors.resumeText}</div>}
          </div>
          <div className={`position-type-box resume-input-box ${errors.positionType ? 'error' : ''}`}>
            <div className="input-msg">Describe in 1-3 words the types of positions this resume is for</div>
            <input 
              type="text" 
              className="position-type-input"
              placeholder='"Fullstack"'
              value={positionType}
              onChange={(e) => {
                setPositionType(e.target.value)
                setErrors({...errors, positionType: null})
              }} 
            />
            {errors.positionType && <div className="error-message">{errors.positionType}</div>}
          </div>
          <div className={`resume-input-box ${errors.skillLevel ? 'error' : ''}`}>
            <div className="input-msg">Select Target Skill Level</div>
            <select
              className="select-level-input"
              value={skillLevel}
              onChange={(e) => {
                setSkillLevel(e.target.value)
                setErrors({...errors, skillLevel: null})
              }}
            >
              <option value="Entry Level" key="entry">Entry Level</option>
              <option value="Mid Level" key="Mid">Mid Level</option>
              <option value="Senior Level" key="Senior">Senior Level</option>
            </select>
            {errors.skillLevel && <div className="error-message">{errors.skillLevel}</div>}
          </div>
          <div className="submit-container">
            <button 
              className="submit-button"
              onClick={onSubmit}
            >
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
