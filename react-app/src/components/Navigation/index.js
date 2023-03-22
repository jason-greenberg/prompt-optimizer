import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

export default function Navigation() {
  const user = useSelector(state => state.session.user)

  return (
      <div className="navigation-container">
        <div className="nav-bar">
          <div className="nav-left">zipcover</div>
          <div className="nav-right">
            { user ? (
              <>
								<ProfileButton user={user} />
							</>
            ): (
              <>
              </>
            )}
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
