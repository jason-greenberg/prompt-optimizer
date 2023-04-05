import { removeCoverLetterId } from './application';

// constants
const CREATE = 'coverLetter/CREATE_COVER_LETTER';
const POPULATE = 'coverLetter/POPULATE_USER_COVER_LETTERS';
const READ = 'coverLetter/READ_SINGLE_COVER_LETTER';
const UPDATE = 'coverLetter/UPDATE_COVER_LETTER';
const DELETE = 'coverLetter/DELETE_COVER_LETTER';
export const CLEAR_CURRENT_COVER_LETTER = 'coverletter/CLEAR_CURRENT_COVER_LETTER';


// -------- ACTIONS ---------
const createCoverLetter = (coverLetter) => ({
  type: CREATE,
  coverLetter,
});

export const clearCurrentCoverLetter = () => ({
  type: CLEAR_CURRENT_COVER_LETTER,
});

const readCoverLetters = (coverLetters) => ({
  type: POPULATE,
  coverLetters,
});

const readSingleCoverLetter = (coverLetter) => ({
  type: READ,
  coverLetter,
});

const updateCoverLetter = (coverLetter) => ({
  type: UPDATE,
  coverLetter,
});

const deleteCoverLetter = (coverLetterId) => ({
  type: DELETE,
  coverLetterId,
});

// ----- THUNK ACTIONS ------
export const createCoverLetterThunk = (resumeId, jobDescription, companyDetails, engine, jobTitle) => async (dispatch) => {
  const response = await fetch(`/api/resumes/${resumeId}/coverletters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      job_description: jobDescription,
      company_details: companyDetails,
      engine: engine,
      job_title: jobTitle
    }),
  });
  if (response.ok) {
    const newCoverLetter = await response.json();
    await dispatch(createCoverLetter(newCoverLetter));
    return newCoverLetter;
  } else if (response.status === 503) {
    const errorDetails = await response.json();
    return { error: 'Error creating cover letter', details: errorDetails };
  } else {
    return { error: 'Error creating cover letter' };
  }
};


export const updateCoverLetterWithApplicationThunk = (resumeId, jobDescription, companyDetails, engine, applicationId) => async (dispatch) => {
  const response = await fetch(`/api/resumes/${resumeId}/coverletters/standalone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      job_description: jobDescription,
      company_details: companyDetails,
      engine: engine,
      application_id: applicationId
    }),
  });
  if (response.ok) {
    const updatedCoverLetter = await response.json();
    await dispatch(updateCoverLetter(updatedCoverLetter.coverletter));
    await dispatch(readSingleCoverLetter(updatedCoverLetter.coverletter));
    return updatedCoverLetter;
  } else {
    return { error: 'Error updating cover letter' };
  }
};

export const fetchAllCoverLettersThunk = () => async (dispatch) => {
  const response = await fetch('/api/coverletters/');
  if (response.ok) {
    const normalizedCoverLetters = {};
    const coverLetters = await response.json();
    coverLetters.forEach((coverLetter) => {
      normalizedCoverLetters[coverLetter.id] = coverLetter;
    });
    await dispatch(readCoverLetters(normalizedCoverLetters));
    return normalizedCoverLetters;
  } else {
    return { error: 'Error fetching cover letters' };
  }
};

export const fetchSingleCoverLetterThunk = (coverLetterId) => async (dispatch) => {
  const response = await fetch(`/api/coverletters/${coverLetterId}`);
  if (response.ok) {
    const coverLetter = await response.json();
    await dispatch(readSingleCoverLetter(coverLetter));
    return coverLetter;
  } else if (response.status === 404) {
    return { notFound: true };
  } else {
    return { error: 'Error fetching single cover letter' };
  }
};


export const updateCoverLetterThunk = (coverLetter) => async (dispatch) => {
  const response = await fetch(`/api/coverletters/${coverLetter.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(coverLetter),
  });
  if (response.ok) {
    const updatedCoverLetter = await response.json();
    await dispatch(updateCoverLetter(updatedCoverLetter));
    await dispatch(readSingleCoverLetter(updatedCoverLetter));
  } else {
    return { error: 'Error updating cover letter' };
  }
};

export const deleteCoverLetterThunk = (coverLetterId, applicationId) => async (dispatch) => {
  const response = await fetch(`/api/coverletters/${coverLetterId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    await dispatch(deleteCoverLetter(coverLetterId));

    // If an applicationId is provided, dispatch the removeCoverLetterId action
    if (applicationId) {
      await dispatch(removeCoverLetterId(applicationId));
    }

    return 'Successfully deleted';
  } else {
    return { error: 'Error deleting cover letter' };
  }
};


// -------- REDUCER ---------
const initialState = {
  allCoverLetters: {},
  currentCoverLetter: {},
};

export default function coverLettersReducer(state = initialState, action) {
  const newState = { ...state };
  newState.allCoverLetters = { ...state.allCoverLetters }
  switch (action.type) {
    case POPULATE:
      newState.allCoverLetters = { ...action.coverLetters };
      return newState;
    case READ:
      newState.currentCoverLetter = { ...action.coverLetter };
      return newState;
    case CREATE:
      newState.allCoverLetters[action.coverLetter.coverletter.id] = action.coverLetter.coverletter
      newState.currentCoverLetter = { ...action.coverLetter.coverletter }
      return newState;
    case UPDATE:
      newState.allCoverLetters[action.coverLetter.id] = action.coverLetter;
      return newState;
    case DELETE:
      delete newState.allCoverLetters[action.coverLetterId];
      return newState;
    case CLEAR_CURRENT_COVER_LETTER:
      return {
        ...state,
        currentCoverLetter: null,
      };
    default:
      return state
  }
}
