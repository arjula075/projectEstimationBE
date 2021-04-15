const utils = require('../utils/utils.js')

const createSprintMatrix = (params) => {

  const now = new Date()
  const numOfSprintInYear = parseInt(params.numOfSprintInYear)
  const futuresForecasted = parseInt(params.sprintFuturesForecasted)
  const avgStoriesPerWeek = parseInt(params.avgStoriesPerWeek)
  const stdStoriesPerWeek = parseInt(params.stdStoriesPerWeek)
  let futures = []

  for (let j = 0; j < futuresForecasted; j++) {
    let sprints = []
    for (let i = 0; i < numOfSprintInYear * 2; i++) {
        const storiesInSprint = utils.getOneRandomDist(avgStoriesPerWeek, stdStoriesPerWeek)
        sprints.push(storiesInSprint)
      }
    futures.push(sprints)
    }

    return futures

}

module.exports = {
  createSprintMatrix,
}
