import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import './SignupForm.css';
import background from './assets/signup-background.png'

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);

  // add no-scrolling styling to sign-up page only
  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);


  if (sessionUser) return <Redirect to="/" />;

  const validate = () => {
    const validationErrors = {};
  
    if (!email) validationErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) validationErrors.email = 'Invalid email address';
  
    if (!username) validationErrors.username = 'Username is required';
    if (!password) validationErrors.password = 'Password is required';
    if (!confirmPassword) validationErrors.confirmPassword = 'Confirm password is required';
    if (password !== confirmPassword) validationErrors.confirmPassword = 'Passwords must match';
  
    return validationErrors;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setServerErrors(data);
      } else {
        setServerErrors([])
      }
    }
  };

  return (
    <div className="signup-container">
      <img className="background" src={background} alt="background-img" />
      <h1 className="sign-up-title">Sign up for Promptly</h1>
      <form onSubmit={handleSubmit}>
        <ul className="server-errors">
          {serverErrors.map((error, idx) => <li key={idx}>{error.split(':')[1]}</li>)}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            placeholder="your@email.com"
            className="sign-up-input"
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({...errors, email: null});
            }}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            placeholder="yourusername"
            className="sign-up-input"
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors({...errors, username: null});
            }}
          />
          {errors.username && <div className="error-message">{errors.username}</div>}
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            placeholder="correct horse battery staple"
            className="sign-up-input"
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({...errors, password: null});
            }}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            placeholder="correct horse battery staple"
            className="sign-up-input"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors({...errors, confirmPassword: null});
            }}
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </label>
        <button className="submit-sign-up" type="submit">COMPLETE SIGN UP</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
