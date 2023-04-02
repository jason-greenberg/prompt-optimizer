import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './ResumeDetails.css'

export default function ResumeDetailAppView() {
  const history = useHistory()
  const resume = useSelector(state => state.resumes.currentResume);
  const hasResume = resume && 'id' in resume
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false)

  const handleEdit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    history.push(`/resumes/${resume.id}/edit`)
  }

  return (
    <>
      {hasResume && (
        <div 
          className="cover-letter-container"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowDeleteDropdown(false)
          }}
        >
          <div className="cover-letter-body">
          <div className="resume-text letter-text">
              {resume?.resume_text}
              <button 
                className="skill-level-box edit-button edit-resume"
                onClick={handleEdit}
              >
                Edit this resume
              </button>
            </div>
          </div>
        </div>
      )}
      {!hasResume && (
        <div className="cover-letter-container">
          <div className="resume-details-body">
            <h1>Resume Not Found</h1>
            <p>The resume associated with this job application has been deleted.</p>
            <p>To connect a new resume to this job application:</p>
            <p>1. If there are no resumes uploaded to your account, you will need to upload a resume.</p>
            <p>2. Select 'Manage' and choose from the list of available resumes.</p>
          </div>
        </div>
      )}
    </>
  );
  
}
