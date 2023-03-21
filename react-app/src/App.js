import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import { fetchAllResumesThunk } from "./store/resume";
import { fetchAllCoverLettersThunk } from "./store/coverletter";
import SplashPage from "./components/SplashPage/SplashPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const fetchAsync = async () => {
      await dispatch(authenticate());
      await dispatch(fetchAllResumesThunk());
      await dispatch(fetchAllCoverLettersThunk());
      setIsLoaded(true);
    }
    fetchAsync()
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" component={LoginFormPage} />
          <Route path="/signup" component={SignupFormPage} />
          <Route exact path = '/' component={SplashPage} />
        </Switch>
      )}
    </>
  );
}

export default App;
