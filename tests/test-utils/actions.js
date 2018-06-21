const actionTypes = {
  increment: 'increment',
  decrement: 'decrement',
  resetCounter: 'resetCounter',
};

module.exports = {
  actionTypes,
  increment: () => ({ type: actionTypes.increment }),
  decrement: () => ({ type: actionTypes.decrement }),
  resetCounter: () => ({ type: actionTypes.resetCounter }),
};
