import '../../Resumes/AllResumes/AllResumes.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useMenuSelector } from '../../../context/Menu'
import Navigation from '../../Navigation'
import { fetchAllCoverLettersThunk } from '../../../store/coverletter'
import { capitalizeResumeTitle } from '../../../utils/format'
import { fetchAllApplicationsThunk } from '../../../store/application'

export default function AllCoverLetters() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [state, setState] = useState({ isLoaded: false, error: false });
  const [showDeleteDropdown, setShowDeleteDropdown] = useState([]);
  const { setSelectedLink, setSelectedSide } = useMenuSelector()
  const allCoverLetters = useSelector(state => state.coverletters.allCoverLetters);
  const allApplications = useSelector(state => state.applications.allApplications)

  useEffect(() => {
    const fetchAsync = async () => {
      const response = await dispatch(fetchAllCoverLettersThunk());
      if (response.error) {
        setState({ isLoaded: true, error: true });
      } else {
        await dispatch(fetchAllApplicationsThunk());
        setState({ isLoaded: true, error: false });
      }

      await setSelectedLink('coverletters')
    }
    fetchAsync();
  }, [dispatch])

  const getJobTitleByCoverLetterId = (coverLetterId) => {
    const application = Object.values(allApplications).find(
      (application) => application.cover_letter_id === coverLetterId
    );
    return application ? application.job_title : 'Unassigned';
  };

  const getAppDateByCoverLetterId = (coverLetterId) => {
    const application = Object.values(allApplications).find(
      (application) => application.cover_letter_id === coverLetterId
    );
    return application ? application.created_at : 'N/A';
  };

  const getAppIdByCoverLetterId = (coverLetterId) => {
    const application = Object.values(allApplications).find(
      (application) => application.cover_letter_id === coverLetterId
    );
    return application ? application.id : '';
  };

  return (
    <>
      <Navigation />
      { state.isLoaded && !state.error && (
        <div 
          className="all-resumes-page-container"
          onClick={() => setShowDeleteDropdown(prev => prev.map(() => false))}
        >
          <div className="all-resumes-body">
            <h1>
              <span className="form-action">Manage </span>
              <span className="form-title">Cover Letters</span>
            </h1>
            <div>Select a cover letter to view</div>
            <div className="resume-input-box">
              <div className="input-msg">Choose a cover letter</div>
              <div className="resumes-container">
                { Object.values(allCoverLetters).map((coverLetter, index) => (
                  <>
                    <div key={coverLetter.id} className="resume-overview">
                      <div className="resume-left">
                        <div className="resume-name">
                          {`${getJobTitleByCoverLetterId(coverLetter.id)} Cover Letter`}
                        </div>
                        <div className="dot">•</div>
                        <div className="resume-date">{getAppDateByCoverLetterId(coverLetter.id)}</div>
                      </div>
                      <div className="resume-right">
                        <button
                          className="view-button"
                          onClick={() => {
                            setSelectedSide('cover letter')
                            history.push(`/applications/${getAppIdByCoverLetterId(coverLetter.id)}`)
                          }}
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                    <div className="break"></div>
                  </>
                )) }
              </div>
            </div>
          </div>
        </div>
      )}
      { state.isLoaded && state.error && (
        <div className="all-resumes-container">
          <div className="all-resumes-body">
            <h3>No cover letters found, please try again momentarily</h3>
          </div>
        </div>
      )}
    </>
  )
}
