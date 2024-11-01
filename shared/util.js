
/**
 * Convert to int, return the fallback if it's not convertible
 *
 * @param value
 * @param fallback
 * @return {number}
 */
export function toInt(value, fallback) {
  const result = parseInt(value, 10);
  return isNaN(result) ? fallback : result;
}

/**
 * Return `1` for `true`, `0` for `false`
 *
 * @param value
 * @return {number}
 */
export function boolToInt(value) {
  return value ? 1 : 0;
}

/**
 * Determines whether an input is a *real* object
 *
 * typeof would also return "object" for `null`, regexes, etc. Therefore we need this workaround.
 *
 * Taken from underscore.js
 *
 * @param {*} obj
 *
 * @return {boolean}
 */
export function isObject(obj) {
  return obj === Object(obj);
}
