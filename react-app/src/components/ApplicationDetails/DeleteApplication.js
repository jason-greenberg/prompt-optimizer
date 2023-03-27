import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { deleteApplicationThunk } from '../../store/application';
import './EditApplication.css'

export default function DeleteApplication() {
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
  const dispatch = useDispatch()
  const history = useHistory();
  const { applicationId } = useParams()

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation();

    const response = await dispatch(deleteApplicationThunk(applicationId))
    if (!response.error) {
      history.push('/dashboard', { applicationDeleted: true })
    } else {
      alert('Error deleting application, please try again.')
    }
  }

  return (
    <div className="edit-container">
      <button 
        className="skill-level-box delete-button del-app"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowDeleteDropdown(prev => !prev)
        }}
      >
        Delete Application
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
  )
}
