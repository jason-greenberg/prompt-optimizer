import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { authenticate } from '../../store/session';
import { fetchAllApplicationsThunk, fetchSingleApplicationThunk } from '../../store/application';
import Navigation from '../Navigation';
import './Dashboard.css';
import { fetchAllResumesThunk } from '../../store/resume';
import { useMenuSelector } from '../../context/Menu';

export default function Dashboard() {
  const user = useSelector(state => state.session.user);
  const applications = useSelector(state => state.applications.allApplications)
  const applicationsArray = Object.values(applications);
  const history = useHistory()
  const location = useLocation();
  const resumeDeleted = location.state?.resumeDeleted;
  const applicationDeleted = location.state?.applicationDeleted;
  const [showBanner, setShowBanner] = useState(resumeDeleted);
  const [showAppBanner, setShowAppBanner] = useState(applicationDeleted);
  const { setSelectedLink } = useMenuSelector()

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchAsync = async () => {
      await dispatch(authenticate());
      await dispatch(fetchAllApplicationsThunk());
      dispatch(fetchAllResumesThunk())
      setIsLoaded(true);
    }
    fetchAsync();
  
    setSelectedLink('dashboard')
  
    if (!user && isLoaded) {
      history.push('/')
      return null
    }
  }, [dispatch, history, isLoaded]);
  

  useEffect(() => {
    if (resumeDeleted) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [resumeDeleted]);

  useEffect(() => {
    if (applicationDeleted) {
      const timer = setTimeout(() => {
        setShowAppBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [applicationDeleted]);

  const handleClick = async (app) => {
    await dispatch(fetchSingleApplicationThunk(app.id))
    return history.push(`/applications/${app.id}`)
  }

  return (
    <>
      <Navigation />
      {isLoaded && applicationsArray.length > 0 && (
        <div className="dashboard-container">
          <div className="dashboard-body">
          {showBanner && (
            <div className="resume-deleted-banner">
              Resume successfully deleted.
            </div>
          )}
          {showAppBanner && (
            <div className="resume-deleted-banner">
              Application successfully deleted.
            </div>
          )}
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
                  {applicationsArray.map((app) => (
                    <tr 
                      key={app.id} 
                      className="individual-app"
                      onClick={() => handleClick(app)}
                    >
                      <td className="job-title">{app.job_title}</td>
                      <td>{app.position_type}</td>
                      <td>{app.created_at}</td>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>None</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      { isLoaded && !(applicationsArray.length > 0) && (
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
