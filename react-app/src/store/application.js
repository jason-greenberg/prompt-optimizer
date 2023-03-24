import { fetchSingleResumeThunk } from "./resume";

// constants
const CREATE = 'application/CREATE_APPLICATION';
const POPULATE = 'application/POPULATE_USER_APPLICATIONS';
const READ = 'application/READ_SINGLE_APPLICATION';
const UPDATE = 'application/UPDATE_APPLICATION';
const DELETE = 'application/DELETE_APPLICATION';

// -------- ACTIONS ---------
const createApplication = (application) => ({
  type: CREATE,
  application,
});

const readApplications = (applications) => ({
  type: POPULATE,
  applications,
});

const readSingleApplication = (application) => ({
  type: READ,
  application,
});

const updateApplication = (application) => ({
  type: UPDATE,
  application,
});

const deleteApplication = (applicationId) => ({
  type: DELETE,
  applicationId,
});

// ----- THUNK ACTIONS ------
export const createApplicationThunk = (application) => async (dispatch) => {
  const response = await fetch(`/api/applications/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  });
  if (response.ok) {
    const newApplication = await response.json();
    await dispatch(createApplication(newApplication));
    return newApplication;
  } else {
    throw new Error('Error creating application');
  }
};

export const fetchAllApplicationsThunk = () => async (dispatch) => {
  const response = await fetch('/api/applications/');
  if (response.ok) {
    const normalizedApplications = {};
    const applications = await response.json();
    applications.forEach((application) => {
      normalizedApplications[application.id] = application;
    });
    await dispatch(readApplications(normalizedApplications));
    return normalizedApplications;
  } else {
    throw new Error('Error fetching applications');
  }
};

export const fetchSingleApplicationThunk = (applicationId) => async (dispatch) => {
  const response = await fetch(`/api/applications/${applicationId}`);
  if (response.ok) {
    const application = await response.json();
    await dispatch(readSingleApplication(application));
    await dispatch(fetchSingleResumeThunk(application.resume_id))
    return application;
  } else {
    throw new Error('Error fetching single application');
  }
};

export const updateApplicationThunk = (application) => async (dispatch) => {
  const response = await fetch(`/api/applications/${application.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  });
  if (response.ok) {
    const updatedApplication = await response.json();
    await dispatch(updateApplication(updatedApplication));
    await dispatch(readSingleApplication(updatedApplication));
  } else {
    throw new Error('Error updating application');
  }
};

export const deleteApplicationThunk = (applicationId) => async (dispatch) => {
  const response = await fetch(`/api/applications/${applicationId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    await dispatch(deleteApplication(applicationId));
    return 'Successfully deleted';
  } else {
    throw new Error('Error deleting application');
  }
};

// -------- REDUCER ---------
const initialState = {
  allApplications: {},
  currentApplication: {},
};

export default function applicationsReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case POPULATE:
      newState.allApplications = { ...action.applications };
      return newState;
    case READ:
      newState.currentApplication = { ...action.application };
      return newState;
    case CREATE:
      newState.currentApplication = { ...action.application };
      newState.allApplications = {
        ...state.allApplications,
        [action.application.id]: action.application,
      };
      return newState;
    case UPDATE:
      newState.allApplications = { ...state.allApplications };
      newState.allApplications[action.application.id] = action.application;
      return newState;
    case DELETE:
      newState.allApplications = { ...state.allApplications };
      delete newState.allApplications[action.applicationId];
      return newState;
    default:
      return state;
  }
}
