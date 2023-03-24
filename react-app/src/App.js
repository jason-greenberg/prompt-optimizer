import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import SplashPage from "./components/SplashPage/SplashPage";
import Dashboard from "./components/DashboardPage/Dashboard";
import CreateResumeForm from "./components/Resumes/CreateResume/CreateResumeForm";
import ResumeDetails from "./components/Resumes/ResumeDetails/ResumeDetails";
import EditResume from "./components/Resumes/EditResume/EditResume";
import AllResumes from "./components/Resumes/AllResumes/AllResumes";
import CreateCoverLetter from "./components/CoverLetters/CreateCoverLetter/CreateCoverLetter";
import ApplicationDetails from "./components/ApplicationDetails/ApplicationDetails";

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
      {isLoaded && (
        <Switch>
          <Route path="/login" component={LoginFormPage} />
          <Route path="/signup" component={SignupFormPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/applications/:applicationId" component={ApplicationDetails} />
          <Route path="/resumes/new" component={CreateResumeForm} />
          <Route path="/resumes/:resumeId/edit" component={EditResume} />
          <Route path="/resumes/:resumeId" component={ResumeDetails} />
          <Route path="/resumes" component={AllResumes} />
          <Route path="/coverletters/new" component={CreateCoverLetter} />
          <Route exact path = '/' component={SplashPage} />
        </Switch>
      )}
    </>
  );
}

export default App;
