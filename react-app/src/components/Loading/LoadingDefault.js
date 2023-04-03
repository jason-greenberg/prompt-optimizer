import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import './LoadingDefault.css';
import loadingGif from './assets/loading-bars.gif';
import { loadingMessages } from '../../utils/loading-messages';

export default function LoadingDefault() {
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
          <h1 className="loading-message">{message}</h1>
          <img className="loading-gif" src="https://i.imgur.com/rCp5v53.gif" alt="loading-gif" />
        </div>
      </div>
    </>
  );
}
