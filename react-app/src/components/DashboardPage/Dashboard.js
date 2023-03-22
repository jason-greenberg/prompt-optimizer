import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { authenticate } from '../../store/session';
import Navigation from '../Navigation';
import './Dashboard.css';

export default function Dashboard() {
  const user = useSelector(state => state.session.user)
  const history = useHistory()

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchAsync = async () => {
      await dispatch(authenticate());
      setIsLoaded(true);
    }
    fetchAsync();

    if (!user) {
      history.push('/')
      return null
    }
  }, [dispatch]);

  return (
    <>
      <Navigation />
      { isLoaded && (
        <div className="dashboard-container">
          <div className="dashboard-body">
            <div className="current-apps-table">
              <h2 className="table-heading-container">
                <h3 className="table-heading">Current Applications</h3>
              </h2>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
