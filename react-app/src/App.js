import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./components/SplashPage/SplashPage";
import Dashboard from "./components/DashboardPage/Dashboard";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const fetchAsync = async () => {
      await dispatch(authenticate());
      setIsLoaded(true);
    }
    fetchAsync()
  }, [dispatch]);

  return (
    <>
      {/* <Navigation isLoaded={isLoaded} /> */}
      {isLoaded && (
        <Switch>
          <Route path="/login" component={LoginFormPage} />
          <Route path="/signup" component={SignupFormPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route exact path = '/' component={SplashPage} />
        </Switch>
      )}
    </>
  );
}

export default App;
