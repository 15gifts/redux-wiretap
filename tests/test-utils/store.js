const redux = require('redux');
const { actionTypes } = require('./actions');
const reduxWiretap = require('../../src/index').default;

const initialState = { count: 0 };

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.increment:
      return Object.assign({}, state, { count: state.count + 1 });
    case actionTypes.decrement:
      return Object.assign({}, state, { count: state.count - 1 });
    case actionTypes.resetCounter:
      return Object.assign({}, state, { count: 0 });
    default:
      return state;
  }
};

const createWiretappedStore = (trackingConfig) => {
  const trackingMiddleware = reduxWiretap(trackingConfig);

  return redux.createStore(reducers, redux.applyMiddleware(trackingMiddleware));
};

const createStore = () => redux.createStore(reducers);

module.exports = {
  createStore,
  createWiretappedStore,
};
