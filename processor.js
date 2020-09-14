const gameloop = require('node-gameloop')
const fullCanvas = require('./full-canvas')

class Processor {
  constructor(width, height, srcImagePath) {
    this.width = parseInt(width)
    this.height = parseInt(height)
    this.srcImagePath = srcImagePath

    this.runningId = null

    this.siCanvas = null
    this.siCtx = null

    this.bestCanvas = null
    this.candidateCanvas = null
  }

  async start() {
    this.siCanvas = new fullCanvas(this.width, this.height)
    await this.siCanvas.loadImage(this.srcImagePath)

    this.bestCanvas = new fullCanvas(this.width, this.height)
    this.candidateCanvas = new fullCanvas(this.width, this.height)

    this.runningId = gameloop.setGameLoop(() => this.loop.call(this), 100)
  }

  stop() {
    gameloop.clearGameLoop(this.runningId)
    this.runningId = null
  }

  loop() {
    this.candidateCanvas.triangles = [
      {
        points: [
          { x: 0, y: 0 },
          { x: Math.random() * 250, y: 50 },
          { x: 5, y: 50 },
        ],
        color: [255, 0, 0, 1],
      },
      {
        points: [
          { x: 50, y: 200 },
          { x: Math.random() * 250, y: 250 },
          { x: 25, y: 250 },
        ],
        color: [255, 255, 1, 1],
      },
    ]
    this.candidateCanvas.render()
  }

  getSourceImage() {
    return this.siCanvas.toDataURL()
  }

  getCurrentImage() {
    return this.candidateCanvas.toDataURL()
  }
}

module.exports = Processor
