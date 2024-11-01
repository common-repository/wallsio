
export function generateId(prefix) {
  return prefix + "-" + generateRandomInt();
}

function generateRandomInt() {
  return Math.floor(Math.random() * getMaxSafeInt());
}

function getMaxSafeInt() {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
  return Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
}
