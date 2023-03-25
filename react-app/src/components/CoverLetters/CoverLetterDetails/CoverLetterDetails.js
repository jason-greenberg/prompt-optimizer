import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { deleteCoverLetterThunk, fetchSingleCoverLetterThunk } from '../../../store/coverletter';
import './CoverLetterDetails.css'

export default function CoverLetterDetails({ coverLetter, selectedSide, onDelete }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { applicationId } = useParams();
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (deleted) {
      // Fetch the updated cover letter data after deletion
      dispatch(fetchSingleCoverLetterThunk(applicationId));
      setDeleted(false);
    }
  }, [deleted, applicationId, dispatch]);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await dispatch(deleteCoverLetterThunk(coverLetter.id));
    if (response.notFound) {
      setNotFound(true);
    } else {
      setDeleted(true);
      // Call the onDelete function passed as a prop
      onDelete(e);
    }
  };

  return (
    <>
      { coverLetter && (
        <div 
          className="cover-letter-container"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowDeleteDropdown(false)
          }}
        >
          <div className="cover-letter-body">
          <div className="resume-text letter-text">
              {coverLetter?.letter_text}
              <button 
                className="skill-level-box remove-button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowDeleteDropdown(prev => !prev)
                }}
              >
                Remove
              </button>
              { showDeleteDropdown && (
                  <div className="delete-dropdown del-cov">
                    <div>Confirm delete?</div>
                    <div className="delete-options">
                      <button 
                        className="delete-option-button delete-option-yes"
                        onClick={handleDelete}
                      >
                        Yes
                      </button>
                      <button 
                        className="delete-option-button delete-option-no"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setShowDeleteDropdown(false)
                        }}
                      > 
                        No
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
      {!coverLetter && !notFound && (
        <div className="not-found">
          <h1>No Cover Letter Found</h1>
        </div>
      )}
      {notFound && (
        <div className="not-found">
          <h1>Cover Letter Not Found</h1>
        </div>
      )}
    </>
  )
}
