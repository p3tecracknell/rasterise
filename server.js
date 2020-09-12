'use strict'

const express = require('express')
const Processor = require('./processor.js')
const PORT = 8080

const app = express()

app.use(express.static('static'))

let pcr

app.get('/api/start', (req, res) => {
  const { width, height } = req.query
  pcr = new Processor(width, height, 'static/img/mona.jpg')
  pcr.start()

  res.send('ok')
})

app.get('/api/stop', (req, res) => {
  pcr.stop()
  res.send('ok')
})

app.get('/api/render', (req, res) => {
  const pixels = pcr.getCurrentImage()
  res.send(pixels)
})

app.get('/api/source', (req, res) => {
  const pixels = pcr.getSourceImage()
  res.send(pixels)
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`))
