import {
  actionMatches,
  createConfig,
  createTriggerActionCache,
  filterPoints,
  runCallbackFunctions,
} from '../src/middleware';

describe('middleware', () => {
  describe('actionMatches', () => {
    const actionType = 'INCREMENT';

    test('returns `true` when the `triggerAction` and `actionType` arguments match', () => {
      expect(actionMatches(actionType, actionType)).toBe(true);
    });

    test('returns `false` when the `triggerAction` and `actionType` arguments do not match', () => {
      expect(actionMatches('TRIGGER_ACTION', actionType)).toBe(false);
    });

    test('returns `true` when one element of the `triggerAction` array and `actionType` arguments match', () => {
      expect(actionMatches(['TRIGGER_ACTION_1', actionType, 'TRIGGER_ACTION_2'], actionType)).toBe(true);
    });

    test('returns `true` when no elements of the `triggerAction` array and `actionType` arguments match', () => {
      expect(actionMatches(['TRIGGER_ACTION_1', 'TRIGGER_ACTION_2'], actionType)).toBe(false);
    });
  });

  describe('createConfig', () => {
    test('returns a default config object if no argument is passed in', () => {
      const defaultConfig = {
        beforeAnyAction: false,
        beforeCallback: false,
        callback: false,
        afterCallback: false,
        afterAnyAction: false,
        points: [],
        vars: {},
      };

      expect(createConfig()).toEqual(defaultConfig);
    });

    describe('beforeAnyAction', () => {
      test('returns `false` if the supplied value is not a function', () => {
        expect(createConfig({ beforeAnyAction: true }).beforeAnyAction).toBe(false);
        expect(createConfig({ beforeAnyAction: false }).beforeAnyAction).toBe(false);
        expect(createConfig({ beforeAnyAction: 123 }).beforeAnyAction).toBe(false);
        expect(createConfig({ beforeAnyAction: 'test' }).beforeAnyAction).toBe(false);
      });

      test('returns the supplied value if it is a function', () => {
        const beforeAnyAction = jest.fn();

        expect(createConfig({ beforeAnyAction }).beforeAnyAction).toBe(beforeAnyAction);
      });
    });

    describe('beforeCallback', () => {
      test('returns `false` if the supplied value is not a function', () => {
        expect(createConfig({ beforeCallback: true }).beforeCallback).toBe(false);
        expect(createConfig({ beforeCallback: false }).beforeCallback).toBe(false);
        expect(createConfig({ beforeCallback: 123 }).beforeCallback).toBe(false);
        expect(createConfig({ beforeCallback: 'test' }).beforeCallback).toBe(false);
      });

      test('returns the supplied value if it is a function', () => {
        const beforeCallback = jest.fn();

        expect(createConfig({ beforeCallback }).beforeCallback).toBe(beforeCallback);
      });
    });

    describe('callback', () => {
      test('returns `false` if the supplied value is not a function', () => {
        expect(createConfig({ callback: true }).callback).toBe(false);
        expect(createConfig({ callback: false }).callback).toBe(false);
        expect(createConfig({ callback: 123 }).callback).toBe(false);
        expect(createConfig({ callback: 'test' }).callback).toBe(false);
      });

      test('returns the supplied value if it is a function', () => {
        const callback = jest.fn();

        expect(createConfig({ callback }).callback).toBe(callback);
      });
    });

    describe('afterCallback', () => {
      test('returns `false` if the supplied value is not a function', () => {
        expect(createConfig({ afterCallback: true }).afterCallback).toBe(false);
        expect(createConfig({ afterCallback: false }).afterCallback).toBe(false);
        expect(createConfig({ afterCallback: 123 }).afterCallback).toBe(false);
        expect(createConfig({ afterCallback: 'test' }).afterCallback).toBe(false);
      });

      test('returns the supplied value if it is a function', () => {
        const afterCallback = jest.fn();

        expect(createConfig({ afterCallback }).afterCallback).toBe(afterCallback);
      });
    });

    describe('afterAnyAction', () => {
      test('returns `false` if the supplied value is not a function', () => {
        expect(createConfig({ afterAnyAction: true }).afterAnyAction).toBe(false);
        expect(createConfig({ afterAnyAction: false }).afterAnyAction).toBe(false);
        expect(createConfig({ afterAnyAction: 123 }).afterAnyAction).toBe(false);
        expect(createConfig({ afterAnyAction: 'test' }).afterAnyAction).toBe(false);
      });

      test('returns the supplied value if it is a function', () => {
        const afterAnyAction = jest.fn();

        expect(createConfig({ afterAnyAction }).afterAnyAction).toBe(afterAnyAction);
      });
    });

    describe('points', () => {
      test('set to an empty array if the value supplied to it is not an array', () => {
        expect(createConfig({ points: true }).points).toEqual([]);
        expect(createConfig({ points: false }).points).toEqual([]);
        expect(createConfig({ points: 123 }).points).toEqual([]);
        expect(createConfig({ points: 'test' }).points).toEqual([]);
        expect(createConfig({ points: () => true }).points).toEqual([]);
      });

      test('set to the passed in value if it is an array', () => {
        const testArray = [
          { triggerAction: 'INCREMENT' },
          { triggerAction: 'DECREMENT' },
        ];

        expect(createConfig({ points: testArray }).points).toBe(testArray);
      });
    });

    describe('vars', () => {
      test('set to an empty object if nothing is passed in', () => {
        expect(createConfig().vars).toEqual({});
      });

      test('set to an empty object if a function is passed in', () => {
        expect(createConfig({ vars: () => true }).vars).toEqual({});
      });

      test('set to whatever non-function value is passed to it', () => {
        const testVarObject = { test: 123 };

        expect(createConfig({ vars: 123 }).vars).toEqual(123);
        expect(createConfig({ vars: 'test' }).vars).toEqual('test');
        expect(createConfig({ vars: testVarObject }).vars).toEqual(testVarObject);
      });
    });
  });

  describe('createTriggerActionCache', () => {
    const runCreateTriggerActionCache = (rawPoints) => {
      const config = createConfig({ points: rawPoints });

      return createTriggerActionCache(config.points);
    };

    const action1 = 'INCREMENT';
    const action2 = 'DECREMENT';
    const action3 = 'RESET';

    test('returns an empty array if no arguments are supplied', () => {
      const triggerActionCache = createTriggerActionCache();

      expect(triggerActionCache).toEqual([]);
    });

    test('returns an empty array if no points are supplied', () => {
      const triggerActionCache = runCreateTriggerActionCache(undefined);

      expect(triggerActionCache).toEqual([]);
    });

    test('returns an array of all the `triggerActions` used in the `points` array when they are strings', () => {
      const rawPoints = [
        { triggerAction: action1 },
        { triggerAction: action2 },
      ];
      const triggerActionCache = runCreateTriggerActionCache(rawPoints);
      const expected = [action1, action2];

      expect(triggerActionCache).toEqual(expected);
    });

    test('returns an array of `triggerActions` with non-string values removed', () => {
      const triggerActionCache1 = runCreateTriggerActionCache([
        { triggerAction: action1 },
        {},
      ]);
      const triggerActionCache2 = runCreateTriggerActionCache([
        { triggerAction: () => true },
        { triggerAction: action2 },
        { triggerAction: false },
      ]);

      expect(triggerActionCache1).toEqual([action1]);
      expect(triggerActionCache2).toEqual([action2]);
    });

    test('returns an array of `triggerActions` when some triggerAction values are arrays', () => {
      const rawPoints = [
        { triggerAction: action1 },
        { triggerAction: [action2, action3] },
      ];
      const triggerActionCache = runCreateTriggerActionCache(rawPoints);
      const expected = [action1, action2, action3];

      expect(triggerActionCache).toEqual(expected);
    });

    test('returns an array of `triggerActions` when some triggerAction values are arrays with non-string values', () => {
      const rawPoints = [
        { triggerAction: action1 },
        { triggerAction: [undefined, action3] },
      ];
      const triggerActionCache = runCreateTriggerActionCache(rawPoints);
      const expected = [action1, action3];

      expect(triggerActionCache).toEqual(expected);
    });

    test('removes duplicate `triggerAction` values before the returning array', () => {
      const rawPoints = [
        { triggerAction: action1 },
        { triggerAction: action3 },
        { triggerAction: action2 },
        { triggerAction: action1 },
        { triggerAction: action2 },
        { triggerAction: [action1, action2, action3] },
      ];
      const triggerActionCache = runCreateTriggerActionCache(rawPoints);
      const expected = [action1, action3, action2];

      expect(triggerActionCache).toEqual(expected);
    });
  });

  describe('filterPoints', () => {
    const action1 = { type: 'INCREMENT' };
    const action2 = { type: 'DECREMENT' };

    test('returns an empty array when no arguments are passed', () => {
      expect(filterPoints()).toEqual([]);
    });

    test('calls the `logic` function of the `point` if the `action.type` matches the `triggerAction` for the point', () => {
      const logicFunction1 = jest.fn();
      const logicFunction2 = jest.fn();

      const config = {
        points: [
          {
            triggerAction: action1.type,
            logic: logicFunction1,
          },
          {
            triggerAction: action2.type,
            logic: logicFunction2,
          },
        ],
      };

      filterPoints({ action: action1, config });

      expect(logicFunction1.mock.calls.length).toBe(1);
      expect(logicFunction2.mock.calls.length).toBe(0);
    });

    test('returns an array of return values from `logic` functions in `point` config objects', () => {
      const returnValues = {
        logic1: { data: { test: 1 } },
        logic2: { data: { test: 2 } },
        logic3: { data: { test: 3 } },
      };

      const logicFunction1Mock = jest.fn().mockReturnValue(returnValues.logic1);
      const logicFunction2Mock = jest.fn().mockReturnValue(returnValues.logic2);
      const logicFunction3Mock = jest.fn().mockReturnValue(returnValues.logic3);

      const config = {
        points: [
          {
            triggerAction: action1.type,
            logic: logicFunction1Mock,
          },
          {
            triggerAction: action1.type,
            logic: logicFunction2Mock,
          },
          {
            triggerAction: action1.type,
            logic: logicFunction3Mock,
          },
        ],
      };

      const filteredPoints = filterPoints({ action: action1, config });

      expect(filteredPoints).toEqual(Object.values(returnValues));
    });

    test('removes points where the `logic` function returns a `shouldFire` key set to false', () => {
      const returnValues = {
        logic1: { data: { test: 1 } },
        logic2: { data: { test: 2 }, shouldFire: false },
      };

      const config = {
        points: [
          {
            triggerAction: action1.type,
            logic: jest.fn().mockReturnValue(returnValues.logic1),
          },
          {
            triggerAction: action1.type,
            logic: jest.fn().mockReturnValue(returnValues.logic2),
          },
        ],
      };

      const filteredPoints = filterPoints({ action: action1, config });

      expect(filteredPoints.length).toBe(1);
      expect(filteredPoints).toEqual(expect.arrayContaining([returnValues.logic1]));
    });
  });

  describe('runCallbackFunctions', () => {
    test('doesn\'t call `callback` if no `points` are supplied', () => {
      const contextVariables = {
        config: {
          callback: jest.fn(),
        },
      };

      runCallbackFunctions(undefined, contextVariables);

      expect(contextVariables.config.callback.mock.calls.length).toBe(0);
    });

    test('no callbacks called if `points` is empty', () => {
      const mockBeforeCallback = jest.fn();
      const mockCallback = jest.fn();
      const mockAfterCallback = jest.fn();

      runCallbackFunctions([], {
        config: {
          beforeCallback: mockBeforeCallback,
          callback: mockCallback,
          afterCallback: mockAfterCallback,
        },
      });

      expect(mockBeforeCallback.mock.calls.length).toBe(0);
      expect(mockCallback.mock.calls.length).toBe(0);
      expect(mockAfterCallback.mock.calls.length).toBe(0);
    });

    test('callbacks called if `points` is not empty, passing in the data returned from `logic` as the first argument', () => {
      const mockBeforeCallback = jest.fn();
      const mockCallback = jest.fn();
      const mockAfterCallback = jest.fn();
      const returnData = { test: 123 };
      const pointOutputs = [
        { data: returnData },
      ];

      runCallbackFunctions(pointOutputs, {
        config: {
          beforeCallback: mockBeforeCallback,
          callback: mockCallback,
          afterCallback: mockAfterCallback,
        },
      });

      expect(mockBeforeCallback.mock.calls.length).toBe(1);
      expect(mockBeforeCallback.mock.calls[0][0]).toEqual(returnData);
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toEqual(returnData);
      expect(mockAfterCallback.mock.calls.length).toBe(1);
      expect(mockAfterCallback.mock.calls[0][0]).toEqual(returnData);
    });
  });
});
