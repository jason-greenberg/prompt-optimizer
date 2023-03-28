import React from 'react';
import { NavLink } from 'react-router-dom';
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
						<div className="logo">zipcover</div>
						<div className="first-nav-links">
							<NavLink 
								className={"nav-link" + (selectedLink === "dashboard" ? " selected-link" : "")}
								onClick={() => changeSelectedLink('dashboard')}
								to="/dashboard"
							>
								Dashboard
							</NavLink>
							<NavLink 
								className={"nav-link" + (selectedLink === "resumes" ? " selected-link" : "")}
								onClick={() => changeSelectedLink('resumes')}
								to="/resumes"
							>
								Resumes
							</NavLink>
							<NavLink 
								className={"nav-link" + (selectedLink === "coverletters" ? " selected-link" : "")}
								onClick={() => changeSelectedLink('coverletters')}
								to="/coverletters"
							>
								Cover Letters
							</NavLink>
						</div>
						<div className="vertical-divider"></div>
						<div className="second-nav-links">
							<NavLink 
								className={"nav-link" + (selectedLink === "correspondences" ? " selected-link" : "")}
								onClick={() => changeSelectedLink('correspondences')}
								to="/correspondences"
							>
								Correspondences
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
						<NewButton />
            <ProfileButton user={user} />
          </div>
        </div>
      </div>
  )
}
