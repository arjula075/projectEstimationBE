const utils = require('../utils/utils.js')

const createEpicMatrix = (params) => {

  const numberOfEpics = parseInt(params.numberOfEpics)

  const createEpicArray = (no) => {

    const result = []
    for(let i = 0; i < no; i++) {
      result.push('feature' + i)
    }
    return result

  }

  const epics = createEpicArray(numberOfEpics)

  const avgStoriesPerEpic = 6
  const stdStoriesPerEpic = 5
  const numOfWeeksInSprint = 2
  const numOfSprintInYear = 26
  const futuresForecasted = 10

  let futures = []
  for (let i = 0; i < futuresForecasted; i++) {
    const future1 = []
    for (let j = 0; j < epics.length; j++) {
      const object = new Object()
      object.epic = epics[j]
      object.stories = utils.getOneRandomDist(avgStoriesPerEpic, stdStoriesPerEpic)
      future1.push(object)
    }
    futures.push(future1)
  }
  return futures
}

module.exports = {
  createEpicMatrix,
}
