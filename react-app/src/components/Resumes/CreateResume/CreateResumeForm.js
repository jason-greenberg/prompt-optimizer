import { useEffect, useState } from 'react'
import Navigation from '../../Navigation'
import { useMenuSelector } from '../../../context/Menu'
import './CreateResume.css'

export default function CreateResumeForm() {
  const { setSelectedLink } = useMenuSelector();
  const [resumeText, setResumeText] = useState('');
  const [positionType, setPositionType] = useState('');
  const [skillLevel, setSkillLevel] = useState('');

  useEffect(() => {
    setSelectedLink('resumes')
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()

  }

  return (
    <>
      <Navigation />
      <div className="create-resume-page-container">
        <div className="create-resume-body">
          <h1>Upload a new Resume</h1>
          <div>Paste your resume below</div>
          <div className="resume-text-box">
            <div>Paste resume</div>
            <textarea 
              cols="30" 
              rows="10"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            >
            </textarea>
          </div>
          <div className="position-type-box">
            <div>Describe in 1-3 words the types of positions this resume is for</div>
            <input 
              type="text" 
              placeholder='"Fullstack"'
              value={positionType}
              onChange={(e) => setPositionType(e.target.value)} 
            />
          </div>
          <div className="skill-level-box">
            <div>Select Target Skill Level</div>
            <select
              className="select-level-input"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option value="" selected disabled hidden>Select</option>
              <option value="Entry Level" key="entry">Entry Level</option>
              <option value="Mid Level" key="Mid">Mid Level</option>
              <option value="Senior Level" key="Senior">Senior Level</option>
            </select>
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
