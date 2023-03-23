import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { deleteResumeThunk, fetchAllResumesThunk, fetchSingleResumeThunk } from '../../../store/resume'
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
  
  const capitalizeResumeTitle = (string) => {
    const output = []
    const arr = string?.split(' ')
    arr?.forEach(word => output.push(word[0]?.toUpperCase() + word.slice(1)?.toLowerCase()))
    return output.join(' ');
  }
  const resumeTitle = resume ? capitalizeResumeTitle(resume.position_type) : ''

  const numberToRoman = (num) => {
    const romanNumerals = [
      ['M', 1000],
      ['CM', 900],
      ['D', 500],
      ['CD', 400],
      ['C', 100],
      ['XC', 90],
      ['L', 50],
      ['XL', 40],
      ['X', 10],
      ['IX', 9],
      ['V', 5],
      ['IV', 4],
      ['I', 1],
    ];
  
    let roman = '';
  
    for (const [numeral, value] of romanNumerals) {
      while (num >= value) {
        roman += numeral;
        num -= value;
      }
    }
  
    return roman;
  }
  const romanNumber = numberToRoman(allResumesArray.length + 1);

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
                <h1 className="resume-title">{resumeTitle + ` Resume ${romanNumber}`}</h1>
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
            <div className="resume-text">{resume.resume_text}</div>
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
