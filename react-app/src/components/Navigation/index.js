import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { useMenuSelector } from '../../context/Menu';
import NewButton from './NewButton';

export default function Navigation() {
  const user = useSelector(state => state.session.user)
	const { selectedLink, setSelectedLink } = useMenuSelector()

	const changeSelectedLink = (selection) => {
		setSelectedLink(selection);
	}

  return (
      <div className="navigation-container">
        <div className="navigation-bar">
          <div className="nav-left">
						<Link to='/dashboard'>
							<div className="logo">promptly</div>
						</Link>
						<div className="first-nav-links">
							<NavLink 
								className={"nav-link" + (selectedLink === "dashboard" ? " selected-link" : "")}
								onClick={() => changeSelectedLink('dashboard')}
								to="/dashboard"
							>
								Dashboard
							</NavLink>
							<NavLink 
								className={"nav-link" + (selectedLink === "about" ? " selected-link" : "")}
								onClick={() => changeSelectedLink('about')}
								to="/about"
							>
								About
							</NavLink>
						</div>
					</div>
          <div className="nav-right">
            <ProfileButton user={user} />
          </div>
        </div>
      </div>
  )
}
