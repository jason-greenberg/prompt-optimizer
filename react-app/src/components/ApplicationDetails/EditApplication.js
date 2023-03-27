import { useState } from 'react';
import { useSelector } from 'react-redux';
import './EditApplication.css';

export default function EditApplication() {
  const application = useSelector(state => state.applications.currentApplication)
  const [jobTitle, setJobTitle] = useState(application.job_title)
  return (
    <div className="edit-container">
      <div className="edit-body">
        <div>Job Title:</div>
        <input 
          type="text"
          className="job-title-in"
          value={jobTitle} 
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <button className="save-button">Save</button>
      </div>
    </div>
  )
}
