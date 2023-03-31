import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useMenuSelector } from '../../../context/Menu';
import { createCorrespondenceThunk, fetchCorrespondencesByApplicationIdThunk } from '../../../store/correspondence';
import './CorrespondenceDropdown.css';
import loading from './assets/loading-circle.gif'
import { correspondenceTypes } from '../../../utils/corr-images';

export default function CorrespondenceDropdown() {
  const dispatch = useDispatch();
  const history = useHistory();
  const application = useSelector((state) => state.applications.currentApplication);
  const coverLetter = useSelector((state) => state.coverletters?.currentCoverLetter);
  const { applicationId } = useParams();
  const [hasSubmitted, setHasSubmitted] = useState(null)
  const { setSelectedSide } = useMenuSelector();

  useEffect(() => {
    setSelectedSide('correspondence')
  }, [])

  const handleCorrespondence = async (e, corr_type) => {
    e.preventDefault();
    e.stopPropagation();
    setHasSubmitted(corr_type);
    const response = await dispatch(
      createCorrespondenceThunk(applicationId, {
        corr_type: corr_type,
        context: coverLetter?.letter_text,
        engine: 'gpt-3.5-turbo',
      }),
    );
    if (response.error) {
      return
    } else {
      await dispatch(fetchCorrespondencesByApplicationIdThunk(applicationId))
      await setHasSubmitted(null);
    }
  };

  return (
    <>
      { coverLetter && (
        <div className="corr-drop-container">
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'application follow-up')}>
            <div className="corr-desc">Application follow-up</div>
            { hasSubmitted === correspondenceTypes[0] && (
              <img src={loading} alt="loading-icon" className="loading-image" />
            )}
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'initial connection')}>
            <div className="corr-desc">Initial connection request</div>
            { hasSubmitted === correspondenceTypes[1] && (
              <img src={loading} alt="loading-icon" className="loading-image" />
            )}
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'informational interview')}>
            <div className="corr-desc">Informational interview request</div>
            { hasSubmitted === correspondenceTypes[2] && (
              <img src={loading} alt="loading-icon" className="loading-image" />
            )}
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'thank you informational interview')}>
            <div className="corr-desc">Thank you after informational interview</div>
            { hasSubmitted === correspondenceTypes[3] && (
              <img src={loading} alt="loading-icon" className="loading-image" />
            )}
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'thank you formal interview')}>
            <div className="corr-desc">Thank you after formal job interview</div>
            { hasSubmitted === correspondenceTypes[4] && (
              <img src={loading} alt="loading-icon" className="loading-image" />
            )}
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'request feedback')}>
            <div className="corr-desc">Request for feedback after rejection</div>
            { hasSubmitted === correspondenceTypes[5] && (
              <img src={loading} alt="loading-icon" className="loading-image" />
            )}
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'job offer follow-up')}>
            <div className="corr-desc">Job offer follow-up</div>
            { hasSubmitted === correspondenceTypes[6] && (
              <img src={loading} alt="loading-icon" className="loading-image" />
            )}
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'job offer accept')}>
            <div className="corr-desc">Job offer acceptance</div>
            { hasSubmitted === correspondenceTypes[7] && (
              <img src={loading} alt="loading-icon" className="loading-image" />
            )}
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'job offer decline')}>
            <div className="corr-desc">Job offer decline</div>
            { hasSubmitted === correspondenceTypes[8] && (
              <img src={loading} alt="loading-icon" className="loading-image" />
            )}
          </div>
          <div className="corr-option" onClick={(e) => handleCorrespondence(e, 'reconnection')}>
            <div className="corr-desc">Reconnection</div>
            { hasSubmitted === correspondenceTypes[9] && (
              <img src={loading} alt="loading-icon" className="loading-image" />
            )}
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
