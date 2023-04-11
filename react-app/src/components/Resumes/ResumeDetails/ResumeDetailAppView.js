import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { createATSOptimizedResumeThunk } from '../../../store/resume'
import { authenticate } from '../../../store/session'
import './ResumeDetails.css'
import zipCoverLogo from '../../Navigation/assets/zipcover-logo.png'
import { fetchSingleApplicationThunk } from '../../../store/application'
import { convertResumeTextToHtml, highlightRevisions } from '../../../utils/format'
import copyIcon from '../../Correspondences/AllCorrespondences/assets/copy-icon-grey.png';
import { copyToClipboardFormatted } from '../../../utils/clipboard'


export default function ResumeDetailAppView() {
  const history = useHistory()
  const { applicationId } = useParams();
  const dispatch = useDispatch()
  const resume = useSelector(state => state.resumes.currentResume);
  const user = useSelector(state => state.session.user);
  const hasResume = resume && 'id' in resume
  const outOfCredits = user.generation_balance < 1;
  const application = useSelector(state => state.applications.currentApplication);
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySelected, setCopySelected] = useState(false);
  
  useEffect(() => {
    dispatch(authenticate());
    dispatch(fetchSingleApplicationThunk(applicationId));
  }, [resume?.id])

  const handleEdit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    history.push(`/resumes/${resume.id}/edit`)
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    console.log('current res', resume.resume_text)
      const response = await dispatch(
        // resumeId, jobDescription, companyDetails, engine, applicationId
        createATSOptimizedResumeThunk(
          application.resume_id, // resume id
          resume.resume_text, // resume text,
          `Optimized ${application.job_title}`, // position type,
          resume.skill_level, // skill level
          application.job_description, // job description
          'gpt-3.5-turbo', // engine
          application.id // application id
        ));

      // Check for error in response
      if (response.error) {
        setApiError(response.error);
        await setLoading(false);
      } else {
        await setLoading(false);
      }
  };

  const handleCopyToClipboard = async (resumeText) => {
    // Convert resumeText into HTML format
    const resumeHtml = convertResumeTextToHtml(resumeText);
    await copyToClipboardFormatted(resumeText, resumeHtml);
  };
  

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
          <div 
            className="submit-container submit-cover regenerate-cover"
            onClick={outOfCredits ? () => setShowPopup(prev => !prev) : null}
            onMouseLeave={outOfCredits ? () => setShowPopup(false) : null}
          >
            {showPopup && (
              <div className="popup">
                <img className="option-icon" src={zipCoverLogo} alt="zip-cover-logo" />
                <div>You're out of credits</div>
              </div>
            )}
            <button 
              className={outOfCredits ? 'submit-button-disabled regenerate-button ats-button' : 'submit-button regenerate-button ats-button'}
              onClick={outOfCredits ? null : onSubmit}
            >
              Optimize for ATS
            </button>
          </div>
          <div className={`resume-text letter-text ${loading ? 'anim-border' : ''}`}>
            {apiError && <div className="error-message">{apiError}</div>}
              {(highlightRevisions(resume?.resume_text))}
              <button 
                className="skill-level-box edit-button edit-resume"
                onClick={handleEdit}
              >
                Edit this resume
              </button>
              <img
                src={copyIcon}
                alt="Copy"
                className="copy-icon"
                onClick={(e) => {
                  setCopySelected(true)
                  e.stopPropagation();
                  handleCopyToClipboard(resume.resume_text);
                }}
              />
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
