import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

export default function Navigation() {
  const user = useSelector(state => state.session.user)

  return (
      <div className="navigation-container">
        <div className="navigation-bar">
          <div className="nav-left">
						<div className="logo">zipcover</div>
						<div className="first-nav-links">
							<div className="nav-link">Dashboard</div>
							<div className="nav-link">Resumes</div>
							<div className="nav-link">Cover Letters</div>
						</div>
						<div className="second-nav-links">
							<div className="nav-link">Correspondences</div>
							<div className="nav-link">Help</div>
							<div className="nav-link"></div>
						</div>
					</div>
          <div className="nav-right">
						<button className="create-button"><span>New</span> <span className="plus">+</span></button>
            <ProfileButton user={user} />
          </div>
        </div>
      </div>
  )
}

function Test(){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<div className="navigation-container">
			<NavLink exact to="/">Home</NavLink>
		</div>
	);
}
