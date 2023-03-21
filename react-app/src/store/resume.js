// constants
const POPULATE = 'resume/POPULATE_USER_RESUMES'
const READ = 'resume/READ_SINGLE_RESUME'
const UPDATE = 'resume/UPDATE_RESUME'
const DELETE = 'resume/DELETE_RESUME'

// -------- ACTIONS ---------
const readResumes = (resumes) => ({
  type: POPULATE,
  resumes
})

const readSingleResume = (resume) => ({
  type: READ,
  resume
})

const updateResume = (resume) => ({
  type: UPDATE,
  resume
})

const deleteResume = (resumeId) => ({
  type: DELETE,
  resumeId
})

// ----- THUNK ACTIONS ------
export const fetchAllResumesThunk = () => async (dispatch) => {
  const response = await fetch('/api/resumes/')
  if (response.ok) {
    const normalizedResumes = {}
    const resumes = await response.json();
    resumes.forEach(resume => {
      normalizedResumes[resume.id] = resume;
    })
    await dispatch(readResumes(normalizedResumes))
    return normalizedResumes
  }
}

export const fetchSingleResumeThunk = (resumeId) => async (dispatch) => {
  const response = await fetch(`/api/resumes/${resumeId}`)
  if (response.ok) {
    const resume = await response.json();
    await dispatch(readSingleResume(resume));
    return resume
  }
}

export const updateResumeThunk = (resume) => async (dispatch) => {
  const response = await fetch(`/api/resumes/${resume.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resume)
  });
  if (response.ok) {
    const updatedResume = await response.json();
    await dispatch(updateResume(updatedResume));
    await dispatch(readSingleResume(updatedResume));
  }
}

export const deleteResumeThunk = (resumeId) => async (dispatch) => {
  const response = await fetch(`/api/resumes/${resumeId}`, {
    method: 'DELETE'
  });
  if (response.ok) {
    await dispatch(deleteResume(resumeId));
  }
  return 'Successfully deleted'
}

// -------- REDUCER ---------
const initialState = {
  allResumes: {},
  currentResume: {}
}

export default function resumesReducer(state = initialState, action) {
  const newState = { ...state }
  switch (action.type) {
    case POPULATE:
      newState.allResumes = { ...action.resumes };
      return newState;
    case READ:
      newState.currentResume = { ...action.resume };
      return newState;
    case UPDATE:
      newState.allResumes = { ...state.allResumes };
      newState.allResumes[action.resume.id] = action.resume
      return newState;
    case DELETE:
      newState.allResumes = { ...state.allResumes };
      delete newState.allResumes[action.resumeId];
      return newState;
    default:
      return state;
  }
}
