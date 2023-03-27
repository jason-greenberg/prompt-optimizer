import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { useMenuSelector } from '../../context/Menu'
import { fetchSingleApplicationThunk } from '../../store/application'
import { fetchAllResumesThunk, fetchSingleResumeThunk } from '../../store/resume'
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

export default function ApplicationDetails() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { applicationId } = useParams()
  const [state, setState] = useState({ isLoaded: false, error: false });
  const application = useSelector(state => state.applications.currentApplication)
  const resume = useSelector(state => state.resumes.currentResume)
  const allResumes = useSelector(state => state.resumes.allResumes)
  const allResumesArray = Object.values(allResumes);
  const { selectedSide, setSelectedSide } = useMenuSelector();
  const [showManageDropdown, setShowManageDropdown] = useState(false)
  const [editSelected, setEditSelected] = useState(true)

  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchSingleApplicationThunk(applicationId));
      if (response.error) {
        setState({ isLoaded: true, error: true });
      } else {
        await dispatch(fetchAllResumesThunk());
        await dispatch(fetchSingleResumeThunk(application.resume_id))
        // Fetch the cover letter and handle the 404 case
        const coverLetterResponse = await dispatch(fetchSingleCoverLetterThunk(applicationId));
        if (coverLetterResponse.error) {
          dispatch(clearCurrentCoverLetter());
        }
        
        setState({ isLoaded: true, error: false });
      }
    };
    fetchAsync();
  }, [applicationId, dispatch, history, selectedSide]);

  return (
    <>
      <Navigation />
      { state.isLoaded && !state.error && (
        <>
          <div className="application-details-container">
            <div className="application-details-body">
              <div className="app-info-box">
                <div className="app-info-left">
                  <div className="job-name">{application?.job_title}</div>
                  <div className="skill-level-box skill">{resume?.skill_level}</div>
                  <div className="skill-level-box position-type">{resume?.position_type}</div>
                  <div className="resume-name">
                    {capitalizeResumeTitle(resume?.position_type) + ` Resume ${numberToRoman(getRomanIndex(resume, allResumesArray))}`}
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
                  <button className="create-button message-recruiter">Message Recruiter</button>
                </div>
              </div>
            </div>
          </div>
          <div className="app-break"></div>
          <div className="app-materials-container">
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
                  />
                )}
                { selectedSide === 'job details' && (
                  <JobDetails />
                )}
                { selectedSide === 'resume' && (
                  <ResumeDetailAppView />
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
