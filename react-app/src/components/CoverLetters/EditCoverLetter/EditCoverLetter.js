import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { fetchSingleApplicationThunk } from '../../../store/application';
import { clearCurrentCoverLetter, deleteCoverLetterThunk, updateCoverLetterThunk } from '../../../store/coverletter';
import './EditCoverLetter.css'

export default function EditCoverLetter({ setEditCover }) {
  const dispatch = useDispatch();
  const coverLetter = useSelector(state => state.coverletters.currentCoverLetter);
  const [letterText, setLetterText] = useState(coverLetter?.letter_text)

  const saveChanges = async () => {
    const newCoverLetter = {
      id: coverLetter.id,
      letter_text: letterText
    }

    await dispatch(updateCoverLetterThunk(newCoverLetter));
    setEditCover(false);
  }

  return (
    <div className="cover-letter-container">
      <div className="cover-letter-body">
      <textarea 
        className="resume-text letter-text edit-letter"
        value={letterText}
        onChange={(e) => setLetterText(e.target.value)}
      >
      </textarea>
      <button 
        className="save-button"
        onClick={saveChanges}
      >
        Save Changes
      </button>
      </div>
    </div>
  )
}
