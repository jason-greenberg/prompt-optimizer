import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { deleteCoverLetterThunk, fetchSingleCoverLetterThunk, clearCurrentCoverLetter } from '../../../store/coverletter';
import EditCoverLetter from '../EditCoverLetter/EditCoverLetter';
import './CoverLetterDetails.css';

export default function CoverLetterDetails({ selectedSide }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { applicationId } = useParams();
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const coverLetter = useSelector(state => state.coverletters.currentCoverLetter);
  const hasCoverLetter = coverLetter && 'id' in coverLetter
  const [editCover, setEditCover] = useState(false)

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await dispatch(deleteCoverLetterThunk(coverLetter.id));
    if (response.notFound) {
      setNotFound(true);
    } else {
      // Clear the current cover letter from the Redux store
      dispatch(clearCurrentCoverLetter());
      
      // Fetch the updated cover letter data after deletion
      await dispatch(fetchSingleCoverLetterThunk(applicationId));
    }
  };

  return (
    <>
      { hasCoverLetter && editCover && (
        <EditCoverLetter setEditCover={setEditCover} />
      )}
      { hasCoverLetter && !editCover && (
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
                className="skill-level-box edit-button edit-cover"
                onClick={() => setEditCover(true)}
              >
                Edit
              </button>
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
      { !hasCoverLetter && (
        <div className="not-found">
          <h3>This application does not have an associated cover letter</h3>
          <button 
            className="create-button"
            onClick={() => history.push(`/coverletters/add/${applicationId}`)}
          >
            Create a Cover Letter
          </button>
        </div>
      )}
      { notFound && (
        <div className="not-found">
          <h1>Cover Letter Not Found</h1>
        </div>
      )}
    </>
  )
}
