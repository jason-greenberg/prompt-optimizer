import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useHistory } from "react-router-dom";
import userImage from "./assets/default_gravatar.webp"
import downArrow from "./assets/down-arrow.png";
import signOut from "./assets/sign_out_icon.png";
import promptlyIcon from './assets/p.png'
import { authenticate } from "../../store/session";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory()
  const user = useSelector(state => state.session.user)
  const coverletters = useSelector(state => state.coverletters.allCoverLetters)
  const coverlettersArray = Object.values(coverletters)
  const correspondences = useSelector(state => state.correspondences.currentApplicationCorrespondences)
  const correspondencesArray = Object.values(correspondences)

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current?.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    dispatch(authenticate())

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu, coverlettersArray.length, correspondencesArray.length]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <div className="user-menu" onClick={openMenu}>
        <img className="user-icon" src={userImage} alt="user-icon" />
        <div className="user-email">{user.email}</div>
        <img className="down-arrow" src={downArrow} alt="down-arrow" />
      </div>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className="user-email-container">
              <img className="user-icon-dropdown" src={userImage} alt="user-icon" />
              <div>{user.email}</div>
            </li>
            <li className="break"></li>
            <li 
              className="signout-container gen-count-container"
            >
              <div className="signout-container">
                <img className="option-icon" src={promptlyIcon} alt="option-icon" />
                <div className="gen-balance">{user.generation_balance}</div>
              </div>
              <button 
                className="create-button buy-button"
                onClick={() => history.push('/checkout')}
              >
                Buy Credits
              </button>
            </li>
            <li className="break"></li>
            <li 
              className="signout-container"
              onClick={handleLogout}
            >
              <img className="signout-icon" src={signOut} alt="sign-out-icon" />
              <div>Sign Out</div>
            </li>
          </>
        ) : (
          <>
            <OpenModalButton
              buttonText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />

            <OpenModalButton
              buttonText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
