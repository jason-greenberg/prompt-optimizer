import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { authenticate } from '../../store/session';
import { fetchAllApplicationsThunk, fetchSingleApplicationThunk } from '../../store/application';
import Navigation from '../Navigation';
import './JobSearch.css';
import { fetchAllResumesThunk } from '../../store/resume';
import { useMenuSelector } from '../../context/Menu';
import { fetchAllJobsThunk } from '../../store/job';
import { formatDate } from '../../utils/format';

export default function JobSearch() {
  const user = useSelector(state => state.session.user);
  const history = useHistory()
  const location = useLocation();
  const jobs = useSelector(state => state.jobs.allJobs);
  const jobsArray = Object.values(jobs);
  const { setSelectedLink } = useMenuSelector()

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchAsync = async () => {
      setSelectedLink('easy apply');
      await dispatch(fetchAllJobsThunk());
      await setIsLoaded(true);
    }

    fetchAsync();
  }, [dispatch])

  const handleClick = async (app) => {
    await dispatch(fetchSingleApplicationThunk(app.id))
    return history.push(`/applications/${app.id}`)
  }

  const handleApply = async (app) => {

  }

  return (
    <>
      <Navigation />
      {isLoaded && jobsArray.length > 0 && (
        <div className="dashboard-container">
          <div className="dashboard-body">
            <div className="current-apps-table">
              <div className="job-search-container">
                <div className="job-search-header">
                  <h3 className="table-title">Job Search</h3>
                  <div className="job-search-box">
                    <div className="job-cue">What & Where</div>
                  </div>
                </div>
              </div>
              <table className="applications-table">
                <thead>
                  <tr className="column-headings">
                    <th className="column-name"></th>
                    <th className="column-name job-title">JOB TITLE</th>
                    <th className="column-name company">COMPANY</th>
                    <th className="column-name">DATE POSTED</th>
                    <th className="column-name">LOCATION</th>
                  </tr>
                </thead>
                <tbody className="applications-container">
                  {jobsArray.map((job) => (
                    <tr 
                      key={job.id} 
                      className="individual-app"
                      // onClick={() => handleClick(job)}
                    >
                      <td className="apply-cell">
                        <button 
                          className="view-button apply-button"
                          onClick={handleApply}
                        >
                          Easy Apply
                        </button>
                      </td>
                      <td className="job-title">{job.job_title}</td>
                      <td className="company">{job.company_name}</td>
                      <td>{formatDate(job.posted_at)}</td>
                      <td>{job.city}, {job.state} {job.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      { isLoaded && !(jobsArray.length > 0) && (
        <div className="dashboard-container">
          <div className="dashboard-body">
          <div className="current-apps-table">
              <h3 className="table-title">Current Applications</h3>
              <table className="applications-table">
                <thead>
                  <tr className="column-headings">
                    <th className="column-name job-title">JOB TITLE</th>
                    <th className="column-name">POSITION TYPE</th>
                    <th className="column-name">DATE APPLIED</th>
                    <th className="column-name">FOLLOW UP</th>
                    <th className="column-name">ADDITIONAL INFO</th>
                  </tr>
                </thead>
                <tbody className="applications-container">
                </tbody>
              </table>
            </div>
          </div>
          <h4>Welcome! To create your first job application:</h4>
          <div className="intro-instruct">
            <p>1. Click the 'New' Button at the top of the screen</p>
            <p>2. Upload a Resume</p>
            <p>3. Once you've uploaded a resume, you can click 'New' and select 'Cover Letter' to create a Cover Letter and Job Application simultaneously</p>
            <p>4. Optionally, select 'Job Application' from the 'New' menu to create a Job Application without a Cover Letter</p>
          </div>
        </div>
      )}
    </>
  );
}
