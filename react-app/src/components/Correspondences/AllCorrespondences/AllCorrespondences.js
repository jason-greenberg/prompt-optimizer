import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './AllCorrespondences.css';
import copyIcon from './assets/copy-icon-grey.png';
import { fetchCorrespondencesByApplicationIdThunk } from '../../../store/correspondence';
import { useParams } from 'react-router-dom';
import { formatCorrType } from '../../../utils/format';
import { chooseIcon } from '../../../utils/corr-images';
import { handleCopyToClipboard } from '../../../utils/clipboard';

export default function AllCorrespondences() {
  const dispatch = useDispatch()
  const correspondences = useSelector(
    (state) => state.correspondences.currentApplicationCorrespondences
  );
  const correspondencesArray = Object.values(correspondences)
  const [notFound, setNotFound] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [copySelected, setCopySelected] = useState(false);
  const { applicationId } = useParams()

  useEffect(() => {
    const fetchAsync = async () => {
      await dispatch(fetchCorrespondencesByApplicationIdThunk(applicationId))
      setExpanded({}); // Reset the expanded state when correspondences change
    }
    fetchAsync()
  }, [correspondencesArray.length]);

  useEffect(() => {
    if (copySelected) {
      const timer = setTimeout(() => {
        setCopySelected(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [copySelected]);

  // Toggle 'expanded' class to individual correspondence on click
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
            {Object.values(correspondences).reverse().map((corr, index) => (
              <div className="corr-w-break" key={index}>
                <div className="individual-corr" onClick={() => handleClick(index)}>
                  <div className="corr-left">
                    {chooseIcon(corr.corr_type)}
                  </div>
                  <div className="corr-right">
                    <div className="corr-type">
                      <div className="corr-type-word">{formatCorrType(corr.corr_type)}:</div>
                      <div
                        className={`response ${expanded[index] ? 'expanded' : ''}`}
                      >
                        {corr.generated_response}
                      </div>
                      <img
                        src={copyIcon}
                        alt="Copy"
                        className="copy-icon"
                        onClick={(e) => {
                          setCopySelected(true)
                          e.stopPropagation();
                          handleCopyToClipboard(corr.generated_response);
                        }}
                      />
                    </div>
                    <div className="corr-date">{corr.created_at}</div>
                  </div>
                </div>
                {index < Object.values(correspondences).length - 1 && (
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
