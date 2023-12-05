import {createStore, combineReducers, applyMiddleware} from 'redux';

import thunk from 'redux-thunk';
import {addressReducer} from '../reducer/address-reducer';

export const configStore = () => {
  const store = createStore(
    combineReducers({
      address: addressReducer,
    }),
    applyMiddleware(thunk)
  );
  return store;
};
