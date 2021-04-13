const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const wipService = require('./services/wipService.js')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  console.log('Hello World')
  const resultMatrix = wipService.createResultMatrix()
  res.json(resultMatrix)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
