import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import './JobDetails.css';
import { getJobBoardFromUrl } from "../../utils/format";

export default function JobDetails() {
  const application = useSelector(state => state.applications.currentApplication)
  const [notFound, setNotFound] = useState(false)

  const handleDirectApply = async () => {
    window.open(application.apply_link, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      { !notFound && (
        <div className="job-description-container">
          { application.apply_link && (
            <button 
              className="view-button apply-direct-button"
              onClick={handleDirectApply}
            >
              {`Apply directly on ${getJobBoardFromUrl(application.apply_link)}`}
            </button>
          )}
          <div className="job-description-body">
            <div className="about">About</div>
            <div className="job-text">
              {application.job_description}
            </div>
          </div>
        </div>
      )}
      { notFound && (
        <div className="not-found">
          <h1>Job Description Not Found</h1>
        </div>
      )}
    </>
  )
}
