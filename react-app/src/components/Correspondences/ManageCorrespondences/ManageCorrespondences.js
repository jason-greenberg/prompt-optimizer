import '../../Resumes/AllResumes/AllResumes.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Navigation from '../../Navigation';
import { fetchAllCorrespondencesThunk } from '../../../store/correspondence';
import { fetchAllApplicationsThunk } from '../../../store/application';
import { useMenuSelector } from '../../../context/Menu';
import { formatCorrType } from '../../../utils/format';

export default function ManageCorrespondences() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [state, setState] = useState({ isLoaded: false, error: false });
  const allCorrespondences = useSelector(state => state.correspondences.allCorrespondences);
  const allApplications = useSelector(state => state.applications.allApplications);
  const { setSelectedSide } = useMenuSelector();

  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchAllCorrespondencesThunk());
      if (response.error) {
        setState({ isLoaded: true, error: true });
      } else {
        await dispatch(fetchAllApplicationsThunk());
        setState({ isLoaded: true, error: false });
      }
    };
    fetchAsync();
  }, [dispatch]);

  return (
    <>
      <Navigation />
      {state.isLoaded && !state.error && Object.values(allCorrespondences).length > 0 && (
        <div className="all-resumes-page-container">
          <div className="all-resumes-body">
            <h1>
              <span className="form-action">Manage </span>
              <span className="form-title">Correspondences</span>
            </h1>
            <div>Select a correspondence to view</div>
            <div className="resume-input-box">
              <div className="input-msg">Choose a correspondence</div>
              <div className="resumes-container">
                {Object.values(allCorrespondences).map((correspondence, index) => (
                  <div className="correspondence-wrapper" key={correspondence.id}>
                    <div key={correspondence.id} className="resume-overview">
                      <div className="resume-left">
                        <div className="resume-name">
                          {`${formatCorrType(correspondence.corr_type)} ${allApplications[correspondence.application_id].job_title}`}
                        </div>
                        <div className="dot">•</div>
                        <div className="resume-date">{correspondence.created_at}</div>
                      </div>
                      <div className="resume-right">
                        <button
                          className="view-button"
                          onClick={() => {
                            setSelectedSide('correspondence')
                            history.push(`/applications/${correspondence.application_id}`);
                          }}
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                    {index < Object.values(allCorrespondences).length - 1 && (
                      <div className="break"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {state.isLoaded && !state.error && !(Object.values(allCorrespondences).length > 0) && (
        <div className="all-resumes-page-container">
          <div className="all-resumes-body">
            <h1>
              <span className="form-action">Manage</span>
              <span className="form-title">Correspondences</span>
            </h1>
            <h4>To create your first correspondence:</h4>
            <h4>1. Create a Cover Letter or Job Application</h4>
            <h4>2. Select a Job Application, then click on the 'Message Recruiter' button</h4>
            <h4>3. Select one of the options from the dropdown menu, like 'Application follow-up'.</h4>
          </div>
        </div>
      )}
      {state.isLoaded && state.error && !Object.values(allCorrespondences).length > 0 && (
        <div className="all-resumes-page-container">
          <div className="all-resumes-body">
            <h3>No correspondences found, please try again momentarily</h3>
          </div>
        </div>
        )}
    </>
  );
}
