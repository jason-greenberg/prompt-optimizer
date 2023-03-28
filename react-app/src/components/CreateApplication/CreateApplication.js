import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllResumesThunk } from '../../store/resume';
import { createApplicationThunk } from '../../store/application';
import Navigation from '../Navigation';
import './CreateApplication.css';
import { capitalizeResumeTitle, formatDate, getRomanIndex, numberToRoman } from '../../utils/format';
import linkIcon from '../CoverLetters/CreateCoverLetter/assets/link-icon.png'
import { useMenuSelector } from '../../context/Menu';
import { useHistory } from 'react-router-dom';

export default function CreateApplication() {
  const dispatch = useDispatch();
  const history = useHistory()
  const allResumes = useSelector(state => state.resumes?.allResumes);
  const allResumesArray = Object.values(allResumes);
  const [selectedResume, setSelectedResume] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ isLoaded: false, error: false })
  const { setSelectedLink, setSelectedSide } = useMenuSelector()

  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchAllResumesThunk());
      if (response.error) {
        setState({ isLoaded: true, error: true })
      } else {
        setState({ isLoaded: true, error: false })
      }
      await setSelectedLink('dashboard')
    }
    fetchAsync();
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
        await setSelectedSide('job details')
        history.push(`/applications/${response.id}`);
      }
    }
  };

  return (
    <>
      <Navigation />
      {state.isLoaded && !state.error && !loading && (
        selectedResume ? (
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
                      allResumes[selectedResume]?.position_type
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
              <div>Connect a resume to generate a cover letter</div>
              <div className="resume-input-box">
                <div className="input-msg">Connect a resume</div>
                <div className="resumes-container">
                  {Object.values(allResumes).map((resume) => (
                    <div key={resume.id}>
                      <div
                        key={resume.id}
                        className={`resume-overview ${
                          selectedResume === resume.id ? "selected" : ""
                        }`}
                      >
                        <div className="resume-left">
                          <div className="resume-name">
                            {`${capitalizeResumeTitle(
                              resume?.position_type
                            )} Resume ${numberToRoman(
                              getRomanIndex(resume, allResumesArray)
                            )}`}
                          </div>
                          <div className="dot">•</div>
                          <div className="resume-date">
                            {formatDate(resume.created_at)}
                          </div>
                        </div>
                        <div className="resume-right">
                          <button
                            className={`create-button resume-connect ${
                              selectedResume === resume.id ? "selected" : ""
                            }`}
                            onClick={() => selectResume(resume.id)}
                            >
                              {selectedResume === resume.id ? (
                                <div className="connected">
                                  <img
                                    className="loading-icon" src={loading} alt="link-icon" />
                                </div>
                              ) : (
                                <div>Connect</div>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </>
    );    
}      
  
