const getRandomInt =(min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const getOneRandomDist = (avg, std) => {
  return getRandomInt(avg - std, avg + std)
}

const paramsToObject = (entries) => {
  const result = {}
  for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
    result[key] = value;
  }
  return result;
}

module.exports = {
  getRandomInt,
  getOneRandomDist,
  paramsToObject,
}
