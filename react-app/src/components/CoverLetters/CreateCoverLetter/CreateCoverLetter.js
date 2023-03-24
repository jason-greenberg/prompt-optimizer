import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMenuSelector } from '../../../context/Menu'
import { fetchAllResumesThunk, fetchSingleResumeThunk } from '../../../store/resume';
import { capitalizeResumeTitle, formatDate, getRomanIndex, numberToRoman } from '../../../utils/format';
import Navigation from '../../Navigation'
import './CreateCoverLetter.css'
import LoadingDefault from '../../Loading/LoadingDefault';
import linkIcon from './assets/link-icon.png'

export default function CreateCoverLetter() {
  const dispatch = useDispatch();
  const history = useHistory()
  const { setSelectedLink } = useMenuSelector()
  const [state, setState] = useState({ isLoaded: false, error: false })
  const allResumes = useSelector(state => state.resumes?.allResumes)
  const resume = useSelector(state => state.resumes?.currentResume)
  const allResumesArray = Object.values(allResumes)
  const [selectedResume, setSelectedResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [jobDescrition, setJobDescription] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 300);

    return () => {
      clearTimeout(timer)
    }
  }, [selectedResume])

  const selectResume = async (e, resumeId) => {
    e.preventDefault();
    e.stopPropagation();

    await setSelectedResume(resumeId);
    await dispatch(fetchSingleResumeThunk(resumeId))
    await setLoading(true);
  }

  return (
    <>
      <Navigation />
      { loading && <LoadingDefault />}
      { state.isLoaded && !state.error && !loading && (
        <>
          { (selectedResume !== '') && (
          <div 
              className="all-resumes-page-container"
            >
              <div className="all-resumes-body">
                <h1><span className="form-action">Create a new</span> <span className="form-title">Cover Letter</span></h1>
                  <div className="resume-name resume-format">
                    <div>{capitalizeResumeTitle(resume.position_type) + ` Resume ${numberToRoman(getRomanIndex(resume, allResumesArray))}`}</div>
                    <img className="link-icon" src={linkIcon} alt="link-icon" />
                  </div>
                  <div className={`resume-input-box ${errors.resumeText ? 'error' : ''}`}>
                  <div className="input-msg">Paste resume</div>
                  <textarea 
                    placeholder='"Satya Nadella, Redmond WA..."'
                    value={jobDescrition}
                    onChange={(e) => {
                      const cleanedText = e.target.value.replace(/\s{3,}/g, ' '); //remove triple whitespaces
                      setJobDescription(cleanedText);
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
                    value={companyDetails}
                    onChange={(e) => {
                      setCompanyDetails(e.target.value)
                      setErrors({...errors, positionType: null})
                    }} 
                  />
                  {errors.positionType && <div className="error-message">{errors.positionType}</div>}
                </div>
                </div>
              </div>
          )}
          { !selectedResume && (
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
                              className={`create-button resume-connect ${selectedResume === resume.id ? 'selected' : ''}`}
                              onClick={(e) => selectResume(e, resume.id)}
                            >
                              {
                                selectedResume === resume.id ? 
                                <div className="connected">
                                  <img className="loading-icon" src={loading} alt="link-icon" />
                                </div>
                                : <div>Connect</div>
                              }
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
        </>
      )}
      { state.isLoaded && state.error && !loading && (
        <div className="all-resumes-container">
          <div className="all-resumes-body">
            <h3>No resumes found, please try again momentarily</h3>
          </div>
        </div>
      )}
    </>
  )
}
