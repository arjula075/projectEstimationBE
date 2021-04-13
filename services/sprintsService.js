const utils = require('../utils/utils.js')

const createSprintMatrix = () => {

  const now = new Date()
  const avgStoriesPerWeek = 15
  const stdStoriesPerWeek = 9
  const numOfWeeksInSprint = 2
  const numOfSprintInYear = 26
  const futuresForecasted = 10
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
