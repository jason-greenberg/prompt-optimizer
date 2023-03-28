import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './AllCorrespondences.css';
import liIcon from './assets/li-blue-icon.png';
import emailIcon from './assets/gmail.png';

export default function AllCorrespondences() {
  const correspondences = useSelector(
    (state) => state.correspondences.currentApplicationCorrespondences
  );
  const correspondencesArray = Object.values(correspondences)
  const [notFound, setNotFound] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setExpanded({}); // Reset the expanded state when correspondences change
  }, [correspondencesArray.length]);

  const handleClick = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  return (
    <>
      {!notFound && (
        <div className="job-description-container">
          <div className="corr-container">
            {Object.values(correspondences).map((corr, index) => (
              <div className="corr-w-break" key={index}>
                <div className="individual-corr" onClick={() => handleClick(index)}>
                  <div className="corr-left">
                    {corr.corr_type === 'LinkedIn' && (
                      <img src={liIcon} alt="linkedIn-icon" />
                    )}
                    {corr.corr_type === 'Email' && (
                      <img src={emailIcon} alt="email-icon" />
                    )}
                  </div>
                  <div className="corr-right">
                    <div className="corr-type">
                      <div className="corr-type-word">{corr.corr_type}:</div>
                      <div
                        className={`response ${expanded[index] ? 'expanded' : ''}`}
                      >
                        {corr.generated_response}
                      </div>
                    </div>
                    <div className="corr-date">{corr.created_at}</div>
                  </div>
                </div>
                { index < Object.values(correspondences).length - 1 && (
                  <div className="break"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {notFound && (
        <div className="not-found">
          <h1>Job Description Not Found</h1>
        </div>
      )}
    </>
  );
}
