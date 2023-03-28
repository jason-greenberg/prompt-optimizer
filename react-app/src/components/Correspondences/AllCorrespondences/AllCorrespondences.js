import { useState } from 'react';
import { useSelector } from 'react-redux'
import './AllCorrespondences.css'
import liIcon from './assets/li-blue-icon.png'
import emailIcon from './assets/gmail.png'

export default function AllCorrespondences() {
  const correspondences = useSelector(state => state.correspondences.currentApplicationCorrespondences);
  const [notFound, setNotFound] = useState(false)
  return (
    <>
      { !notFound && (
        <div className="job-description-container">
          <div className="corr-container">
            { Object.values(correspondences).map((corr, index) => (
              <div className="corr-w-break">
                <div className="individual-corr" key={index}>
                  <div className="corr-left">
                    { corr.corr_type === 'LinkedIn' && (
                      <img src={liIcon} alt="linkedIn-icon" />
                    ) }
                    { corr.corr_type === 'Email' && (
                      <img src={emailIcon} alt="email-icon" />
                    )}
                  </div>
                  <div className="corr-right">
                    <div className="corr-type">
                      <div className="corr-type-word">{corr.corr_type}:</div>
                      <div className="response">{corr.generated_response}</div>
                    </div>
                    <div className="corr-date">{corr.created_at}</div>
                  </div>
                </div>
                <div className="break"></div>
              </div>
            ))}
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
