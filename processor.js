const Canvas = require('canvas')
const rasterise = require('rasterise-triangle')

class Processor {
  constructor(width, height) {
    this.width = parseInt(width)
    this.height = parseInt(height)
  }

  render() {
    const canvas = Canvas.createCanvas(this.width, this.height)
    const ctx = canvas.getContext('2d')

    const imgData = ctx.getImageData(0, 0, 500, 500)
    const data = imgData.data

    var triangle = {
      points: [
        { x: 0, y: 0 },
        { x: 250, y: 50 },
        { x: 5, y: 50 },
      ],
      color: [255, 0, 0, 1],
    }

    rasterise.fillTriangle(triangle, data, this.width, this.height)
    ctx.putImageData(imgData, 0, 0)
    return canvas.toDataURL()
  }
}

module.exports = Processor
