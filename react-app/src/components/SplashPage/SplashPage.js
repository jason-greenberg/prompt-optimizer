import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './SplashPage.css';

export default function SplashPage() {
  const user = useSelector(state => state.session.user)

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
          <div className="message">The fastest way to write a cover letter.</div>
        </div>
      </div>
    </div>
  )
}
