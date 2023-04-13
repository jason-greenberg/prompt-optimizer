import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Navigation from '../Navigation';
import { useMenuSelector } from '../../context/Menu';
import ghIcon from './assets/gh-icon.png';
import liIcon from './assets/li-icon.png';
import jasonPhoto from './assets/jason.jpg';
import './AboutDetails.css';

export default function AboutDetails() {
  const user = useSelector(state => state.session?.user);
  const { setSelectedLink } = useMenuSelector();

  useEffect(() => {
    setSelectedLink('about');

    document.body.classList.add('no-horizontal-scroll');

    return () => {
      document.body.classList.remove('no-horizontal-scroll');
    };
  }, []);

  return (
    <>
      {user ? (
        <Navigation />
      ) : (
        <div className="splash-nav-container">
          <div className="splash-nav-bar">
            <div className="splash-nav-left">
              <NavLink to="/">zipcover</NavLink>
            </div>
            <div className="splash-nav-right">
              <NavLink to="/about">About</NavLink>
              {user ? (
                <NavLink to="/dashboard">
                  <button className="purple-button">DASHBOARD</button>
                </NavLink>
              ) : (
                <>
                  <NavLink to="/signup">
                    <button className="purple-button">GET STARTED</button>
                  </NavLink>
                  <NavLink to="/login">
                    <button className="white-button">SIGN IN</button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="about-details-container">
        <div className="about-details-body">
          <div className="about-me-section">
            <h2 className="about-me-title">Jason Greenberg</h2>
            <h3 className="about-me-subtitle">Full Stack Developer</h3>
          </div>
          <h3 className="about-me-sub-heading">About Me</h3>
          <p className="text-bio">
            Hi, I'm Jason and once upon a time, I worked in clinical psychology research, but the magic of code caught my eye.
            I was fascinated with writing scripts that could automate my research workflow.
            Soon, I found myself learning JavaScript and embarking on a new adventure in software engineering.
            Now, I spend my days building web applications and using code to solve real problems.
            I'm always exploring new technologies and challenging myself to learn new tools.
          </p>
          <h3 className="about-me-sub-heading">Skills</h3>
          <ul>
            <li>Javascript</li>
            <li>Python</li>
            <li>React</li>
            <li>Flask</li>
            <li>Redux</li>
            <li>Express</li>
            <li>Node.js</li>
            <li>Sequelize</li>
            <li>PostgreSQL</li>
            <li>API Development</li>
            <li>CSS</li>
            <li>Git</li>
            <li>Scrum</li>
            <li>Agile</li>
            {/* Add more skills as needed */}
          </ul>
          <h3 className="about-me-sub-heading">Contact</h3>
          <ul className="social-links">
            <li className="external-link">
              <a href="https://github.com/jason-greenberg" target="_blank" rel="noopener noreferrer">
                <img className="about-icon" src={ghIcon} alt="github-icon" />
                <span className="link-text">GitHub</span>
              </a>
            </li>
            <li className="external-link">
              <a href="https://linkedin.com/in/jason-g-greenberg" target="_blank" rel="noopener noreferrer">
                <img className="about-icon" src={liIcon} alt="linkedin-icon" />
                <span className="link-text">LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

           
