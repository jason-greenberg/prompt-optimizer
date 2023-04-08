import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './SplashPage.css';
import TypingComponent from './TypingComponent';
import Typing from './TypingComponent';

export default function SplashPage() {
  const user = useSelector(state => state.session.user)
  const messages = [
    'write a cover letter.',
    'network with recruiters.',
    'apply to a job.',
    'track your applications.'
  ]

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const cycle = () => {
      setCurrentIndex((currentIndex + 1) % messages.length);
    };

    const interval = setInterval(cycle, 2000); // Adjust the duration based on the total time it takes for an SVG to finish typing

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex]);

  // const typingSvg = <img src={svgUrls[currentIndex]} alt="Typing SVG" />;

  // add no-scrolling styling to splash page only
  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div className="splash-page-container">
      <div className="splash-nav-container">
        <div className="splash-nav-bar">
          <div className="splash-nav-left">zipcover</div>
          <div className="splash-nav-right">
            <NavLink to='/about'>About</NavLink>
            { user ? (
              <NavLink className="nav-but" to='/dashboard'><button className="purple-button">DASHBOARD</button></NavLink>
            ): (
              <>
                <NavLink className="nav-but" to='/signup'><button className="purple-button">GET STARTED</button></NavLink>
                <NavLink to='/login'><button className="white-button">SIGN IN</button></NavLink>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="splash-body-container">
        <div className="message-container">
          <div className="message">
          The fastest way to {<TypingComponent text={messages[currentIndex]} />}
          </div>
        </div>
      </div>
    </div>
  )
}
