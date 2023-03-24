import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMenuSelector } from '../../../context/Menu'
import { fetchAllResumesThunk } from '../../../store/resume';
import { capitalizeResumeTitle, formatDate, getRomanIndex, numberToRoman } from '../../../utils/format';
import Navigation from '../../Navigation'
import './CreateCoverLetter.css'

export default function CreateCoverLetter() {
  const dispatch = useDispatch();
  const history = useHistory()
  const { setSelectedLink } = useMenuSelector()
  const [state, setState] = useState({ isLoaded: false, error: false })
  const allResumes = useSelector(state => state.resumes?.allResumes)
  const allResumesArray = Object.values(allResumes)
  const [selectedResume, setSelectedResume] = useState('')

  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchAllResumesThunk())
      if (response.error) {
        setState({ isLoaded: true, error: true })
      } else {
        setState({ isLoaded: true, error: false })
      }
      await setSelectedLink('resumes')
    }
    fetchAsync()
  }, [dispatch])

  const selectResume = (e, resumeId) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedResume(resumeId)
  }

  return (
    <>
      <Navigation />
      { state.isLoaded && !state.error && (
        <div 
          className="all-resumes-page-container"
        >
          <div className="all-resumes-body">
            <h1><span className="form-action">Create a new</span> <span className="form-title">Cover Letter</span></h1>
            <div>Connect a resume to generate a cover letter</div>
            <div className='resume-input-box'>
              <div className="input-msg">Connect a resume</div>
              <div className="resumes-container">
                { Object.values(allResumes).map((resume) => (
                  <div key={resume.id}>
                    <div 
                      key={resume.id} 
                      className={`resume-overview ${selectedResume === resume.id ? 'selected': ''}`}
                    >
                      <div className="resume-left">
                        <div className="resume-name">
                          {`${capitalizeResumeTitle(resume.position_type)} Resume ${numberToRoman(getRomanIndex(resume, allResumesArray))}`}
                        </div>
                        <div className="dot">•</div>
                        <div className="resume-date">{formatDate(resume.created_at)}</div>
                      </div>
                      <div className="resume-right">
                        <button 
                          className="create-button resume-connect"
                          onClick={(e) => selectResume(e, resume.id)}
                        >
                          Connect
                        </button>

                      </div>
                    </div>
                    <div className="break"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      { state.isLoaded && state.error && (
        <div className="all-resumes-container">
          <div className="all-resumes-body">
            <h3>No resumes found, please try again momentarily</h3>
          </div>
        </div>
      )}
    </>
  )
}
