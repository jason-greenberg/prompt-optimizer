import { capitalizeResumeTitle, formatSalary } from '../../utils/format'
import { formatDate } from '../../utils/format'
import './IndividualJob.css'
import clock from './assets/time.png'
import briefcase from './assets/briefcase.png'
import dollar from './assets/dollar.png'

export default function IndividualJobModal({ job }) {
  return (
    <div className="job-modal-body">
      <div className="job-title-modal">{ job.job_title }</div>
      <div className="company-name-modal">{job.company_name}</div>
      <div>{job.city}, {job.state}</div>
      <button className="view-button modal-apply-button">Easy Apply</button>
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
