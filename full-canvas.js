'use strict'

const rasterise = require('rasterise-triangle')
const { createCanvas, loadImage } = require('canvas')

class fullCanvas {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.canvas = createCanvas(width, height)
    this.ctx = this.canvas.getContext('2d')
    this.triangles = []
  }

  render() {
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, this.width, this.height)

    const imgData = this.getImageData()

    for (let triangle of this.triangles) {
      rasterise.fillTriangle(triangle, imgData.data, this.width, this.height)
    }

    this.ctx.putImageData(imgData, 0, 0)
  }

  getImageData() {
    return this.ctx.getImageData(0, 0, this.width, this.height)
  }

  async loadImage(imagePath) {
    const image = await loadImage(imagePath)
    this.ctx.drawImage(image, 0, 0, image.width, image.height)
  }

  toDataURL = () => this.canvas.toDataURL()

  initialiseRandomTriangles(numberTriangles) {
    for (let i = 0; i < numberTriangles; i++) {
      this.triangles[i] = {
        points: [this.randomPoint(), this.randomPoint(), this.randomPoint()],
        color: this.randomColour(),
      }
    }
  }

  randomPoint() {
    return { x: Math.random() * this.width, y: Math.random() * this.height }
  }

  randomColour() {
    return [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
      Math.random(),
    ]
  }
}

module.exports = fullCanvas
