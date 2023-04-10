import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './AllCorrespondences.css';
import copyIcon from './assets/copy-icon-grey.png';
import { fetchCorrespondencesByApplicationIdThunk, updateCorrespondenceThunk, deleteCorrespondenceThunk } from '../../../store/correspondence';
import { useParams } from 'react-router-dom';
import { formatCorrType, highlightBracketedWords } from '../../../utils/format';
import { chooseIcon } from '../../../utils/corr-images';
import { handleCopyToClipboard } from '../../../utils/clipboard';
import { authenticate } from '../../../store/session';

export default function AllCorrespondences() {
  const dispatch = useDispatch()
  const correspondences = useSelector(
    (state) => state.correspondences.currentApplicationCorrespondences
  );
  const correspondencesArray = Object.values(correspondences)
  const [notFound, setNotFound] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [copySelected, setCopySelected] = useState(false);
  const [editVisible, setEditVisible] = useState({});
  const [editting, setEditting] = useState({});
  const [editedResponse, setEditedResponse] = useState({});
  const { applicationId } = useParams()
  const [showDeleteDropdown, setShowDeleteDropdown] = useState([]);

  useEffect(() => {
    const fetchAsync = async () => {
      await dispatch(fetchCorrespondencesByApplicationIdThunk(applicationId))
      setExpanded({}); // Reset the expanded state when correspondences change
      setEditedResponse({});
      setEditting({});
      await dispatch(authenticate());
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
  }, [copySelected, correspondencesArray.length]);

  // Toggle 'expanded' class and 'editVisible' state to individual correspondence on click
  const handleClick = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
    setEditVisible((prevEditVisible) => ({
      ...prevEditVisible,
      [index]: !prevEditVisible[index],
    }));
  };

  const handleSaveChanges = async (index, correspondence) => {
    const updatedCorrespondence = { ...correspondence, generated_response: editedResponse[index] };
    await setEditting({ ...editVisible, [index]: false })
    await dispatch(updateCorrespondenceThunk(updatedCorrespondence));
    await setEditVisible({ ...editVisible, [index]: true})
  };

  const handleDelete = async (e, index, correspondenceId) => {
    e.stopPropagation();
    await setEditting({});
    await setEditVisible({});
    await setShowDeleteDropdown(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    })
    const response = await dispatch(deleteCorrespondenceThunk(correspondenceId));
    if (response === 'Successfully deleted') {
      // Fetch the updated correspondence data after deletion
      await dispatch(fetchCorrespondencesByApplicationIdThunk(applicationId));
    } else {
      console.error(response.error);
    }
  };
  

  return (
    <>
      {!notFound && correspondencesArray.length > 0 && (
        <div className="job-description-container">
          <div className="corr-container">
            {Object.values(correspondences).reverse().map((corr, index) => (
              <div className="corr-w-break" key={index}>
                <div className="individual-corr" onClick={() => handleClick(index)}>
                  <button
                    className="skill-level-box remove-button remove-corr"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowDeleteDropdown(prev => {
                        const newState = [...prev];
                        newState[index] = !newState[index];
                        return newState;
                      })
                    }}
                  >
                    X
                  </button>
                  { showDeleteDropdown[index] && (
                    <div className="delete-dropdown del-corr" key={corr.id}>
                      <div>Confirm delete?</div>
                      <div className="delete-options">
                        <button 
                          className="delete-option-button delete-option-yes"
                          onClick={(e) => handleDelete(e, index, corr.id)}
                        >
                          Yes
                        </button>
                        <button 
                          className="delete-option-button delete-option-no"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setShowDeleteDropdown(prev => {
                              const newState = [...prev];
                              newState[index] = false;
                              return newState;
                            })
                          }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="corr-left">
                    {chooseIcon(corr.corr_type)}
                  </div>
                  <div className="corr-right">
                    <div className="corr-type">
                      <div className="corr-type-word">{formatCorrType(corr.corr_type)}:</div>
                      {editVisible[index] && (
                        <button className="edit-button edit-corr" onClick={(e) => {
                          e.stopPropagation();
                          setEditting({ ...editting, [index]: true})
                        }}>
                          Edit
                        </button>
                      )}
                        {editting[index] ? (
                          <div>
                            <textarea
                              type="text"
                              className="editting-response"
                              value={editedResponse[index] || corr.generated_response}
                              onChange={(e) => setEditedResponse({ ...editedResponse, [index]: e.target.value })}
                            />
                            <button 
                              className="save-button save-corr" 
                              onClick={() => {
                                handleSaveChanges(index, corr)
                              }}
                            >
                              Save Changes
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`response ${expanded[index] ? 'expanded' : ''}`}
                          >
                            {highlightBracketedWords(corr?.generated_response || '')}
                          </div>
                        )}
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
      {!notFound && !(correspondencesArray.length > 0) && (
        <div className="not-found">
          <h3>You have no correspondences for this job application yet.</h3>
          <h4>Generate a new correspondence:</h4>
          <div className="intro-instruct">
            <p>1. Click the 'Message Recruiter' button</p>
            <p>2. Select the type of correspondence you would like to create.</p>
          </div>
        </div>
      )}
    </>
  );
}
