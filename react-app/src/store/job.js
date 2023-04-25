// constants
const CREATE = 'job/CREATE_JOB'
const POPULATE = 'job/POPULATE_JOBS'
const READ = 'job/READ_SINGLE_JOB'
const UPDATE = 'job/UPDATE_JOB'
const DELETE = 'job/DELETE_JOB'

// -------- ACTIONS ---------
const createJob = (job) => ({
  type: CREATE,
  job
})

const populateJobs = (jobs) => ({
  type: POPULATE,
  jobs
})

const readSingleJob = (job) => ({
  type: READ,
  job
})

const updateJob = (job) => ({
  type: UPDATE,
  job
})

const deleteJob = (jobId) => ({
  type: DELETE,
  jobId
})

// ----- THUNK ACTIONS ------
export const createJobThunk = (job) => async (dispatch) => {
  const response = await fetch('/api/jobs/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(job)
  })

  if (response.ok) {
    const newJob = await response.json();
    await dispatch(createJob(newJob));
    return newJob;
  } else {
    return { 'error': 'Error creating job' };
  }
}

export const fetchAllJobsThunk = () => async (dispatch) => {
  const response = await fetch('/api/jobs/')
  if (response.ok) {
    const jobs = await response.json();
    await dispatch(populateJobs(jobs))
    return jobs
  } else {
    return { 'error': 'Error fetching jobs' };
  }
}

export const fetchSingleJobThunk = (jobId) => async (dispatch) => {
  const response = await fetch(`/api/jobs/${jobId}`)
  if (response.ok) {
    const job = await response.json();
    await dispatch(readSingleJob(job));
    return job;
  } else if (response.status === 404) {
    return { notFound: true }
  } else {
    return { 'error': 'Error fetching single job' };
  }
}

export const updateJobThunk = (job) => async (dispatch) => {
  const response = await fetch(`/api/jobs/${job.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(job)
  });
  if (response.ok) {
    const updatedJob = await response.json();
    await dispatch(updateJob(updatedJob));
    await dispatch(readSingleJob(updatedJob));
  } else {
    return { 'error': 'Error updating job' };
  }
}

export const deleteJobThunk = (jobId) => async (dispatch) => {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'DELETE'
  });
  if (response.ok) {
    await dispatch(deleteJob(jobId));
    return 'Successfully deleted';
  } else {
    return { 'error': 'Error deleting job' };
  }
}

// -------- REDUCER ---------
const initialState = {
  allJobs: {},
  currentJob: {}
};

export default function jobsReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case POPULATE:
      newState.allJobs = { ...action.jobs };
      return newState;
    case READ:
      newState.currentJob = { ...action.job };
      return newState;
    case CREATE:
      newState.currentJob = { ...action.job };
      newState.allJobs = { ...state.allJobs };
      newState.allJobs[action.job.id] = action.job;
      return newState;
    case UPDATE:
      newState.allJobs = { ...state.allJobs };
      newState.allJobs[action.job.id] = action.job;
      return newState;
    case DELETE:
      newState.allJobs = { ...state.allJobs };
      delete newState.allJobs[action.jobId];
      return newState;
    case CLEAR_CURRENT_JOB:
      return {
        ...state,
        currentJob: null,
      };
    default:
      return state;
  }
}
