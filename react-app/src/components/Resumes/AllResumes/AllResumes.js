import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchAllResumesThunk } from '../../../store/resume'
import Navigation from '../../Navigation'
import './AllResumes.css'

export default function AllResumes() {
  const dispatch = useDispatch();
  const [state, setState] = useState({ isLoaded: false, error: false })

  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchAllResumesThunk())
      if (response.error) {
        setState({ isLoaded: true, error: true })
      } else {
        setState({ isLoaded: true, error: false })
      }
    }
    fetchAsync()
  }, [])

  return (
    <>
      <Navigation />
      { state.isLoaded && !state.error && (
        <div className="all-resumes-container">
          <div className="all-resumes-body">
            <h1>All Resumes</h1>
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
