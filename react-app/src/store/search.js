// constants
const POPULATE_SEARCHES = 'search/POPULATE_SEARCHES';
const READ_SEARCH = 'searchHistory/READ_SEARCH';
const CREATE_SEARCH = 'search/CREATE_SEARCH';
const DELETE_SEARCH = 'search/DELETE_SEARCH';

// -------- ACTIONS ---------
const populateSearches = (searches) => ({
  type: POPULATE_SEARCHES,
  searches,
});

const readSearch = (search) => ({
  type: READ_SEARCH,
  search,
});

const createSearch = (search) => ({
  type: CREATE_SEARCH,
  search,
});

const deleteSearch = (searchId) => ({
  type: DELETE_SEARCH,
  searchId,
});

// ----- THUNK ACTIONS ------
export const fetchAllSearchesThunk = () => async (dispatch) => {
  const response = await fetch('/api/searches/');
  if (response.ok) {
    const searches = await response.json();
    await dispatch(populateSearches(searches));
    await dispatch(readSearch(searches[searches.length - 1]))
    return searches;
  } else {
    return { error: 'Error fetching searches' };
  }
};

export const fetchSingleSearchThunk = (searchId) => async (dispatch) => {
  const response = await fetch(`/api/searches/${searchId}`);
  if (response.ok) {
    const search = await response.json();
    await dispatch(readSearch(search));
    return search;
  } else if (response.status === 404) {
    return { notFound: true };
  } else {
    return { error: 'Error fetching single search' };
  }
};

export const createSearchThunk = (searchData) => async (dispatch) => {
  const response = await fetch('/api/searches/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchData),
  });

  if (response.ok) {
    const newSearch = await response.json();
    await dispatch(createSearch(newSearch));
    return newSearch;
  } else {
    return { error: 'Error creating search' };
  }
};

export const deleteSearchThunk = (searchId) => async (dispatch) => {
  const response = await fetch(`/api/searches/${searchId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    await dispatch(deleteSearch(searchId));
    return 'Successfully deleted';
  } else {
    return { error: 'Error deleting search' };
  }
};

// -------- REDUCER ---------
const initialState = {
  allSearches: {},
  lastSearch: {},
};

export default function searchReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case POPULATE_SEARCHES:
      newState.allSearches = { ...action.searches };
      return newState;
    case CREATE_SEARCH:
      newState.allSearches = { ...state.allSearches, [action.search.id]: action.search };
      return newState;
    case READ_SEARCH:
      newState.lastSearch = { ...action.search };
      return newState;
    case DELETE_SEARCH:
      newState.allSearches = { ...state.allSearches };
      delete newState.allSearches[action.searchId];
      return newState;
    default:
      return state;
  }
}
