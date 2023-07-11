import React, { useState, useEffect } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import './LoginForm.css';
import background from './assets/signup-background.png';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([])

  // add no-scrolling styling to login page only
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
    if (!password) validationErrors.password = 'Password is required';

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const data = await dispatch(login(email, password));
      if (data) {
        setServerErrors('Invalid credentials');
      } else {
        setServerErrors([])
      }
    }
  };

  // Login in as hardcoded demo user
  const handleDemo = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = await dispatch(login('david@heytutor.com', 'password'))
    if (data) {
      setServerErrors('Error logging in Demo User, please try again')
    } else {
      setServerErrors([]);
    }
  }

  return (
    <div className="signup-container">
      <img className="background" src={background} alt="background-img" />
      <h1 className="sign-up-title">Sign in to Promptly</h1>
      <form onSubmit={handleSubmit}>
        <ul className="server-errors">
          {serverErrors}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            className="sign-up-input"
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: null });
            }}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            className="sign-up-input"
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: null });
            }}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </label>
        <button className="submit-sign-up" type="submit">SIGN IN</button>
      </form>
      <button 
        className="submit-demo" 
        type="submit"
        onClick={handleDemo}
      >
        DEMO USER
      </button>
    </div>
  );
}

export default LoginFormPage;
