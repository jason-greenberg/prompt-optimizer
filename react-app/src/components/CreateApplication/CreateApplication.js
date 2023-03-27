import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllResumesThunk } from '../../store/resume';
import { createApplicationThunk } from '../../store/application';
import Navigation from '../Navigation';
import './CreateApplication.css';
import { capitalizeResumeTitle, formatDate, getRomanIndex, numberToRoman } from '../../utils/format';
import linkIcon from '../CoverLetters/CreateCoverLetter/assets/link-icon.png'

export default function CreateApplication() {
  const dispatch = useDispatch();
  const allResumes = useSelector(state => state.resumes?.allResumes);
  const allResumesArray = Object.values(allResumes);
  const [selectedResume, setSelectedResume] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    dispatch(fetchAllResumesThunk());
  }, [dispatch]);

  const selectResume = (resumeId) => {
    setSelectedResume(resumeId);
  };

  const validate = () => {
    const validationErrors = {};

    if (!selectedResume) validationErrors.resume = 'Resume is required';
    if (!jobTitle) validationErrors.jobTitle = 'Job title is required';
    if (!jobDescription) validationErrors.jobDescription = 'Job description is required';

    return validationErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (!Object.keys(validationErrors).length > 0) {
      const application = {
        resume_id: selectedResume,
        job_title: jobTitle,
        job_description: jobDescription,
      };

      const response = await dispatch(createApplicationThunk(application));
      if (response.error) {
        alert('Error creating application');
      } else {
        console.log('Application created successfully');
      }
    }
  };

  return (
    <>
      <Navigation />
      {selectedResume ? (
        <>
          <div className="all-resumes-page-container">
            <div className="all-resumes-body">
              <h1>
                <span className="form-action">Create a new</span>{" "}
                <span className="form-title">Application</span>
              </h1>
              <div className="resume-name resume-format">
                <div>
                  {capitalizeResumeTitle(
                    allResumes[selectedResume].position_type
                  ) +
                    ` Resume ${numberToRoman(
                      getRomanIndex(allResumes[selectedResume], allResumesArray)
                    )}`}
                </div>
                <img className="link-icon" src={linkIcon} alt="link-icon" />
              </div>
              <div
                className={`position-type-box resume-input-box ${
                  errors.jobTitle ? "error" : ""
                }`}
              >
                <div className="input-msg">Job Title</div>
                <input
                  type="text"
                  className="position-type-input"
                  placeholder='"Software Engineer I"'
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                {errors.jobTitle && (
                  <div className="error-message">{errors.jobTitle}</div>
                )}
              </div>
              <div
                className={`resume-input-box ${
                  errors.jobDescription ? "error" : ""
                }`}
              >
                <div className="input-msg">Paste Job Description</div>
                <textarea
                  className=""
                  placeholder='"Fullstack Software Engineer I, OpenAI..."'
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
                {errors.jobDescription && (
                  <div className="error-message">{errors.jobDescription}</div>
                )}
              </div>
              <div className="submit-container">
                <button className="submit-button" onClick={onSubmit}>
                  Create Application
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="all-resumes-page-container">
          <div className="all-resumes-body">
            <h1>
              <span className="form-action">Create a new</span>{" "}
              <span className="form-title">Application</span>
            </h1>
            <div className="resume-selector">
              <label htmlFor="resume">Select a Resume:</label>
              <select
                name="resume"
                value={selectedResume}
                onChange={(e) => selectResume(e.target.value)}
              >
                <option value="">-- Select a Resume --</option>
                {allResumesArray.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {capitalizeResumeTitle(resume.position_type)} Resume{" "}
                    {numberToRoman(getRomanIndex(resume, allResumesArray))}
                  </option>
                ))}
              </select>
              {errors.resume && (
                <div className="error-message">{errors.resume}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );  
}  
