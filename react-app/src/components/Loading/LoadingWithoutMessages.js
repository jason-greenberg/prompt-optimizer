import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import './LoadingDefault.css';
import loadingGif from './assets/loading-bars.gif';
import { loadingMessages } from '../../utils/loading-messages';

export default function LoadingNoMessages() {
  const getRandomArrayValue = (array) => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  };

  const [message, setMessage] = useState(getRandomArrayValue(loadingMessages));

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(getRandomArrayValue(loadingMessages));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="loading-page-container">
        <div className="loading-page-body">
          <Navigation />
          <img className="loading-gif" src={loadingGif} alt="loading-gif" />
        </div>
      </div>
    </>
  );
}
