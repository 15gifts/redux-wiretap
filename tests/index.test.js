const { createStore, createWiretappedStore } = require('./test-utils/store');
const actions = require('./test-utils/actions');

const { actionTypes } = actions;

describe('index', () => {
  test('empty config doesn\'t affect store behaviour', () => {
    const defaultStore = createStore();
    const wiretappedStore = createWiretappedStore({});

    expect(defaultStore.getState()).toEqual(wiretappedStore.getState());

    defaultStore.dispatch(actions.increment());
    wiretappedStore.dispatch(actions.increment());

    expect(defaultStore.getState()).toEqual(wiretappedStore.getState());
  });

  test('supplying only the `triggerAction` for a point fires the supplied `callback` function', () => {
    const config = {
      callback: jest.fn(),
      points: [{ triggerAction: actionTypes.increment }],
    };
    const wiretappedStore = createWiretappedStore(config);

    wiretappedStore.dispatch(actions.increment());

    expect(config.callback.mock.calls.length).toBe(1);
    expect(config.callback.mock.calls[0][0]).toBe(undefined);
  });

  test('1111supplying only the `triggerAction` for a point fires the supplied `callback` function', () => {
    const config = {
      callback: jest.fn(),
      points: [],
    };
    const wiretappedStore = createWiretappedStore(config);

    wiretappedStore.dispatch(actions.increment());

    expect(config.callback.mock.calls.length).toBe(0);
  });

  test('`data` returned by the `point` config `logic` function is passed into the `callback` function', () => {
    const data = { testData: true };
    const config = {
      callback: jest.fn(),
      points: [
        {
          triggerAction: actionTypes.increment,
          logic: () => ({ data }),
        },
      ],
    };
    const wiretappedStore = createWiretappedStore(config);

    wiretappedStore.dispatch(actions.increment());

    expect(config.callback.mock.calls.length).toBe(1);
    expect(config.callback.mock.calls[0][0]).toBe(data);
  });

  test('all action types in `triggerAction` array config cause `callback` to get called', () => {
    const config = {
      callback: jest.fn(),
      points: [{ triggerAction: [actionTypes.increment, actionTypes.decrement] }],
    };
    const wiretappedStore = createWiretappedStore(config);

    wiretappedStore.dispatch(actions.increment());
    expect(config.callback.mock.calls.length).toBe(1);

    wiretappedStore.dispatch(actions.decrement());
    expect(config.callback.mock.calls.length).toBe(2);

    wiretappedStore.dispatch(actions.resetCounter());
    expect(config.callback.mock.calls.length).toBe(2);
  });

  test('no valid `point` config fires `beforeAnyAction` and `afterAnyAction` but none of the callback functions', () => {
    const config = {
      beforeAnyAction: jest.fn(),
      beforeCallback: jest.fn(),
      callback: jest.fn(),
      afterCallback: jest.fn(),
      afterAnyAction: jest.fn(),
      points: [{ triggerAction: actionTypes.decrement }],
      vars: {},
    };

    const wiretappedStore = createWiretappedStore(config);

    wiretappedStore.dispatch(actions.increment());

    expect(config.beforeAnyAction.mock.calls.length).toBe(1);
    expect(config.beforeCallback.mock.calls.length).toBe(0);
    expect(config.callback.mock.calls.length).toBe(0);
    expect(config.afterCallback.mock.calls.length).toBe(0);
    expect(config.afterAnyAction.mock.calls.length).toBe(1);
  });

  describe('`beforeAnyAction` function', () => {
    test('gets called if the action is in the points list', () => {
      const config = {
        beforeAnyAction: jest.fn(),
        points: [{ triggerAction: actionTypes.increment }],
      };
      const wiretappedStore = createWiretappedStore(config);

      wiretappedStore.dispatch(actions.increment());

      expect(config.beforeAnyAction.mock.calls.length).toBe(1);
    });

    test('gets called if the action is not in the points list', () => {
      const config = {
        beforeAnyAction: jest.fn(),
      };
      const wiretappedStore = createWiretappedStore(config);

      wiretappedStore.dispatch(actions.increment());

      expect(config.beforeAnyAction.mock.calls.length).toBe(1);
    });
  });

  describe('`beforeCallback` function', () => {
    test('gets called if the action is in the points list', () => {
      const config = {
        beforeCallback: jest.fn(),
        points: [{ triggerAction: actionTypes.increment }],
      };
      const wiretappedStore = createWiretappedStore(config);

      wiretappedStore.dispatch(actions.increment());

      expect(config.beforeCallback.mock.calls.length).toBe(1);
    });

    test('does not get called if the action is not in the points list', () => {
      const config = {
        beforeCallback: jest.fn(),
        points: [{ triggerAction: actionTypes.decrement }],
      };
      const wiretappedStore = createWiretappedStore(config);

      wiretappedStore.dispatch(actions.increment());

      expect(config.beforeCallback.mock.calls.length).toBe(0);
    });
  });

  describe('`callback` function', () => {
    test('gets called if the action is in the points list', () => {
      const config = {
        callback: jest.fn(),
        points: [{ triggerAction: actionTypes.increment }],
      };
      const wiretappedStore = createWiretappedStore(config);

      wiretappedStore.dispatch(actions.increment());

      expect(config.callback.mock.calls.length).toBe(1);
    });

    test('does not get called if the action is not in the points list', () => {
      const config = {
        callback: jest.fn(),
        points: [{ triggerAction: actionTypes.decrement }],
      };
      const wiretappedStore = createWiretappedStore(config);

      wiretappedStore.dispatch(actions.increment());

      expect(config.callback.mock.calls.length).toBe(0);
    });
  });

  describe('`afterCallback` function', () => {
    test('gets called if the action is in the points list', () => {
      const config = {
        afterCallback: jest.fn(),
        points: [{ triggerAction: actionTypes.increment }],
      };
      const wiretappedStore = createWiretappedStore(config);

      wiretappedStore.dispatch(actions.increment());

      expect(config.afterCallback.mock.calls.length).toBe(1);
    });

    test('does not get called if the action is not in the points list', () => {
      const config = {
        afterCallback: jest.fn(),
        points: [{ triggerAction: actionTypes.decrement }],
      };
      const wiretappedStore = createWiretappedStore(config);

      wiretappedStore.dispatch(actions.increment());

      expect(config.afterCallback.mock.calls.length).toBe(0);
    });
  });

  describe('`afterAnyAction` function', () => {
    test('gets called if the action is in the points list', () => {
      const config = {
        afterAnyAction: jest.fn(),
        points: [{ triggerAction: actionTypes.increment }],
      };
      const wiretappedStore = createWiretappedStore(config);

      wiretappedStore.dispatch(actions.increment());

      expect(config.afterAnyAction.mock.calls.length).toBe(1);
    });

    test('gets called if the action is not in the points list', () => {
      const config = {
        afterAnyAction: jest.fn(),
      };
      const wiretappedStore = createWiretappedStore(config);

      wiretappedStore.dispatch(actions.increment());

      expect(config.afterAnyAction.mock.calls.length).toBe(1);
    });
  });

  test('config callbacks are called in the correct order', () => {
    const beforeAnyActionFnName = 'beforeAnyAction';
    const beforeCallbackFnName = 'beforeCallback';
    const callbackFnName = 'callback';
    const afterCallbackFnName = 'afterCallback';
    const afterAnyActionFnName = 'afterAnyAction';

    const correctCallOrder = [
      beforeAnyActionFnName,
      beforeCallbackFnName,
      callbackFnName,
      afterCallbackFnName,
      afterAnyActionFnName,
    ];
    const callOrder = [];

    const config = {
      beforeAnyAction: jest.fn(() => callOrder.push(beforeAnyActionFnName)),
      beforeCallback: jest.fn(() => callOrder.push(beforeCallbackFnName)),
      callback: jest.fn(() => callOrder.push(callbackFnName)),
      afterCallback: jest.fn(() => callOrder.push(afterCallbackFnName)),
      afterAnyAction: jest.fn(() => callOrder.push(afterAnyActionFnName)),
      points: [{ triggerAction: actionTypes.increment }],
      vars: {},
    };

    const wiretappedStore = createWiretappedStore(config);

    wiretappedStore.dispatch(actions.increment());

    expect(callOrder).toEqual(correctCallOrder);
  });
});
