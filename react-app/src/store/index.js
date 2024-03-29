import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import resumesReducer from './resume'
import coverLettersReducer from './coverletter';
import applicationsReducer from './application';
import correspondencesReducer from './correspondence';
import jobsReducer from './job';
import searchReducer from './search';
import promptReducer from './prompt';

const rootReducer = combineReducers({
  session,
  resumes: resumesReducer,
  coverletters: coverLettersReducer,
  applications: applicationsReducer,
  correspondences: correspondencesReducer,
  jobs: jobsReducer,
  searches: searchReducer,
  prompts: promptReducer
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
