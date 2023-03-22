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
    fetchAsync()
    if (!user) {
      history.push('/')
      return null
    }

  }, [dispatch]);

  return (
    <>
      <Navigation />
      <h1>Dashboard Component</h1>
    </>
  )
}
