'use strict'

const express = require('express')
const Processor = require('./processor.js')
const PORT = process.env.PORT || 8080

const app = express()

app.use(express.static('static'))

let pcr

app.get('/api/start', (req, res) => {
  if (pcr) return res.status(400).send('Already started')

  const { width, height, image } = req.query
  pcr = new Processor(width, height, 'static/img/' + image)
  pcr.start()

  res.send('ok')
})

app.get('/api/stop', (req, res) => {
  if (!pcr) return res.status(401).send('Not running')

  pcr.stop()
  pcr = null
  res.send('ok')
})

app.get('/api/render', (req, res) => {
  if (!pcr) return res.status(400).send('Not running')

  const pixels = pcr.getCurrentImage()
  res.send(pixels)
})

app.get('/api/def', (req, res) => {
  if (!pcr) return res.status(400).send('Not running')

  const score = pcr.getStats()
  //const def = pcr.getCurrentImageDef()
  res.send(JSON.stringify(score, null, 2))
})

app.get('/api/source', (req, res) => {
  if (!pcr) return res.status(400).send('Not running')

  const pixels = pcr.getSourceImage()
  res.send(pixels)
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`))
