const { createCanvas, loadImage } = require('canvas')
const rasterise = require('rasterise-triangle')
const gameloop = require('node-gameloop')

class Processor {
  constructor(width, height, srcImagePath) {
    this.width = parseInt(width)
    this.height = parseInt(height)
    this.srcImagePath = srcImagePath

    this.runningId = null

    this.siCanvas = null
    this.siCtx = null

    this.bestCanvas = null
    this.bestCtx = null

    this.candidateCanvas = null
    this.candidateCtx = null
  }

  async start() {
    this.siCanvas = createCanvas(this.width, this.height)
    this.siCtx = this.siCanvas.getContext('2d')

    const image = await loadImage(this.srcImagePath)
    console.log(JSON.stringify(image))
    this.siCtx.drawImage(image, 0, 0, image.width, image.height)

    this.bestCanvas = createCanvas(this.width, this.height)
    this.bestCtx = this.bestCanvas.getContext('2d')

    this.candidateCanvas = createCanvas(this.width, this.height)
    this.candidateCtx = this.bestCanvas.getContext('2d')

    this.runningId = gameloop.setGameLoop(() => this.loop.call(this), 100)
  }

  stop() {
    gameloop.clearGameLoop(this.runningId)
    this.runningId = null
  }

  loop() {
    this.candidateCtx.fillStyle = 'white'
    this.candidateCtx.fillRect(0, 0, this.width, this.height)

    const imgData = this.candidateCtx.getImageData(
      0,
      0,
      this.width,
      this.height
    )
    const data = imgData.data

    var triangle = {
      points: [
        { x: 0, y: 0 },
        { x: Math.random() * 250, y: 50 },
        { x: 5, y: 50 },
      ],
      color: [255, 0, 0, 1],
    }

    rasterise.fillTriangle(triangle, data, this.width, this.height)
    this.candidateCtx.putImageData(imgData, 0, 0)
  }

  getSourceImage() {
    return this.siCanvas.toDataURL()
  }

  getCurrentImage() {
    return this.bestCanvas.toDataURL()
  }
}

module.exports = Processor
