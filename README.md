# Redux Wiretap

`redux-wiretap` is a Redux [middleware](https://redux.js.org/advanced/middleware) that allows you to spy on actions as they arrive at your store. This allows you to react to your app's state without changing it's logic - e.g. for making requests to a tracking API.


[![npm version](https://img.shields.io/npm/v/@15gifts/redux-wiretap.svg)](https://www.npmjs.com/package/@15gifts/redux-wiretap)
[![npm downloads](https://img.shields.io/npm/dm/redux-wiretap.svg?style=flat-square)](https://www.npmjs.com/package/@15gifts/redux-wiretap)




## Install

```sh
yarn add @15gifts/redux-wiretap
```

or

```sh
npm install --save @15gifts/redux-wiretap
```

## Usage

Import the library into your store file and add it to your middleware array as the last element.

```javascript
import { applyMiddleware, createStore } from 'redux';
import reduxWiretap from '@15gifts/redux-wiretap';
import reducers from './reducers';

const initialState = {};
const wiretapConfig = {};
const wiretap = reduxWiretap(wiretapConfig);

const store = createStore(reducers, initialState, applyMiddleware(wiretap));

```

### Config

The config passed into the `reduxWiretap` function can contain the following properties:

```javascript
{
  // A function that always gets called before an action is executed
  beforeAnyAction: (contextVariables) => {},
  
  // A function that gets called before `callback` if the `point` is valid
  beforeCallback: (data, contextVariables) => {},
  
  // A function that will get called if the `point` is valid
  callback: (data, contextVariables) => {},
  
  // A function that gets called after `callback` if the `point` is valid
  afterCallback: (data, contextVariables) => {},
  
  // A function that always gets called after an action is executed
  afterAnyAction: (contextVariables) => {},

  // Default value for global variables that are passed between callback functions
  vars: {},

  // Array of point config objects that decide if the `callback` function is called
  points: [
    {
      // The action(s) to look for (this can be an array of strings)
      triggerAction: 'ACTION_TYPE',
      logic: (contextVariables) => {
        return {
          // This can be anything - passed as the first argument into the callbacks
          data: {},
          // This boolean controls if the callback is executed (defaults true)
          shouldFire: true,
        };
      },
    },
  ],
}
```

#### `contextVariables`

This object is passed into each point's `logic` function and into all of the callback functions. It has the following properties:

```javascript
{
  action, // The current action
  config, // The config passed into the `reduxWiretap` function at the start
  nextState, // The store as it will be after the action is applied
  prevState, // The store as it was before the action was applied
  getVars(), // Function to get the global variables
  setVars(vars), // Function to set the global variables
}
```

### `getVars` and `setVars`

These functions allow you to read and update the global variables that are passed between callback functions. The initial value is taken from the `config` passed in at the start, or an empty object if the field is omitted.

```javascript
...

const wiretap = reduxWiretap({
  vars: { id: 1 },
  callback: ({ getVars, setVars }) => {
    const vars = getVars();
    const id = vars.id + 1;

    setVars({ ...vars, id });
  },
  points: [{ triggerAction: 'COUNTER_INCREMENT' }],
});

...

// vars = { id: 1 }

store.dispatch({ type: 'COUNTER_INCREMENT' });

// vars = { id: 2 }

```

#### `shouldFire`

This property, returned by the `logic` function of a point config object, determines whether or not the callbacks will be called. Because it has access to `contextVariables`, you can do things such as compare the previous and next states of the redux store and conditionally call the callback functions.

```javascript
{
  points: [
    {
      triggerAction: 'COUNTER_INCREMENT',
      logic: ({ prevState, nextState }) => {
        return {
          callback: () => {
            // Call API to report that an increment greater than 1 has occured
          },
          shouldFire: nextState.counterValue - prevState.counterValue > 1,
        };
      },
    }
  ],
}
```

## Next Steps

The next features we're looking to add are:

- [ ] Fire callbacks on simple value changes (non-objects) as an alternative to actions

## License

MIT
