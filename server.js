const express = require('express')
const Processor = require('./processor.js')
const PORT = 8080

const app = express()

app.use(express.static('static'))

let pcr

app.get('/api/start', (req, res) => {
  const { width, height } = req.query
  pcr = new Processor(width, height)

  res.send('ok')
})

app.get('/api/render', (req, res) => {
  const pixels = pcr.render()
  res.send(pixels)
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`))
