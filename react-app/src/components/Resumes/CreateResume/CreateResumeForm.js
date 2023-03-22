import { useEffect } from 'react'
import Navigation from '../../Navigation'
import { useMenuSelector } from '../../../context/Menu'
import './CreateResume.css'

export default function CreateResumeForm() {
  const { setSelectedLink } = useMenuSelector()

  useEffect(() => {
    setSelectedLink('resumes')
  }, [])

  return (
    <>
      <Navigation />
      <div className="create-resume-page-container">
        <div className="create-resume-body">
          <h1>Upload a new Resume</h1>
          <div>Paste your resume below</div>
        </div>
      </div>
    </>
  )
}
