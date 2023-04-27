import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { authenticate } from '../../store/session';
import { fetchAllApplicationsThunk, fetchSingleApplicationThunk } from '../../store/application';
import Navigation from '../Navigation';
import './JobSearch.css';
import loadingGif from '../Loading/assets/loading.gif'
import { fetchAllResumesThunk } from '../../store/resume';
import { useMenuSelector } from '../../context/Menu';
import { fetchAllJobsThunk, searchJobsThunk } from '../../store/job';
import { formatDate } from '../../utils/format';

export default function JobSearch() {
  const user = useSelector(state => state.session.user);
  const history = useHistory()
  const location = useLocation();
  const jobs = useSelector(state => state.jobs.allJobs);
  const jobsArray = Object.values(jobs);
  const { setSelectedLink } = useMenuSelector();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAsync = async () => {
      setSelectedLink('easy apply');
      await dispatch(fetchAllJobsThunk());
      await setIsLoaded(true);
    }

    fetchAsync();
  }, [dispatch, searchSubmitted])

  const handleClick = async (app) => {
    await dispatch(fetchSingleApplicationThunk(app.id))
    return history.push(`/applications/${app.id}`)
  }

  const handleApply = async (app) => {

  }

  const handleSearch = async () => {
    if (search !== '') {
      // Toggle loading gif on search button
      setSearchSubmitted(true)
      // Construct searchData for JSearch API
      const searchData = {
        search,
        page: 1,
        num_pages: 1,
        date_posted: 'today',
        remote_jobs_only: false,
        employment_types: 'FULLTIME',
        job_requirements: 'under_3_years_experience,more_than_3_years_experience',
        radius: 50
      }
      await dispatch(searchJobsThunk(searchData))
        .then(() => setSearchSubmitted(false)); // reset loading gif
    }
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
                    <input 
                      className="job-search-input"
                      placeholder='job title, keywords, and/or location'
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button 
                    className={"search-button" + (searchSubmitted ? " search-load-container" : "")}
                    onClick={handleSearch}
                  >
                    { !searchSubmitted && (
                      <>
                        Search
                      </>
                    )}
                    { searchSubmitted && (
                      <>
                        <img src={loadingGif} className='loading-checkout loading-search' alt="loading-gif" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              <table className="applications-table">
                <thead>
                  <tr className="column-headings">
                    <th className="column-name"></th>
                    <th className="column-name job-title">JOB TITLE</th>
                    <th className="column-name company">COMPANY</th>
                    <th className="column-name">DATE POSTED</th>
                    <th className="column-name location">LOCATION</th>
                    <th className="column-name">PLATFORM</th>
                  </tr>
                </thead>
                <tbody className="applications-container">
                  {jobsArray.map((job, index) => (
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
                          { !loading && (
                            <>
                              Easy Apply
                            </>
                          )}
                          { loading && (
                            <>
                              <img src={loadingGif} className='loading-checkout' alt="loading-gif" />
                            </>
                          )}
                        </button>
                      </td>
                      <td className="job-title">{job.job_title}</td>
                      <td className="company">{job.company_name}</td>
                      <td className="date-posted">
                        {formatDate(job.posted_at)}
                      </td>
                      <td className="location">
                        {job.city}, {job.state} {job.country}
                      </td>
                      <td className="publisher">{job.publisher}</td>
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
              <div className="job-search-container">
                <div className="job-search-header">
                  <h3 className="table-title">Job Search</h3>
                  <div className="job-search-box">
                    <div className="job-cue">What & Where</div>
                    <input 
                      className="job-search-input"
                      placeholder='job title, keywords, and/or location'
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button 
                    className="search-button"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
              <table className="applications-table">
                <thead>
                  <tr className="column-headings">
                    <th className="column-name"></th>
                    <th className="column-name job-title">JOB TITLE</th>
                    <th className="column-name company">COMPANY</th>
                    <th className="column-name">DATE POSTED</th>
                    <th className="column-name location">LOCATION</th>
                    <th className="column-name">PLATFORM</th>
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
