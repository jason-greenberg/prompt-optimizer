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
      { isLoaded && !(applicationsArray.length > 0) && (
        <div className="dashboard-container">
          <div className="dashboard-body">
            
          </div>
        </div>
      )}
    </>
  );
}
