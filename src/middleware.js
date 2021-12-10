import { arrayIncludes, isFunction, isString, keyExists } from './utils';
import VarsHandler from './vars';

export function actionMatches(triggerAction, actionType) {
  if (Array.isArray(triggerAction)) {
    return triggerAction.indexOf(actionType) > -1;
  }

  return triggerAction === actionType;
}

export function createConfig(config = {}) {
  return {
    beforeAnyAction: isFunction(config.beforeAnyAction) && config.beforeAnyAction,
    beforeCallback: isFunction(config.beforeCallback) && config.beforeCallback,
    callback: isFunction(config.callback) && config.callback,
    afterCallback: isFunction(config.afterCallback) && config.afterCallback,
    afterAnyAction: isFunction(config.afterAnyAction) && config.afterAnyAction,
    points: Array.isArray(config.points) ? config.points : [],
    vars: config.vars && !isFunction(config.vars) ? config.vars : {},
  };
}

export function createTriggerActionCache(points = []) {
  return points.reduce((uniqueTriggerActions, point) => {
    const { triggerAction } = point;
    let triggerActions = uniqueTriggerActions;

    if (Array.isArray(triggerAction)) {
      const filteredTriggerActions = triggerAction.filter(tA => isString(tA));

      triggerActions = [].concat(uniqueTriggerActions, filteredTriggerActions);
    } else if (isString(triggerAction)) {
      triggerActions.push(triggerAction);
    }

    return Array.from(new Set(triggerActions));
  }, []);
}

export function filterPoints(contextVariables = {}) {
  const { action, config = {} } = contextVariables;
  const { points } = config;

  if (points && Array.isArray(points) && points.length > 0) {
    return points
      .filter(point => actionMatches(point.triggerAction, action.type))
      .map(point => (point.logic ? point.logic(contextVariables) : point))
      .filter(point => !!point)
      .filter(point => (keyExists(point, 'shouldFire') ? !!point.shouldFire : true));
  }

  return [];
}

export function runCallbackFunctions(points, contextVariables) {
  const validPoints = points && Array.isArray(points) && points.length > 0;
  const config = contextVariables && contextVariables.config;

  if (validPoints && config) {
    points.forEach((point) => {
      ['beforeCallback', 'callback', 'afterCallback'].forEach((functionName) => {
        const callbackFunction = config && config[functionName];

        if (callbackFunction) {
          callbackFunction(point.data, contextVariables);
        }
      });
    });
  }
}

export default function middleware(rawConfig) {
  const config = createConfig(rawConfig);
  const { vars, points } = config;
  const triggerActionCache = createTriggerActionCache(points);
  const varsHandler = new VarsHandler(vars);

  return store => next => (action) => {
    const prevState = store.getState();
    const result = next(action);
    const nextState = store.getState();
    const getContextVariables = () => ({
      action,
      config,
      nextState,
      prevState,
      getVars: varsHandler.getVars,
      setVars: varsHandler.setVars,
    });

    if (config.beforeAnyAction) {
      config.beforeAnyAction(getContextVariables());
    }

    if (!arrayIncludes(triggerActionCache, action.type)) {
      if (config.afterAnyAction) {
        config.afterAnyAction(getContextVariables());
      }

      return result;
    }

    const filteredPoints = filterPoints(getContextVariables());

    runCallbackFunctions(filteredPoints, getContextVariables());

    if (config.afterAnyAction) {
      config.afterAnyAction(getContextVariables());
    }

    return result;
  };
}
