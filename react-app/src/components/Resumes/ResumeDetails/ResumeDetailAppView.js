import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { useMenuSelector } from '../../../context/Menu'
import { deleteResumeThunk, fetchAllResumesThunk, fetchSingleResumeThunk } from '../../../store/resume'
import { capitalizeResumeTitle, numberToRoman, getRomanIndex } from '../../../utils/format'
import Navigation from '../../Navigation'
import './ResumeDetails.css'

export default function ResumeDetailAppView() {
  const { applicationId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const resume = useSelector(state => state.resumes.currentResume);
  const allResumes = useSelector(state => state.resumes.allResumes);
  const hasResume = resume && 'id' in resume
  const allResumesArray = Object.values(allResumes);
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false)
  const { setSelectedSide } = useMenuSelector();
  const [editResume, setEditResume] = useState(false)

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    const response = await dispatch(deleteResumeThunk(resume.id));
    if (!response.error) {
      history.push('/dashboard', { resumeDeleted: true });
    } else {
      alert('Error deleting resume, please try again.');
    }
  };

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
          <div className="cover-letter-body">
            <h1>Resume Not Found</h1>
          </div>
        </div>
      )}
    </>
  );
  
}
