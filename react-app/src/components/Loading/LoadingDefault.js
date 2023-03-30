import { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import './LoadingDefault.css';
import loadingGif from './assets/loading-bars.gif';
import { loadingMessages } from '../../utils/loading-messages';

export default function LoadingDefault() {
  const [currentMessage, setCurrentMessage] = useState('');

  const getRandomArrayValue = (array) => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  };

  useEffect(() => {
    const updateMessage = () => {
      setCurrentMessage(getRandomArrayValue(loadingMessages));
    };

    updateMessage(); // Set initial message
    const interval = setInterval(updateMessage, 5000); // Update message every 5 seconds

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, []);

  return (
    <>
      <div className="loading-page-container">
        <div className="loading-page-body">
          <h1>{currentMessage}</h1>
          <img className="loading-gif" src={loadingGif} alt="loading-gif" />
        </div>
      </div>
    </>
  );
}
