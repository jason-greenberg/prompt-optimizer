import './IndividualJob.css'

export default function IndividualJobModal({ job }) {
  return (
    <div className="job-modal-body">
      <h1>{ job.job_title }</h1>
      <div className="break"></div>
    </div>
  )
}
