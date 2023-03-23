import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchSingleResumeThunk } from '../../../store/resume'
import Navigation from '../../Navigation'
import './ResumeDetails.css'

export default function ResumeDetails() {
  const { resumeId } = useParams()
  const dispatch = useDispatch()
  const [state, setState] = useState({ isLoaded: false, error: false });
  const resume = useSelector(state => state.resumes.currentResume)

  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchSingleResumeThunk(resumeId));
      if (response.error) {
        setState({ isLoaded: true, error: true });
      } else {
        setState({ isLoaded: true, error: false });
      }
    };
    fetchAsync();
  }, [resumeId]);
  

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
        <div className="resume-details-container">
          <div className="resume-details-body">
            <h1>Resume Details</h1>
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
