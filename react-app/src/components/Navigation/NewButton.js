import { useState } from 'react'
import './NewButton.css'
import cvIcon from './assets/cv-icon.png'
import coverLetterIcon from './assets/zipcover-logo.png'

export default function NewButton() {
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const toggleMenu = () => {
    console.log('toggle')
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
          <div className="option-container">
            <img className="option-icon" src={coverLetterIcon} alt="sign-out-icon" />
            <div>Cover Letter</div>
          </div>
          <div className="option-container">
            <img className="option-icon" src={coverLetterIcon} alt="sign-out-icon" />
            <div>Job Application</div>
          </div>
          <div className="option-container">
            <img className="option-icon" src={cvIcon} alt="sign-out-icon" />
            <div>Resume Upload</div>
          </div>
        </div>
      )}
    </div>
  )
}
