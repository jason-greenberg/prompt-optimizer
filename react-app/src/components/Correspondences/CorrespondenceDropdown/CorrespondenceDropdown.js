import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useMenuSelector } from '../../../context/Menu';
import { createCorrespondenceThunk, fetchCorrespondencesByApplicationIdThunk } from '../../../store/correspondence';
import './CorrespondenceDropdown.css';

export default function CorrespondenceDropdown() {
  const dispatch = useDispatch();
  const history = useHistory();
  const application = useSelector((state) => state.applications.currentApplication);
  const coverLetter = useSelector((state) => state.coverletters?.currentCoverLetter);
  const { applicationId } = useParams();
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const { setSelectedSide } = useMenuSelector();

  useEffect(() => {
    setSelectedSide('correspondence')
  }, [])

  const handleCorrespondence = async (e, corr_type) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await dispatch(
      createCorrespondenceThunk(applicationId, {
        corr_type: corr_type,
        context: coverLetter?.letter_text,
        engine: 'gpt-3.5-turbo',
      }),
    );
    if (response.error) {
      console.log('Error', response.error)
    } else {
      await dispatch(fetchCorrespondencesByApplicationIdThunk(applicationId))
    }
  };

  return (
    <>
      { coverLetter && (
        <div className="corr-drop-container">
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'application follow-up')}>
            Application follow-up
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'initial connection')}>
            Initial connection request
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'informational interview')}>
            Informational interview request
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'thank you informational interview')}>
            Thank you after informational interview
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'thank you formal interview')}>
            Thank you after formal job interview
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'request feedback')}>
            Request for feedback after rejection
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'job offer follow-up')}>
            Job offer follow-up
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'job offer accept')}>
            Job offer acceptance
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'job offer decline')}>
            Job offer decline
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'reconnection')}>
            Reconnection
          </div>
        </div>
      )}
      { !coverLetter && (
        <div className="corr-drop-container corr-error">
          <div className="corr-msg">
            <div>A cover letter is required to create new correspondences</div>
            <button 
              className="create-button corr-create-button"
              onClick={() => history.push(`/coverletters/add/${applicationId}`)}
            >
              Create a Cover Letter
            </button>
          </div>
        </div>
      )}
    </>
  );
}
