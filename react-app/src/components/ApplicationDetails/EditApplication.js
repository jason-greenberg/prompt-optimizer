import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateApplicationThunk } from '../../store/application';
import './EditApplication.css';

export default function EditApplication() {
  const dispatch = useDispatch();
  const application = useSelector(state => state.applications.currentApplication)
  const [jobTitle, setJobTitle] = useState(application.job_title)
  const { applicationId } = useParams();

  const handleSave = async () => {
    await dispatch(updateApplicationThunk({
      id: applicationId,
      job_title: jobTitle
    }));
  }

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
        <button 
          className="save-button"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  )
}
