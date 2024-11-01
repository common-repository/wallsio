

export function randomInt() {
  const max = Number.MAX_SAFE_INTEGER || Math.pow(2, 52);
  return randomIntWithMaximum(max);
}

function randomIntWithMaximum(max) {
  return Math.floor(Math.random() * max);
}
