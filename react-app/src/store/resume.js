// constants
const POPULATE = 'resume/POPULATE_USER_RESUMES'
const READ = 'resume/READ_SINGLE_RESUME'

// -------- ACTIONS ---------
const readResumes = (resumes) => ({
  type: POPULATE,
  resumes
})

const readSingleResume = (resume) => ({
  type: READ,
  resume
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

// -------- REDUCER ---------
const initialState = {
  allResumes: {},
  currentResume: {}
}

export default function resumesReducer(state = initialState, action) {
  const newState = { ...state }
  switch (action.type) {
    case POPULATE:
      newState.allResumes = { ...action.resumes }
      return newState;
    case READ:
      newState.currentResume = { ...action.resume }
      return newState;
    default:
      return state;
  }
}
