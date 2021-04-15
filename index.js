const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const wipService = require('./services/wipService.js')
const utils = require('./utils/utils.js')


app.use(express.json())
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.post('/api/notes', (req, res) => {
  const params =  req.body
  console.log('params', params)
  const resultMatrix = wipService.createResultMatrix(params)
  res.json(resultMatrix)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
