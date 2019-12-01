const w = window.innerWidth
const h = window.innerHeight
const scGap = 0.02
const strokeFactor = 0.02
const sizeFactor = 2.9
const foreColor = "green"
const backColor = "#BDBDBD"
const stageHFactor = 0.8

class Stage {
    constructor() {
        this.canvas = document.createElement('canvas')
    }

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h * stageHFactor
        this.canvas.style.position = "absolute"
        this.canvas.style.left = "0px"
        this.canvas.style.top = h - this.canvas.height
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
}

class State {

    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += scGap * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.dir
            cb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}
