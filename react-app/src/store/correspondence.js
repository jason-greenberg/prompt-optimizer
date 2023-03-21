// constants
const CREATE = 'correspondence/CREATE_CORRESPONDENCE';
const POPULATE = 'correspondence/POPULATE_USER_CORRESPONDENCES';
const POPULATE_BY_APPLICATION = 'correspondence/POPULATE_BY_APPLICATION';
const READ = 'correspondence/READ_SINGLE_CORRESPONDENCE';
const UPDATE = 'correspondence/UPDATE_CORRESPONDENCE';
const DELETE = 'correspondence/DELETE_CORRESPONDENCE';

// -------- ACTIONS ---------
const createCorrespondence = (correspondence) => ({
  type: CREATE,
  correspondence,
});

const populateApplicationCorrespondences = (correspondences) => ({
  type: POPULATE_BY_APPLICATION,
  correspondences,
});

const readCorrespondences = (correspondences) => ({
  type: POPULATE,
  correspondences,
});

const readSingleCorrespondence = (correspondence) => ({
  type: READ,
  correspondence,
});

const updateCorrespondence = (correspondence) => ({
  type: UPDATE,
  correspondence,
});

const deleteCorrespondence = (correspondenceId) => ({
  type: DELETE,
  correspondenceId,
});

// ----- THUNK ACTIONS ------
export const createCorrespondenceThunk = (applicationId, correspondence) => async (dispatch) => {
  const response = await fetch(`/api/applications/${applicationId}/correspondences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(correspondence),
  });
  if (response.ok) {
    const newCorrespondence = await response.json();
    await dispatch(createCorrespondence(newCorrespondence));
    return newCorrespondence;
  } else {
    throw new Error('Error creating correspondence');
  }
};

export const fetchAllCorrespondencesThunk = () => async (dispatch) => {
  const response = await fetch('/api/correspondences/');
  if (response.ok) {
    const normalizedCorrespondences = {};
    const correspondences = await response.json();
    correspondences.forEach((correspondence) => {
      normalizedCorrespondences[correspondence.id] = correspondence;
    });
    await dispatch(readCorrespondences(normalizedCorrespondences));
    return normalizedCorrespondences;
  } else {
    throw new Error('Error fetching correspondences');
  }
};

export const fetchCorrespondencesByApplicationIdThunk = (applicationId) => async (dispatch) => {
  const response = await fetch(`/api/correspondences/application/${applicationId}`);
  if (response.ok) {
    const correspondences = await response.json();
    const normalizedCorrespondences = {};
    correspondences.forEach((correspondence) => {
      normalizedCorrespondences[correspondence.id] = correspondence;
    });
    await dispatch(populateApplicationCorrespondences(normalizedCorrespondences));
    return normalizedCorrespondences;
  } else {
    throw new Error('Error fetching correspondences by application id');
  }
};


export const fetchSingleCorrespondenceThunk = (correspondenceId) => async (dispatch) => {
  const response = await fetch(`/api/correspondences/${correspondenceId}`);
  if (response.ok) {
    const correspondence = await response.json();
    await dispatch(readSingleCorrespondence(correspondence));
    return correspondence;
  } else {
    throw new Error('Error fetching single correspondence');
  }
};

export const updateCorrespondenceThunk = (correspondence) => async (dispatch) => {
  const response = await fetch(`/api/correspondences/${correspondence.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(correspondence),
  });
  if (response.ok) {
    const updatedCorrespondence = await response.json();
    await dispatch(updateCorrespondence(updatedCorrespondence));
    await dispatch(readSingleCorrespondence(updatedCorrespondence));
  } else {
    throw new Error('Error updating correspondence');
  }
};

export const deleteCorrespondenceThunk = (correspondenceId) => async (dispatch) => {
  const response = await fetch(`/api/correspondences/${correspondenceId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    await dispatch(deleteCorrespondence(correspondenceId));
    return 'Successfully deleted';
  } else {
    throw new Error('Error deleting correspondence');
  }
}

// -------- REDUCER ---------
const initialState = {
  allCorrespondences: {},
  currentApplicationCorrespondences: {},
  currentCorrespondence: {},
};
  
export default function correspondencesReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case POPULATE:
      newState.allCorrespondences = { ...action.correspondences };
      return newState;
    case POPULATE_BY_APPLICATION:
      newState.currentApplicationCorrespondences = { ...action.correspondences };
      return newState;
    case READ:
      newState.currentCorrespondence = { ...action.correspondence };
      return newState;
    case CREATE:
      newState.currentCorrespondence = { ...action.correspondence };
      newState.allCorrespondences = {
        ...state.allCorrespondences,
        ...action.correspondence,
      };
      return newState;
    case UPDATE:
      newState.allCorrespondences = { ...state.allCorrespondences };
      newState.allCorrespondences[action.correspondence.id] = action.correspondence;
      if (newState.currentApplicationCorrespondences[action.correspondence.id]) {
        newState.currentApplicationCorrespondences[action.correspondence.id] = action.correspondence;
      }
      return newState;
    case DELETE:
      newState.allCorrespondences = { ...state.allCorrespondences };
      delete newState.allCorrespondences[action.correspondenceId];
      if (newState.currentApplicationCorrespondences[action.correspondenceId]) {
        delete newState.currentApplicationCorrespondences[action.correspondenceId];
      }
      return newState;
    default:
      return state;
  }
}
