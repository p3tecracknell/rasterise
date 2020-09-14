const gameloop = require('node-gameloop')
const fullCanvas = require('./full-canvas')

const NUM_TRIANGLES = 1

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
    this.siCanvas = new fullCanvas(this.width, this.height)
    await this.siCanvas.loadImage(this.srcImagePath)

    this.bestCanvas = new fullCanvas(this.width, this.height)
    this.candidateCanvas = new fullCanvas(this.width, this.height)

    this.bestCanvas.initialiseRandomTriangles(NUM_TRIANGLES)
    this.bestCanvas.render()

    this.candidateCanvas.triangles = [...this.bestCanvas.triangles]

    this.runningId = gameloop.setGameLoop(() => this.loop.call(this), 100)
  }

  stop() {
    gameloop.clearGameLoop(this.runningId)
    this.runningId = null
  }

  loop() {
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

    const isBetter = true
    if (isBetter) {
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
