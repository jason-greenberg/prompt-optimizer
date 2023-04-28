import { capitalizeResumeTitle, formatSalary } from '../../utils/format'
import { formatDate } from '../../utils/format'
import './IndividualJob.css'

export default function IndividualJobModal({ job }) {
  return (
    <div className="job-modal-body">
      <div className="job-title-modal">{ job.job_title }</div>
      <div className="company-name-modal">{job.company_name}</div>
      <div>{job.city}, {job.state}</div>
      <button className="view-button modal-apply-button">Easy Apply</button>
      <div className="job-characteristics">
        <div className="posted-date">{formatDate(job.posted_at)}</div>
        <div>{capitalizeResumeTitle(job.employment_type)}</div>
        { job.job_salary_period && (
          <div>{formatSalary(job)}</div>
        )}
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
