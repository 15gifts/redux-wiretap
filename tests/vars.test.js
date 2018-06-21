import VarHandler from '../src/vars';

describe('vars', () => {
  test('sets empty object as default value', () => {
    const varHandler = new VarHandler();

    expect(varHandler.getVars()).toEqual({});
  });

  test('`getVars` returns the current value of vars', () => {
    const testVars = { test: 123 };
    const varHandler = new VarHandler(testVars);

    expect(varHandler.getVars()).toEqual(testVars);
  });

  test('`setVars` with no arguments doesn\'t modify vars', () => {
    const testVars = { test: 123 };
    const varHandler = new VarHandler(testVars);

    expect(varHandler.getVars()).toEqual(testVars);

    varHandler.setVars();

    expect(varHandler.getVars()).toEqual(testVars);
  });

  test('`setVars` with a falsey argument doesn\'t modify vars', () => {
    const testVars = { test: 123 };
    const varHandler = new VarHandler(testVars);

    expect(varHandler.getVars()).toEqual(testVars);

    varHandler.setVars(false);
    expect(varHandler.getVars()).toEqual(testVars);

    varHandler.setVars(undefined);
    expect(varHandler.getVars()).toEqual(testVars);

    varHandler.setVars(0);
    expect(varHandler.getVars()).toEqual(testVars);
  });

  test('`setVars` sets the vars value to the value passed in', () => {
    const testVars = { test: 123 };
    const varHandler = new VarHandler();

    varHandler.setVars(testVars);

    expect(varHandler.getVars()).toEqual(testVars);
  });
});
