import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchSingleResumeThunk } from '../../../store/resume'
import Navigation from '../../Navigation'
import './ResumeDetails.css'

export default function ResumeDetails() {
  const { resumeId } = useParams()
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const resume = useSelector(state => state.resumes.currentResume)

  useEffect(() => {
    const fetchAsync = async () => {
      await dispatch(fetchSingleResumeThunk(resumeId))
      setIsLoaded(true)
    }
    fetchAsync()
  }, [resumeId])

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
      { isLoaded && (
        <div className="resume-details-container">
          <div className="resume-details-body">
            <h1>Resume Details</h1>
            <div>{resume.resume_text}</div>
          </div>
        </div>
      )}
    </>
  )
}
