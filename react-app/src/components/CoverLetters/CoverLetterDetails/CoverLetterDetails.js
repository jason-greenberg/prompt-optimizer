import './CoverLetterDetails.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

export default function CoverLetterDetails({ selectedSide, setSelectedSide }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const { applicationId } = useParams()
  const coverLetter = useSelector(state => state.coverletters?.currentCoverLetter)
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false)

  useEffect(() => {
  }, [applicationId, history]);

  return (
    <>
      { coverLetter && (
        <div className="cover-letter-container">
          <div className="cover-letter-body">
          <div className="resume-text letter-text">
              {coverLetter.letter_text}
              <button 
                className="skill-level-box remove-button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowDeleteDropdown(true)
                }}
              >
                Remove
              </button>

              </div>
          </div>
        </div>
      )}
      { !coverLetter && (
        <div className="not-found">
          <h1>No Cover Letter Found</h1>
        </div>
      )}
    </>
  )
}
