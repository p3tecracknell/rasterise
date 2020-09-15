const gameloop = require('node-gameloop')
const fullCanvas = require('./full-canvas')

const NUM_TRIANGLES = 50

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

    this.bestCanvas = new fullCanvas(this.width, this.height)
    this.candidateCanvas = new fullCanvas(this.width, this.height)

    this.bestCanvas.initialiseRandomTriangles(NUM_TRIANGLES)
    this.bestCanvas.render()

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
    //this.candidateCanvas.triangles = [...this.bestCanvas.triangles]
    //this.bestCanvas.render()
    const index = randomNumber(NUM_TRIANGLES)
    const triangleToChange = this.candidateCanvas.triangles[index]
    const strategy = randomNumber(4)

    if (strategy === 0) {
      // Triangle X
      const pointIndex = randomNumber(3)
      triangleToChange.points[pointIndex].x = randomNumber(this.width)
    } else if (strategy === 1) {
      // Triangle Y
      const pointIndex = randomNumber(3)
      triangleToChange.points[pointIndex].y = randomNumber(this.height)
    } else if (strategy === 2) {
      // Colour RGB
      const colourIndex = randomNumber(3)
      triangleToChange.color[colourIndex] = randomNumber(255)
    } else if (strategy === 3) {
      triangleToChange.color[3] = Math.random()
    }

    this.candidateCanvas.render()
    const newScore = this.calculateScore()

    if (newScore < this.bestScore) {
      // Better!
      console.log({ newScore })
      console.log(this.bestScore)
      this.bestScore = newScore
      this.bestCanvas.triangles[index] = {
        ...this.candidateCanvas.triangles[index],
      }
      this.bestCanvas.render()
    } else {
      this.candidateCanvas.triangles[index] = {
        ...this.bestCanvas.triangles[index],
      }
    }
  }

  calculateScore() {
    const existingImgData = this.siCanvas.getImageData().data
    const candidateImgData = this.candidateCanvas.getImageData().data

    let squares = 0
    for (let i = 0; i < existingImgData.length; i += 4) {
      squares +=
        (existingImgData[i] - candidateImgData[i]) *
        (existingImgData[i + 1] - candidateImgData[i + 1]) *
        (existingImgData[i + 2] - candidateImgData[i + 2])
    }

    if (squares === 0) {
      console.log('WHAT?!')
    }

    return Math.abs(squares)
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

module.exports = Processor
