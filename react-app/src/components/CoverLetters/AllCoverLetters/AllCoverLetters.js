import '../../Resumes/AllResumes/AllResumes.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useMenuSelector } from '../../../context/Menu'
import Navigation from '../../Navigation'
import { fetchAllCoverLettersThunk } from '../../../store/coverletter'

export default function AllCoverLetters() {
  const dispatch = useDispatch()
  const [state, setState] = useState({ isLoaded: false, error: false });
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
  const { setSelectedLink } = useMenuSelector()
  const allCoverLetters = useSelector(state => state.coverletters.allCoverLetters);
  const allCoverLettersArray = Object.values(allCoverLetters)

  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchAllCoverLettersThunk());
      if (response.error) {
        setState({ isLoaded: true, error: true });
      } else {
        setState({ isLoaded: true, error: false });
      }

      await setSelectedLink('coverletters')
    }
    fetchAsync();
  }, [dispatch])

  return (
    <>
      <Navigation />
      { state.isLoaded && !state.error && (
        <div 
          className="all-resumes-page-container"
          onClick={() => setShowDeleteDropdown(prev => prev.map(() => false))}
        >
          <div className="all-resumes-body">
            <h1>
              <span className="form-action">Manage </span>
              <span className="form-title">Cover Letters</span>
            </h1>
            <div>Select a cover letter to view</div>
            <div className="resume-input-box">
              <div className="input-msg"></div>
            </div>
          </div>
        </div>
      )}
      { state.isLoaded && state.error && (
        <div className="all-resumes-container">
          <div className="all-resumes-body">
            <h3>No cover letters found, please try again momentarily</h3>
          </div>
        </div>
      )}
    </>
  )
}
