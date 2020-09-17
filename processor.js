const gameloop = require('node-gameloop')
const fullCanvas = require('./full-canvas')
const imghash = require('imghash')
const leven = require('leven')

const NUM_TRIANGLES = 200

class Processor {
  runningId = null

  siCanvas = null
  siCtx = null

  bestCanvas = null
  candidateCanvas = null

  constructor(width, height, srcImagePath) {
    this.width = parseInt(width)
    this.height = parseInt(height)
    this.srcImagePath = srcImagePath
  }

  async start() {
    this.bestScore = Number.MAX_SAFE_INTEGER

    this.siCanvas = new fullCanvas(this.width, this.height)
    await this.siCanvas.loadImage(this.srcImagePath)
    this.siHash = this.calculateHash(this.siCanvas)

    this.bestCanvas = new fullCanvas(this.width, this.height)
    this.candidateCanvas = new fullCanvas(this.width, this.height)

    this.bestCanvas.initialiseRandomTriangles(NUM_TRIANGLES)
    this.bestCanvas.render()
    this.bestHash = this.calculateHash(this.bestCanvas)

    this.candidateCanvas.triangles = [...this.bestCanvas.triangles]

    this.count = 0

    this.runningId = gameloop.setGameLoop(() => this.loop.call(this), 100)
  }

  stop() {
    gameloop.clearGameLoop(this.runningId)
    this.runningId = null
  }

  loop() {
    this.count++
    if (this.count % 100 === 0) console.log(this.count)

    const index = randomNumber(NUM_TRIANGLES)
    const triangleToChange = this.candidateCanvas.triangles[index]
    const strategy = randomNumber(4)
    const jitter = Math.random()

    if (strategy === 0) {
      // Triangle X
      const pointIndex = randomNumber(3)
      const pointToChange = triangleToChange.points[pointIndex]
      const newRange = jitter * this.width
      pointToChange.x = clamp(
        pointToChange.x + randomNumber(newRange) - newRange * 0.5,
        0,
        this.width
      )
    } else if (strategy === 1) {
      // Triangle Y
      const pointIndex = randomNumber(3)
      const pointToChange = triangleToChange.points[pointIndex]
      const newRange = jitter * this.height
      pointToChange.y = clamp(
        pointToChange.y + randomNumber(newRange) - newRange * 0.5,
        0,
        this.height
      )
    } else if (strategy === 2) {
      // Colour RGB
      const colourIndex = randomNumber(3)
      const colourToChange = triangleToChange.color
      const newRange = jitter * 255
      colourToChange[colourIndex] = clamp(
        colourToChange[colourIndex] + randomNumber(newRange) - newRange * 0.5,
        0,
        255
      )
    } else if (strategy === 3) {
      // Alpha
      const colourToChange = triangleToChange.color
      const newRange = jitter
      colourToChange[3] = clamp(
        colourToChange[3] + randomNumber(newRange) - newRange * 0.5,
        0,
        1
      )
    }

    this.candidateCanvas.render()

    const candidateHash = this.calculateHash(this.candidateCanvas)

    const newScore = leven(this.siHash, candidateHash)

    if (newScore < this.bestScore) {
      // Better!
      console.log({ newScore, bestScore: this.bestScore, strategy, jitter })
      this.bestScore = newScore
      this.bestHash = candidateHash
      this.bestCanvas.triangles[index] = {
        ...this.candidateCanvas.triangles[index],
      }
      //this.bestCanvas.render()
    } else {
      this.candidateCanvas.triangles[index] = {
        ...this.bestCanvas.triangles[index],
      }
    }
  }

  calculateHash(canvas) {
    return imghash.hashRaw(
      {
        width: this.width,
        height: this.height,
        data: canvas.getImageData().data,
      },
      100
    )
  }

  getStats() {
    return {
      runningId: this.runningId,
      width: this.width,
      height: this.height,
      srcImagePath: this.srcImagePath,
      count: this.count,
      score: this.bestScore,
    }
  }

  getSourceImage() {
    return this.siCanvas.toDataURL()
  }

  getCurrentImage() {
    return this.bestCanvas.toDataURL()
  }

  getCurrentImageDef() {
    return this.bestCanvas.triangles
  }
}

function randomNumber(max) {
  return Math.floor(Math.random() * max)
}

function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min)
}

module.exports = Processor
