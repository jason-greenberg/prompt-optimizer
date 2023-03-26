import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { fetchSingleApplicationThunk } from '../../../store/application';
import { clearCurrentCoverLetter, deleteCoverLetterThunk } from '../../../store/coverletter';
import './EditCoverLetter.css'

export default function EditCoverLetter({ setEditCover }) {
  const dispatch = useDispatch();
  const coverLetter = useSelector(state => state.coverletters.currentCoverLetter);
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { applicationId } = useParams();

  return (
    <div className="cover-letter-container">
      <div className="cover-letter-body">
      <textarea 
        className="resume-text letter-text edit-letter"
        value={coverLetter?.letter_text}
      >
      </textarea>
      <button 
        className="save-button"
      >
        Save Changes
      </button>
      </div>
    </div>
  )
}
