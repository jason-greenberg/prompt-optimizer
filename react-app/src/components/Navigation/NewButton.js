import { useState } from 'react'
import './NewButton.css'
import cvIcon from './assets/cv-icon.png'
import coverLetterIcon from './assets/zipcover-logo.png'
import { useHistory } from 'react-router-dom';

export default function NewButton() {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const history = useHistory()

  const toggleMenu = () => {
    setShowCreateMenu(prev => !prev);
  }

  return (
    <div className="create-container">
      <button
        className="create-button"
        onClick={toggleMenu}
      >
        <span>New</span>
        <span className="plus">+</span>
      </button>
      { showCreateMenu && (
        <div className="profile-dropdown create-dropdown-container">
          <div 
            className="option-container"
            onClick={() => history.push('/coverletters/new')}
          >
            <img className="option-icon" src={coverLetterIcon} alt="option-icon" />
            <div>Cover Letter</div>
          </div>
          <div 
            className="option-container"
            onClick={() => history.push('/applications/new')}
          >
            <img className="option-icon" src={coverLetterIcon} alt="option-icon" />
            <div>Job Application</div>
          </div>
          <div 
            className="option-container"
            onClick={() => history.push('/resumes/new')}
          >
            <img className="option-icon" src={cvIcon} alt="option-icon" />
            <div>Resume Upload</div>
          </div>
        </div>
      )}
    </div>
  )
}
