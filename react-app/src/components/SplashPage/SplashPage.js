import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './SplashPage.css';

export default function SplashPage() {
  const user = useSelector(state => state.session.user)
  const svgUrls = [
    'https://readme-typing-svg.demolab.com?font=Oxygen&weight=700&size=62&duration=800&pause=800&color=000000&repeat=true&multiline=true&width=700&height=100&lines=write+a+cover+letter.',
    'https://readme-typing-svg.demolab.com?font=Oxygen&weight=700&size=62&duration=800&pause=800&color=000000&repeat=true&multiline=true&width=700&height=100&lines=network+with+recruiters.',
    'https://readme-typing-svg.demolab.com?font=Oxygen&weight=700&size=62&duration=800&pause=8000&color=000000&repeat=true&multiline=true&width=700&height=100&lines=turn+in+your+job+app.',
    'https://readme-typing-svg.demolab.com?font=Oxygen&weight=700&size=62&duration=800&pause=800&color=000000&repeat=true&multiline=true&width=700&height=100&lines=track+your+job+apps.',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const cycle = () => {
      setCurrentIndex((currentIndex + 1) % svgUrls.length);
    };

    const interval = setInterval(cycle, 1600); // Adjust the duration based on the total time it takes for an SVG to finish typing

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex]);

  const typingSvg = <img src={svgUrls[currentIndex]} alt="Typing SVG" />;

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
            The fastest way to {typingSvg}
          </div>
        </div>
      </div>
    </div>
  )
}
