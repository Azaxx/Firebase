import { combineReducers } from 'redux';
import sessionReducer from './session';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  // Add here additional
});

export default rootReducer;
