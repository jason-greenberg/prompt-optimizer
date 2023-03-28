import { useSelector } from 'react-redux'
import './CorrespondenceDropdown.css'

export default function CorrespondenceDropdown() {
  const application = useSelector(state => state.applications.currentApplication)

  return (
    <div className="corr-drop-container">
      <div className="corr-option">
        Application follow-up
      </div>
      <div className="corr-option">
        Initial connection request
      </div>
      <div className="corr-option">
        Informational interview request
      </div>
      <div className="corr-option">
        Thank you after informational interview
      </div>
      <div className="corr-option">
        Thank you after formal job interview
      </div>
      <div className="corr-option">
        Request for feedback after rejection
      </div>
      <div className="corr-option">
        Job offer follow-up
      </div>
      <div className="corr-option">
        Job offer acceptance or decline
      </div>
      <div className="corr-option">
        Reconnection
      </div>
    </div>
  )
}
