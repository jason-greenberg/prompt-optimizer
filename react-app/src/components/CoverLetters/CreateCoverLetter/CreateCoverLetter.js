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
import { createCoverLetterThunk } from '../../../store/coverletter';

export default function CreateCoverLetter() {
  const dispatch = useDispatch();
  const history = useHistory()
  const { setSelectedLink, setSelectedSide } = useMenuSelector()
  const [state, setState] = useState({ isLoaded: false, error: false })
  const allResumes = useSelector(state => state.resumes?.allResumes)
  const resume = useSelector(state => state.resumes?.currentResume)
  const allResumesArray = Object.values(allResumes)
  const [selectedResume, setSelectedResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchAllResumesThunk())
      if (response.error) {
        setState({ isLoaded: true, error: true })
      } else {
        setState({ isLoaded: true, error: false })
      }
      await setSelectedLink('coverletters')
    }
    fetchAsync()
  }, [dispatch])

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false)
  //   }, 300);

  //   return () => {
  //     clearTimeout(timer)
  //   }
  // }, [selectedResume])

  const selectResume = async (e, resumeId) => {
    e.preventDefault();
    e.stopPropagation();

    await setSelectedResume(resumeId);
    await dispatch(fetchSingleResumeThunk(resumeId));
  }

  const validate = () => {
    const validationErrors = {};

    if (!jobDescription) validationErrors.jobDescription = 'Job Description is required';
    if (!companyDetails) validationErrors.companyDetails = 'Company Details are required';
    if (!jobTitle) validationErrors.jobTitle = 'Job title is required';

    return validationErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    // If no validation errors, submit resume
    if (!Object.keys(validationErrors).length > 0) {
      setLoading(true)
      const response = await dispatch(
        createCoverLetterThunk(
          resume.id, // resume id
          jobDescription, // job description
          companyDetails, // company details
          'gpt-3.5-turbo', // engine
          jobTitle // job title
        ));
      await setSelectedSide('cover letter'); // sets up view in application details
      history.push(`/applications/${response.application.id}`);
    }
  };

  return (
    <>
      <Navigation />
      { loading && <LoadingDefault /> }
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
                  <div className={`position-type-box resume-input-box ${errors.jobTitle ? 'error' : ''}`}>
                    <div className="input-msg">Job Title</div>
                    <input 
                      type="text" 
                      className="position-type-input"
                      placeholder='"Software Engineer I"'
                      value={jobTitle}
                      onChange={(e) => {
                        setJobTitle(e.target.value)
                        setErrors({...errors, jobTitle: null})
                      }} 
                    />
                    {errors.jobTitle && <div className="error-message">{errors.jobTitle}</div>}
                  </div>
                  <div className={`resume-input-box ${errors.jobDescription ? 'error' : ''}`}>
                    <div className="input-msg">Paste Job Description</div>
                    <textarea 
                      className=""
                      placeholder='"Fullstack Software Engineer I, OpenAI..."'
                      value={jobDescription}
                      onChange={(e) => {
                        const cleanedText = e.target.value.replace(/\s{3,}/g, ' '); //remove triple whitespaces
                        setJobDescription(cleanedText);
                        setErrors({...errors, jobDescrition: null})
                      }}
                    >
                    </textarea>
                    {errors.jobDescription && <div className="error-message">{errors.jobDescription}</div>}
                  </div>
                <div className={`position-type-box resume-input-box ${errors.companyDetails ? 'error' : ''}`}>
                  <div className="input-msg">Paste Company Details</div>
                  <textarea 
                    className=""
                    placeholder={`The best coverletters are tailored specifically to a company. Here is what works best for this box:
    
    1.  A recent news article or press release regarding company activities (this is ideal!)
    
    2.  A detailed 'About' section from a company website or job site
                    `}
                    value={companyDetails}
                    onChange={(e) => {
                      const cleanedText = e.target.value.replace(/\s{3,}/g, ' '); //remove triple whitespaces
                      setCompanyDetails(cleanedText);
                      setErrors({...errors, companyDetails: null})
                    }}
                  >
                  </textarea>
                  {errors.companyDetails && <div className="error-message">{errors.companyDetails}</div>}
                </div>
                <div className="submit-container">
                  <button 
                    className="submit-button"
                    onClick={onSubmit}
                  >
                    Create Cover Letter
                  </button>
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
                    { Object.values(allResumes).reverse().map((resume, index) => (
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
                        { index < Object.values(allResumes).length - 1 && (
                          <div className="break"></div>
                        )}
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
