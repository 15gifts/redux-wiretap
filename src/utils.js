export function arrayIncludes(array, toCheck) {
  if (Array.isArray(array)) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] === toCheck) {
        return true;
      }
    }
  }

  return false;
}

export function isFunction(toCheck) {
  return Object.prototype.toString.call(toCheck) === '[object Function]';
}

export function isString(toCheck) {
  return typeof toCheck === 'string';
}
