import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { fetchSingleApplicationThunk } from '../../store/application'
import { fetchAllResumesThunk, fetchSingleResumeThunk } from '../../store/resume'
import { capitalizeResumeTitle, getRomanIndex, numberToRoman } from '../../utils/format'
import Navigation from '../Navigation'
import downArrow from '../Navigation/assets/down-arrow.png'
import './ApplicationDetails.css'

export default function ApplicationDetails() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { applicationId } = useParams()
  const [state, setState] = useState({ isLoaded: false, error: false });
  const application = useSelector(state => state.applications.currentApplication)
  const resume = useSelector(state => state.resumes.currentResume)
  const allResumes = useSelector(state => state.resumes.allResumes)
  const allResumesArray = Object.values(allResumes);

  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchSingleApplicationThunk(applicationId));
      if (response.error) {
        setState({ isLoaded: true, error: true });
      } else {
        await dispatch(fetchAllResumesThunk());
        setState({ isLoaded: true, error: false });
      }
    };
    fetchAsync();
  }, [applicationId, dispatch, history]);

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
                  <div className="manage-menu">
                    <div>Manage</div>
                    <img className="down" src={downArrow} alt="" />
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
                <div className="app-link job-details-link">Job Details</div>
                <div className="app-link correspondence-link">Correspondence</div>
                <div className="app-link cover-letter-link">Cover Letter</div>
                <div className="app-link resume-link">Resume</div>
              </div>
              <div className="materials-right"></div>
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
