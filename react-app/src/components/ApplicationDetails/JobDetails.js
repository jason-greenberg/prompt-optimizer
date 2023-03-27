import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { fetchSingleApplicationThunk } from "../../store/application";

export default function JobDetails() {
  const dispatch = useDispatch();
  const { applicationId } = useParams();
  const application = useSelector(state => state.applications.currentApplication)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchAsync = async () => {
      await dispatch(fetchSingleApplicationThunk(applicationId));
      
    }
  }, [dispatch])

  return (
    <>
      { !notFound && (
        <div className="job-description-container">
          <div className="job-description-body">
            <div className="about">About the Position</div>
            <div className="job-text">
              {application.job_description}
            </div>
          </div>
        </div>
      )}
      { notFound && (
        <div className="not-found">
          <h1>Job Description Not Found</h1>
        </div>
      )}
    </>
  )
}
