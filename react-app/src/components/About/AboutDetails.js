import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  }, []);

  return (
    <>
      { user && (
        <Navigation />
      )}
      <div className="about-details-container">
        <div className="about-details-body">
          <h2 className="about-me-title">About Me</h2>
          <p className="text-bio">
            Hi, I'm Jason, a passionate fullstack python developer
            with a strong interest in web development.
            I enjoy building creative solutions to challenging problems and constantly learning new technologies.
          </p>
          <h3 className="about-me-title">Skills</h3>
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
          <h3 className="about-me-title">Contact & Social</h3>
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
