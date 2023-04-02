import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { useMenuSelector } from '../../context/Menu'
import { fetchSingleApplicationThunk } from '../../store/application'
import { clearCurrentResume, fetchAllResumesThunk, fetchSingleResumeThunk } from '../../store/resume'
import { capitalizeResumeTitle, getRomanIndex, numberToRoman } from '../../utils/format'
import CoverLetterDetails from '../CoverLetters/CoverLetterDetails/CoverLetterDetails'
import Navigation from '../Navigation'
import downArrow from '../Navigation/assets/down-arrow.png'
import './ApplicationDetails.css'
import { clearCurrentCoverLetter, fetchSingleCoverLetterThunk } from '../../store/coverletter';
import JobDetails from './JobDetails'
import ResumeDetailAppView from '../Resumes/ResumeDetails/ResumeDetailAppView'
import EditApplication from './EditApplication'
import DeleteApplication from './DeleteApplication'
import AllCorrespondences from '../Correspondences/AllCorrespondences/AllCorrespondences'
import { fetchCorrespondencesByApplicationIdThunk } from '../../store/correspondence'
import CorrespondenceDropdown from '../Correspondences/CorrespondenceDropdown/CorrespondenceDropdown'

export default function ApplicationDetails() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { applicationId } = useParams()
  const [state, setState] = useState({ isLoaded: false, error: false });
  const application = useSelector(state => state.applications.currentApplication)
  const resume = useSelector(state => state.resumes.currentResume)
  const allResumes = useSelector(state => state.resumes.allResumes)
  const allResumesArray = Object.values(allResumes);
  const coverLettersState = useSelector(state => state.coverletters);
  const allCoverLetters = coverLettersState.allCoverLetters;
  const allCoverLettersArray = Object.values(allCoverLetters);

  const { selectedSide, setSelectedSide } = useMenuSelector();
  const [showManageDropdown, setShowManageDropdown] = useState(false)
  const [showMessageDropdown, setShowMessageDropdown] = useState(false)
  const [editSelected, setEditSelected] = useState(true)
  const [deletedCoverLetterId, setDeletedCoverLetterId] = useState(null);

  const fetchAsync = useCallback(async () => {
    const response = await dispatch(fetchSingleApplicationThunk(applicationId));
    if (response.error) {
      setState({ isLoaded: true, error: true });
    } else {
      await dispatch(fetchAllResumesThunk());
  
      if (application.resume_id && application.resume_id !== null) {
        const resumeResponse = await dispatch(fetchSingleResumeThunk(application?.resume_id));
        if (resumeResponse.error || resumeResponse.notFound) {
          dispatch(clearCurrentResume());
        }
      } else {
        dispatch(clearCurrentResume());
      }
  
      if (application.id) {
        await dispatch(fetchCorrespondencesByApplicationIdThunk(application.id));
      }
  
      // Check if the cover letter exists before fetching it
      if (application.cover_letter_id && application.cover_letter_id !== null) {
        const coverLetterExists = allCoverLetters[application.cover_letter_id];
  
        if (coverLetterExists) {
          const coverLetterResponse = await dispatch(fetchSingleCoverLetterThunk(application?.cover_letter_id));
          if (coverLetterResponse.error || coverLetterResponse.notFound) {
            dispatch(clearCurrentCoverLetter());
          }
        } else {
          dispatch(clearCurrentCoverLetter());
        }
      } else {
        dispatch(clearCurrentCoverLetter());
      }
  
      setState({ isLoaded: true, error: false });
    }
  }, [
    applicationId,
    dispatch,
    deletedCoverLetterId,
    application.cover_letter_id,
    application.resume_id,
    allCoverLettersArray.length,
  ]);   
  
  useEffect(() => {
    fetchAsync();
  }, [fetchAsync]);
   
  

  const handleMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMessageDropdown(prev => !prev);
  }

  return (
    <>
      <Navigation />
      { state.isLoaded && !state.error && (
        <>
          <div 
            className="application-details-container"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowManageDropdown(false)
              setShowMessageDropdown(false)
            }}
          >
            <div className="application-details-body">
              <div className="app-info-box">
                <div className="app-info-left">
                  <div className="job-name">{application?.job_title}</div>
                  {resume && (
                    <>
                      <div className="skill-level-box skill">{resume?.skill_level}</div>
                      <div className="skill-level-box position-type">{resume?.position_type}</div>
                    </>
                  )}
                  <div className="resume-name">
                    {resume && (
                      <>
                        {capitalizeResumeTitle(resume?.position_type) + ` Resume ${numberToRoman(getRomanIndex(resume, allResumesArray))}`}
                      </>
                    )}
                    {!resume && (
                      <>
                        No Associated Resume
                      </>
                    )}
                  </div>
                </div>
                <div className="app-info-right">
                  <div 
                    className="manage-menu"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setShowManageDropdown(prev => !prev)
                    }}
                  >
                    <div>Manage</div>
                    <img className="down" src={downArrow} alt="" />
                    { showManageDropdown && (
                      <div 
                        className="manage-app-dropdown"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                      >
                        <div className="manage-selection">
                          <div 
                            className={`edit-app ${editSelected ? 'selected-edit' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditSelected(true)
                            }}
                          >
                            Edit
                          </div>
                          <div 
                            className={`delete-app ${!editSelected ? 'selected-delete' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditSelected(false)
                            }}
                          >
                            Delete
                          </div>
                        </div>
                        <div className="manage-option">
                          <div className="manage-inner">
                            { editSelected && (
                              <EditApplication />
                            )}
                            { !editSelected && (
                              <DeleteApplication />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="create-button message-recruiter" onClick={handleMessage}>
                    <div>Message Recruiter</div>
                    {showMessageDropdown && (
                      <div className="dropdown-wrapper">
                        <CorrespondenceDropdown />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div 
            className="app-break"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowManageDropdown(false)
              setShowMessageDropdown(false)
            }}
          ></div>
          <div 
            className="app-materials-container"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowManageDropdown(false)
              setShowMessageDropdown(false)
            }}    
          >
            <div className="app-materials">
              <div className="materials-left">
                <div 
                  className={"app-link job-details-link" + (selectedSide === 'job details' ? ' side-select': '')}
                  onClick={() => {
                    setSelectedSide('job details')
                  }}
                >Job Details
                  { selectedSide === 'job details' && (
                    <div className="purple-bar"></div>
                  )}
                </div>
                <div 
                  className={"app-link correspondence-link" + (selectedSide === 'correspondence' ? ' side-select': '')}
                  onClick={() => {
                    setSelectedSide('correspondence')
                  }}
                >Correspondence
                  { selectedSide === 'correspondence' && (
                    <div className="purple-bar"></div>
                  )}
                </div>
                <div 
                  className={"app-link cover-letter-link" + (selectedSide === 'cover letter' ? ' side-select': '')}
                  onClick={() => {
                    setSelectedSide('cover letter')
                  }}
                >Cover Letter
                  { selectedSide === 'cover letter' && (
                    <div className="purple-bar"></div>
                  )}
                </div>
                <div 
                  className={"app-link resume-link" + (selectedSide === 'resume' ? ' side-select': '')}
                  onClick={() => {
                    setSelectedSide('resume')
                  }}
                >Resume
                  { selectedSide === 'resume' && (
                    <div className="purple-bar"></div>
                  )}
                </div>
              </div>
              <div className="materials-right">
                { selectedSide === 'cover letter' && (
                  <CoverLetterDetails 
                    selectedSide={selectedSide}
                    setDeletedCoverLetterId={setDeletedCoverLetterId}
                  />
                )}
                { selectedSide === 'job details' && (
                  <JobDetails />
                )}
                { selectedSide === 'resume' && (
                  <ResumeDetailAppView />
                )}
                { selectedSide === 'correspondence' && (
                  <AllCorrespondences />
                )}
              </div>
            </div>
          </div>
        </>
      )}
      { state.isLoaded && state.error && (
        <div className="application-details-container">
          <div className="application-details-body">
            <h1>Application Not Found</h1>
          </div>
      </div>
      )}
    </>
  )
}
