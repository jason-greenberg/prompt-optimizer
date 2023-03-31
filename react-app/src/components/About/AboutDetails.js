import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useMenuSelector } from '../../context/Menu';
import Navigation from '../Navigation';
import './AboutDetails.css';
import ghIcon from './assets/gh-icon.png'
import liIcon from './assets/li-icon.png'

export default function AboutDetails() {
  const user = useSelector(state => state.session?.user);
  const { setSelectedLink } = useMenuSelector();

  useEffect(() => {
    setSelectedLink('about')

    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    }
  }, []);

  return (
    <>
      { user ? (
        <Navigation />
      ) : (
        <div className="splash-nav-container">
        <div className="splash-nav-bar">
          <div className="splash-nav-left">zipcover</div>
          <div className="splash-nav-right">
            <NavLink to='/about'>About</NavLink>
            { user ? (
              <NavLink to='/dashboard'><button className="purple-button">DASHBOARD</button></NavLink>
            ): (
              <>
                <NavLink to='/signup'><button className="purple-button">GET STARTED</button></NavLink>
                <NavLink to='/login'><button className="white-button">SIGN IN</button></NavLink>
              </>
            )}
          </div>
        </div>
      </div>
      )}
      <div className="about-details-container">
        <div className="about-details-body">
          <h2 className="about-me-title">About Me</h2>
          <p className="text-bio">
            Hi, I'm Jason. I'm a fullstack python developer and I love web development.
            I enjoy tackling complex problems and coming up with creative solutions.
            I'm continually learning new technologies and have a knack for automating tasks to enhance efficiency.
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
  );
}
