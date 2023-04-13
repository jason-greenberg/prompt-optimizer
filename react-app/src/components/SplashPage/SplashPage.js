import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './SplashPage.css';
import TypingComponent from './TypingComponent';
import createCover from '../../utils/assets/create-cover.gif'
import optimizeRes from '../../utils/assets/resume-demo.gif'
import createCorr from '../../utils/assets/create-correspondence.gif'

export default function SplashPage() {
  const user = useSelector(state => state.session.user)
  const messages = [
    'write a cover letter.',
    'optimize your resume for the job description.',
    'network with recruiters.',
    'apply for a job.',
    'track your applications.',
  ]

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const cycle = () => {
      setCurrentIndex((currentIndex + 1) % messages.length);
    };

    const interval = setInterval(cycle, 3500); // Adjust the duration based on the total time it takes for an SVG to finish typing

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex]);

  // const typingSvg = <img src={svgUrls[currentIndex]} alt="Typing SVG" />;

  // add no-scrolling styling to splash page only
  useEffect(() => {
    document.body.classList.add("no-horizontal-scroll");

    return () => {
      document.body.classList.remove("no-hortizontal-scroll");
    };
  }, []);

  return (
    <div className="splash-page-container">
      <div className="splash-nav-container">
        <div className="splash-nav-bar">
          <div className="splash-nav-left">
            <NavLink to="/">zipcover</NavLink>
          </div>
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
            <div>{'The fastest way to '}</div>
            {<TypingComponent text={messages[currentIndex]} />}
          </div>
        </div>
        <div className="product-demos">
          <div className="head-and-pitch">
            <div className="headline">HOW ZIPCOVER WORKS</div>
            <div className="pitch">Complete a Job Application in 60 seconds</div>
          </div>
          <div className="cover-letter-demo indiv-demo">
              <div className="demo-desc">{'1. Create a cover letter'}</div>
              <img className="demo-gif cov-gif" src={createCover} alt="cover-demo" />
          </div>
          <div className="resume-demo indiv-demo">
              <div className="demo-desc">{'2. Tailor your resume for the position'}</div>
              <img className="demo-gif res-gif" src={optimizeRes} alt="res-demo" />
          </div>
          <div className="correspondence-demo indiv-demo">
              <div className="demo-desc">{`3. Network with a click`}</div>
              <img className="demo-gif" src={createCorr} alt="corr-demo" />
          </div>
        </div>
      </div>
    </div>
  )
}
