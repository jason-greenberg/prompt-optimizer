import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { deleteResumeThunk, fetchAllResumesThunk, fetchSingleResumeThunk } from '../../../store/resume'
import { capitalizeResumeTitle, numberToRoman, getRomanIndex } from '../../../utils/format'
import Navigation from '../../Navigation'
import './ResumeDetails.css'

export default function ResumeDetails() {
  const { resumeId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const [state, setState] = useState({ isLoaded: false, error: false });
  const resume = useSelector(state => state.resumes.currentResume);
  const allResumes = useSelector(state => state.resumes.allResumes);
  const allResumesArray = Object.values(allResumes);
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false)
  
  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchSingleResumeThunk(resumeId));
      if (response.error) {
        setState({ isLoaded: true, error: true });
      } else {
        setState({ isLoaded: true, error: false });
      }
      await dispatch(fetchAllResumesThunk())
    };
    fetchAsync();
  }, [resumeId]);
  
  const romanNumber = resume ? numberToRoman(getRomanIndex(resume, allResumesArray)) : '';

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    const response = await dispatch(deleteResumeThunk(resumeId));
    if (!response.error) {
      history.push('/dashboard', { resumeDeleted: true });
    } else {
      alert('Error deleting resume, please try again.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    history.push(`/resumes/${resumeId}/edit`)
  }
  

  if (!resume) {
    return (
      <div className="resume-details-container">
          <div className="resume-details-body">
            <h1>Resume Not Found</h1>
          </div>
        </div>
    )
  }

  return (
    <>
      <Navigation />
      {state.isLoaded && !state.error && (
        <div 
          className="resume-details-container"
          onClick={() => setShowDeleteDropdown(false)}
        >
          <div className="resume-details-body">
            <div className="resume-header">
              <div className="header-left">
                <h1 className="resume-title">{capitalizeResumeTitle(resume.position_type) + ` Resume ${numberToRoman(getRomanIndex(resume, allResumesArray))}`}</h1>
                <div className="skill-edit">
                  <div className="skill-level-box">{resume.skill_level}</div>
                  <button 
                    className="skill-level-box edit-button"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div className="header-right">
                { showDeleteDropdown && (
                  <div className="delete-dropdown">
                    <div>Confirm delete?</div>
                    <div className="delete-options">
                      <button 
                        className="delete-option-button delete-option-yes"
                        onClick={handleDelete}
                      >
                        Yes
                      </button>
                      <button 
                        className="delete-option-button delete-option-no"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="resume-text">
              {resume.resume_text}
              <button 
                className="skill-level-box remove-button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowDeleteDropdown(true)
                }}
              >
                Remove
              </button>

              </div>
          </div>
        </div>
      )}
      {state.isLoaded && state.error && (
        <div className="resume-details-container">
          <div className="resume-details-body">
            <h1>Resume Not Found</h1>
          </div>
        </div>
      )}
    </>
  );
  
}
