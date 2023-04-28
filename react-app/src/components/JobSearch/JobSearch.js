import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { authenticate } from '../../store/session';
import { fetchAllApplicationsThunk, fetchSingleApplicationThunk } from '../../store/application';
import Navigation from '../Navigation';
import './JobSearch.css';
import loadingGif from '../Loading/assets/loading.gif'
import loadingBars from '../Loading/assets/loading-ellipses.gif'
import { fetchAllResumesThunk } from '../../store/resume';
import { useMenuSelector } from '../../context/Menu';
import { fetchAllJobsThunk, searchJobsThunk, updateNewJobsCompanyDetailsThunk } from '../../store/job';
import { formatDate } from '../../utils/format';
import OpenModalButton from '../OpenModalButton';
import IndividualJobModal from './IndividualJobModal';
import { useModal } from '../../context/Modal';
import LoadingDots from '../Loading/LoadingDots';

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
  const { setModalContent, setOnModalClose } = useModal();

  useEffect(() => {
    const fetchAsync = async () => {
      setSelectedLink('easy apply');
      await dispatch(fetchAllJobsThunk());
      await setIsLoaded(true);
    }

    fetchAsync();
  }, [dispatch, searchSubmitted])

  useEffect(() => {
    const fetchAsync = async () => {
      await dispatch(fetchAllResumesThunk());
    }
    fetchAsync();
  }, [dispatch])

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
        num_pages: 3,
        date_posted: 'today',
        remote_jobs_only: false,
        employment_types: 'FULLTIME',
        job_requirements: 'under_3_years_experience,more_than_3_years_experience',
        radius: 50
      }
      await dispatch(searchJobsThunk(searchData))
        .then(() => setSearchSubmitted(false)); // reset loading gif
      dispatch(updateNewJobsCompanyDetailsThunk());
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
                      key={job.company_details || job.id} 
                      className="individual-app"
                      onClick={() => setModalContent(<IndividualJobModal job={job} />)}
                    >
                      <td className="apply-cell">
                        { !loading && (
                          <>
                          { job.company_details && (
                            <button className="view-button apply-button">
                              Easy Apply
                            </button>
                          )}
                          { !job.company_details && (
                            <button className="view-button apply-button">
                              <LoadingDots />
                            </button>
                          )}
                          </>
                        )}
                        { loading && (
                          <button 
                            className="view-button apply-button"
                            onClick={handleApply}
                          >
                            <img src={loadingGif} className='loading-checkout' alt="loading-gif" />
                          </button>
                        )}
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
