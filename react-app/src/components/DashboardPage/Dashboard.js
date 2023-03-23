import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { authenticate } from '../../store/session';
import { fetchAllApplicationsThunk } from '../../store/application';
import Navigation from '../Navigation';
import './Dashboard.css';
import { fetchAllResumesThunk } from '../../store/resume';

export default function Dashboard() {
  const user = useSelector(state => state.session.user);
  const applications = useSelector(state => state.applications.allApplications)
  const applicationsArray = Object.values(applications);
  const history = useHistory()
  const location = useLocation();
  const resumeDeleted = location.state?.resumeDeleted;
  const [showBanner, setShowBanner] = useState(resumeDeleted)

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

    if (!user) {
      history.push('/')
      return null
    }
  }, [dispatch]);

  useEffect(() => {
    if (resumeDeleted) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [resumeDeleted]);

  return (
    <>
      <Navigation />
      {isLoaded && (
        <div className="dashboard-container">
          <div className="dashboard-body">
          {showBanner && (
            <div className="resume-deleted-banner">
              Resume successfully deleted.
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
                      onClick={() => history.push(`/applications/${app.id}`)}
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
    </>
  );
}
