import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateApplicationThunk } from '../../store/application';
import { fetchSingleResumeThunk } from '../../store/resume';
import { capitalizeResumeTitle, formatDate, getRomanIndex, numberToRoman } from '../../utils/format';
import AllResumes from '../Resumes/AllResumes/AllResumes';
import './EditApplication.css';

export default function EditApplication() {
  const dispatch = useDispatch();
  const application = useSelector(state => state.applications?.currentApplication)
  const allResumes = useSelector(state => state.resumes?.allResumes);
  const allResumesArray = Object.values(allResumes);
  const [jobTitle, setJobTitle] = useState(application?.job_title)
  const { applicationId } = useParams();
  const [selectedResume, setSelectedResume] = useState(application?.resume_id)

  const handleSave = async () => {
    await dispatch(updateApplicationThunk({
      id: applicationId,
      job_title: jobTitle
    }));
  }

  useEffect(() => {
    if (selectedResume) {
      dispatch(updateApplicationThunk({
        id: applicationId,
        resume_id: selectedResume,
      }));
    }
  }, [selectedResume, applicationId, dispatch]);

  const selectResume = async (e, resumeId) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedResume(resumeId);
  };

  return (
    <div className="edit-container">
      <div className="edit-body">
        <div className="edit-job-title">
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
        <div className="edit-connected-resume">
          <div className="set-resume-msg">Set resume</div>
          <div className="resumes-container">
            { Object.values(allResumes).reverse().map((resume) => (
              <div key={resume.id}>
                <div 
                  key={resume.id} 
                  className={`resume-overview ${selectedResume === resume.id ? 'selected': ''}`}
                >
                  <div className="resume-left">
                    <div className="resume-name res-name">
                      {`${capitalizeResumeTitle(resume.position_type)} Resume ${numberToRoman(getRomanIndex(resume, allResumesArray))}`}
                    </div>
                    <div className="dot">•</div>
                    <div className="resume-date res-date">{formatDate(resume.created_at)}</div>
                  </div>
                  <div className="resume-right">
                    <button 
                      className={`create-button resume-connect ${selectedResume === resume.id ? 'selected' : ''}`}
                      onClick={(e) => selectResume(e, resume.id)}
                    >
                      {
                        selectedResume === resume.id ? 
                        <div className="connected check">
                          ✓
                        </div>
                        : <div>Connect</div>
                      }
                    </button>

                  </div>
                </div>
                <div className="break"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
