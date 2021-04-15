const utils = require('../utils/utils.js')
const epicService = require('../services/epicsService.js')
const sprintService = require('../services/sprintsService.js')

const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000

const createCumulativePercentageResult = (matrix) => {

  matrix.map(epic => {
    let previousValue = 0
    let sprintNo = 0
    epic.sprints.map(sprint => {
      sprint.cumulativeCount = previousValue + sprint.count
      sprint.cumulativeCount = parseFloat(sprint.cumulativeCount.toFixed(2))
      const color =  'rgba(0,255,0,' + sprint.cumulativeCount.toFixed(2) + ')'
      if (!epic.beginSprint && sprint.cumulativeCount > 0) {
        epic.beginSprint = sprintNo
        epic.beginDate = new Date()
        epic.beginDate.setDate(epic.beginDate.getDate() + (sprintNo * 2 * 7))
      }
      if (!epic.endSprint && sprint.cumulativeCount > 0.85) {
        epic.endSprint = sprintNo
        epic.endDate = new Date()
        epic.endDate.setDate(epic.endDate.getDate() + (sprintNo + 1) * 2 * 7)

        const difference = epic.endDate.getTime() - epic.beginDate.getTime();
        epic.daySpan = Math.ceil(difference / (1000 * 3600 * 24))
      }


      const objColor = new Object()
      objColor.backgroundColor = color
      sprint.color = objColor
      previousValue = sprint.cumulativeCount
      sprintNo++
    })
  })
  return matrix

}

const createPercentageResult = (matrix) => {
  matrix.map(epic => {
    let totalCount = 0
    epic.sprints.map(sprint => {
      totalCount = totalCount + sprint.count
    })
    epic.sprints.map(sprint => {
      sprint.count = (sprint.count / totalCount)
    })
  })
  return matrix
}

const oneEpicSetFuture = (futureSprint, futureEpics, resultMatrix, params) => {

  const parallerEpics = params.parallerEpics
  let sprints = JSON.parse(JSON.stringify(futureSprint))
  let epics = JSON.parse(JSON.stringify(futureEpics))
  let sprint = 0
  let wipEpicNo = 0
  let wipEpics = []

  // popping the epics to wip
  for (let i = 0; i < parallerEpics; i++) {
    wipEpics.push(epics.shift())
  }

  while (sprints.length > 0) {
    // one story done, in sprint
    sprints[0] = sprints[0] - 1
    if (sprints[0] == 0) {
      sprint++
      sprints.shift()
    }

    // epic scope reduction
    const bugLottery = Math.random()
    const bugPercentage = parseInt(params.bugPercentage)

    if (bugLottery < bugPercentage) {
      return resultMatrix
    }

    try {
      wipEpics[wipEpicNo].stories = wipEpics[wipEpicNo].stories - 1

      if (wipEpics[wipEpicNo].stories == 0) {
        resultMatrix = JSON.parse(JSON.stringify(updateResultMatrix(resultMatrix, wipEpics[wipEpicNo].epic, sprint)))
        if (epics.length > 0) {
          const tmpEpic = epics.shift()
          if (tmpEpic) {
            wipEpics[wipEpicNo] = tmpEpic
          }
          else {
            wipEpics.splice(wipEpicNo, 1)
          }

        }
        else {
          wipEpics.splice(wipEpicNo, 1)
        }
      }
    }
    catch (e) {
    }

    if (wipEpicNo < wipEpics.length - 1) {
      wipEpicNo++
    }
    else {
      wipEpicNo = 0
    }

  }
  return resultMatrix

}

const oneSprintFuture = (futureSprint, resultMatrix, epics, a, params) => {
  epics.map(futureEpics => {
    a.countEpics = a.countEpics +1
    resultMatrix = oneEpicSetFuture(futureSprint, futureEpics, resultMatrix, params)
  })
  return resultMatrix

}

const updateResultMatrix = (resultMatrix, epic, sprint) => {

  for (let i = 0; i < resultMatrix.length; i++) {
    if(resultMatrix[i].name == epic) {
      resultMatrix[i].sprints[sprint].count = resultMatrix[i].sprints[sprint].count + 1
    }
  }

  return JSON.parse(JSON.stringify(resultMatrix))

}

const createRealResult = (resultMatrix, epics, sprints, params) => {
  //sprints go 100 futures => 52 sprints
  let a = {countSprints: 0, countEpics: 0}
  sprints.map(futureSprint => {
    a.countSprints = a.countSprints +1
    resultMatrix = oneSprintFuture(futureSprint, resultMatrix, epics, a, params)
  })

  return resultMatrix
}


// create result matrix with each epic and the sprints
// with zero occurences
const createInitialEpic = (sprints) => {

  const resultEpic = {
    name : 'name',
    sprints : []
  }

  for (let i = 0; i < sprints[0].length; i++) {
    const tmp = {count: 0}
    resultEpic.sprints.push(tmp)
  }
  return resultEpic
}

const createResultMatrix = (params) => {

  const epics = epicService.createEpicMatrix(params)
  const sprints = sprintService.createSprintMatrix(params)
  const resultEpic = createInitialEpic(sprints)

  // first we create that result matrix
  const resultMatrix = []
  const pivotEpic = epics[0]

  pivotEpic.map(epic => {
    const tmpEpic = JSON.parse(JSON.stringify(resultEpic));
    tmpEpic.name = epic.epic
    resultMatrix.push(tmpEpic)
  })

  // and here are the actual heavy-lifting
  let tmp = createRealResult(resultMatrix, epics, sprints, params)
  tmp = createPercentageResult(tmp)
  tmp = createCumulativePercentageResult(tmp)
  return tmp
}

module.exports = {
  createResultMatrix,
}
