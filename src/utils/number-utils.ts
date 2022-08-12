export function isNumberBetweenOrEqual(target: number, start: number, end: number) {
  return target >= start && target <=end
}

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
