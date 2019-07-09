import { arrayIncludes, isFunction, isString } from '../src/utils';

describe('utils', () => {
  describe('arrayIncludes', () => {
    it('should return `true` if the supplied value is in the supplied array', () => {
      expect(arrayIncludes([1, 2, 3, 2], 2)).toBe(true);
      expect(arrayIncludes(['test a', 'test b', 'test c'], 'test c')).toBe(true);
      expect(arrayIncludes([true, false, false], true)).toBe(true);
      expect(arrayIncludes([true, false, true], false)).toBe(true);
    });

    it('should return `false` if the supplied value is not in the supplied array', () => {
      expect(arrayIncludes([1, 2, 3, 2], 7)).toBe(false);
      expect(arrayIncludes(['test a', 'test b', 'test c'], 'test z')).toBe(false);
      expect(arrayIncludes([true, false, false], 4)).toBe(false);
      expect(arrayIncludes([true, true, true], false)).toBe(false);
    });

    it('should return `false` if the array parameter is not given an array', () => {
      expect(arrayIncludes('test', 'e')).toBe(false);
      expect(arrayIncludes(123, 2)).toBe(false);
      expect(arrayIncludes({}, 'test')).toBe(false);
      expect(arrayIncludes(() => {}, 'test')).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return `true` if the supplied variable is a function', () => {
      expect(isFunction(() => {})).toBe(true);
      // eslint-disable-next-line func-names, prefer-arrow-callback
      expect(isFunction(function () {})).toBe(true);
      expect(isFunction(Array.isArray)).toBe(true);
    });

    it('should return `false` if the supplied variable is not a function', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction('test')).toBe(false);
      expect(isFunction(123)).toBe(false);
    });
  });

  describe('isString', () => {
    test('returns true if the supplied value is a string', () => {
      expect(isString('test')).toBe(true);
    });

    test('returns false if the supplied value is not a string', () => {
      expect(isString(123)).toBe(false);
      expect(isString(() => true)).toBe(false);
    });
  });
});
