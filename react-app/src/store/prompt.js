// constants
const GET_ALL_PROMPTS = 'prompt/GET_ALL_PROMPTS';
const GET_PROMPT = 'prompt/GET_PROMPT';
const CREATE_PROMPT = 'prompt/CREATE_PROMPT';
const DELETE_PROMPT = 'prompt/DELETE_PROMPT';

// -------- ACTIONS ---------
const getAllPrompts = (prompts) => ({
  type: GET_ALL_PROMPTS,
  prompts,
});

const getPrompt = (prompt) => ({
  type: GET_PROMPT,
  prompt,
});

const createPrompt = (prompt) => ({
  type: CREATE_PROMPT,
  prompt,
});

const deletePrompt = (promptId) => ({
  type: DELETE_PROMPT,
  promptId,
});

// ----- THUNK ACTIONS ------
export const fetchAllPromptsThunk = () => async (dispatch) => {
  const response = await fetch('/api/prompt/');
  if (response.ok) {
    const prompts = await response.json();
    await dispatch(getAllPrompts(prompts));
    return prompts;
  } else {
    return { error: 'Error fetching prompts' };
  }
};

export const fetchSinglePromptThunk = (promptId) => async (dispatch) => {
  const response = await fetch(`/api/prompt/${promptId}`);
  if (response.ok) {
    const prompt = await response.json();
    await dispatch(getPrompt(prompt));
    return prompt;
  } else if (response.status === 404) {
    return { notFound: true };
  } else {
    return { error: 'Error fetching single prompt' };
  }
};

export const createPromptThunk = (promptData) => async (dispatch) => {
  const response = await fetch('/api/prompts/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promptData),
  });

  if (response.ok) {
    const newPrompt = await response.json();
    await dispatch(createPrompt(newPrompt));
    return newPrompt;
  } else {
    return { error: 'Error creating prompt' };
  }
};

export const deletePromptThunk = (promptId) => async (dispatch) => {
  const response = await fetch(`/api/prompt/${promptId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    await dispatch(deletePrompt(promptId));
    return 'Successfully deleted';
  } else {
    return { error: 'Error deleting prompt' };
  }
};

// -------- REDUCER ---------
const initialState = {
  allPrompts: {},
  selectedPrompt: {},
};

export default function promptReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case GET_ALL_PROMPTS:
      newState.allPrompts = { ...action.prompts };
      return newState;
    case CREATE_PROMPT:
      newState.allPrompts = { ...state.allPrompts, [action.prompt.id]: action.prompt };
      return newState;
    case GET_PROMPT:
      newState.selectedPrompt = { ...action.prompt };
      return newState;
    case DELETE_PROMPT:
      newState.allPrompts = { ...state.allPrompts };
      delete newState.allPrompts[action.promptId];
      return newState;
    default:
      return state;
  }
}
