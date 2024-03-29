const w = window.innerWidth
const h = window.innerHeight
const scGap = 0.02
const strokeFactor = 0.02
const sizeFactor = 18
const foreColor = "green"
const backColor = "#BDBDBD"
const stageHFactor = 0.8
const delay = 15

class Stage {
    constructor() {
        this.canvas = document.createElement('canvas')
        this.ballWalker = new BallWalker()
        this.animator = new Animator()
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
        if (this.ballWalker) {
            this.ballWalker.draw(this.context)
        }
    }

    startMoving(lx, ly) {
        this.ballWalker.startUpdating(lx, ly, () => {
            this.animator.start(() => {
                this.render()
                this.ballWalker.update(() => {
                    this.animator.stop()
                    this.render()
                })
            })
        })
    }

    moveBallLeftBy(lx) {
        this.startMoving(lx, 0)
    }

    moveBallRightBy(lx) {
        this.startMoving(-lx, 0)
    }

    moveBallDownBy(ly) {
        this.startMoving(0, ly)
    }

    moveBallUptBy(ly) {
        this.startMoving(0, -ly)
    }

    static init() {
        const stage = new Stage()
        stage.initCanvas()
        stage.render()
        return stage
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
            this.scale = 0
            this.dir = 0
            this.prevScale = this.scale
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

class Animator {

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class BallWalker {


    constructor() {
        this.state = new State()
        this.lx = 0
        this.ly = 0
        this.x = w / 2
        this.y = h * stageHFactor / 2
    }

    draw(context) {
        context.fillStyle = foreColor
        context.save()
        context.translate(this.x + this.lx * this.state.scale, this.y + this.ly * this.state.scale)
        context.beginPath()
        context.arc(0, 0, Math.min(w, h) / sizeFactor, 0, 2 * Math.PI)
        context.fill()
        context.restore()
    }

    update(cb) {
        this.state.update(() => {
            this.x += this.lx
            this.y += this.ly
            this.lx = 0
            this.ly = 0
            cb()
        })
    }

    startUpdating(lx, ly, cb) {
        this.lx = lx
        this.ly = ly
        this.state.startUpdating(cb)
    }
}

const stage = Stage.init()
