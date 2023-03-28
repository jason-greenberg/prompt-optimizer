import { useState } from 'react';
import { useSelector } from 'react-redux'
import './AllCorrespondences.css'

export default function AllCorrespondences() {
  const correspondences = useSelector(state => state.correspondences.currentApplicationCorrespondences);
  const [notFound, setNotFound] = useState(false)
  return (
    <>
      { !notFound && (
        <div className="job-description-container">
          <div className="job-description-body">
            <div className="about">About</div>
            <div className="job-text">
              { Object.values(correspondences).map((corr, index) => (
                <div className="individual-corr" key={index}>
                  <div>{corr.corr_type}</div>
                  <div>{corr.generated_response}</div>
                </div>
              ))}
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
