import { capitalizeResumeTitle, formatSalary } from '../../utils/format'
import { formatDate } from '../../utils/format'
import './IndividualJob.css'
import clock from './assets/time.png'
import briefcase from './assets/briefcase.png'
import dollar from './assets/dollar.png'
import loadingGif from '../Loading/assets/loading.gif'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createCoverLetterThunk } from '../../store/coverletter'

export default function IndividualJobModal({ job }) {
  const dispatch = useDispatch()
  const resumes = useSelector(state => state.resumes.allResumes);
  const resumesArray = Object.values(resumes)
  const mostRecentResume = resumesArray[resumesArray.length - 1];
  const [loading, setLoading] = useState(false);

  const handleEasyApply = async () => {
    setLoading(true);
    if (job.company_details) {
      await dispatch(createCoverLetterThunk(
        mostRecentResume.id, // resume id
        job.job_description, // job description
        job.company_details, // company details
        'gpt-3.5-turbo', // engine
        job.job_title // job title
      ));
    }
  }

  return (
    <div className="job-modal-body">
      <div className="job-title-modal">{ job.job_title }</div>
      <div className="company-name-loc">
        { job.employer_logo && (
          <div className="company-name-left">
            <img className="employer-logo" src={job.employer_logo} alt="employer-logo" />
          </div>
        )}
        <div className="company-name-right">
          <div className="company-name-modal">{job.company_name}</div>
          <div>{job.city}, {job.state}</div>
        </div>
      </div>
      <button 
        className="view-button modal-apply-button"
        onClick={handleEasyApply}
      >
        { !loading && (
          <>
            Easy Apply
          </>
        )}
        { loading && (
          <>
            <img src={loadingGif} className='loading-checkout loading-search' alt="loading-gif" />
          </>
        )}
      </button>
      <div className="job-characteristics">
        <div className="posted-date">
          <img className="time-icon" src={clock} alt="clock" />
          {formatDate(job.posted_at)}
        </div>
        { job.job_salary_period && (
          <div className="salary-info">
            <img className="dollar-icon" src={dollar} alt="dollar" />
            {formatSalary(job)}
          </div>
        )}
        <div className="employment-type">
          <img className="case-icon" src={briefcase} alt="briefcase" />
          {capitalizeResumeTitle(job.employment_type)}
        </div>
      </div>
      <div className="job-description-container job-modal-desc">
        <div className="job-description-body modal-desc-body">
          <div className="about modal-about">About</div>
          <div className="job-text modal-job-text">
            {job.job_description}
          </div>
        </div>
      </div>
    </div>
  )
}
