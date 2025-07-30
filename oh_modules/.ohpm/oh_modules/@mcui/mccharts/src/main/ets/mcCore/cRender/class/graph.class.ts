import Style from './style.class'

import transition from '../../transition/index'

import {
  deepClone,
  getRotatePointPos,
  getScalePointPos,
  getTranslatePointPos,
  checkPointIsInRect
} from '../plugin/util'

/**
 * @description Class Graph
 * @param {Object} graph  Graph default configuration
 * @param {Object} config Graph config
 * @return {Graph} Instance of Graph
 */
export default class Graph {
  [x: string]: any
  style: any
  shape: any
  setGraphCenter: any
  added: any
  beforeDraw: any
  drawed: any
  beforeMove: any
  moved: any
  move: any
  render: any
  animationRoot: any
  animationKeys: any
  animationFrameState: any
  animationFrame: any
  animationCurve: any
  animationDelay: any
  animationPause: any

  constructor (graph, config) {
    config = deepClone(config, true)

    const defaultConfig = {
      /**
       * @description Weather to render graph
       * @type {Boolean}
       * @default visible = true
       */
      visible: true,
      /**
       * @description Whether to enable drag
       * @type {Boolean}
       * @default drag = false
       */
      drag: false,
      /**
       * @description Whether to enable hover
       * @type {Boolean}
       * @default hover = false
       */
      hover: false,
      /**
       * @description Graph rendering index
       *  Give priority to index high graph in rendering
       * @type {Number}
       * @example index = 1
       */
      index: 1,
      /**
       * @description Animation delay time(ms)
       * @type {Number}
       * @default animationDelay = 0
       */
      animationDelay: 0,
      /**
       * @description Number of animation frames
       * @type {Number}
       * @default animationFrame = 30
       */
      animationFrame:  30,
      /**
       * @description Animation dynamic curve (Supported by transition)
       * @type {String}
       * @default animationCurve = 'linear'
       * @link https://github.com/jiaming743/Transition
       */
      animationCurve: 'linear',
      /**
       * @description Weather to pause graph animation
       * @type {Boolean}
       * @default animationPause = false
       */
      animationPause: false,
      /**
       * @description Rectangular hover detection zone
       *  Use this method for hover detection first
       * @type {Null|Array}
       * @default hoverRect = null
       * @example hoverRect = [0, 0, 100, 100] // [Rect start x, y, Rect width, height]
       */
      hoverRect: null,
      /**
       * @description Mouse enter event handler
       * @type {Function|Null}
       * @default mouseEnter = null
       */
      mouseEnter: null,
      /**
       * @description Mouse outer event handler
       * @type {Function|Null}
       * @default mouseOuter = null
       */
      mouseOuter: null,
      /**
       * @description Mouse click event handler
       * @type {Function|Null}
       * @default click = null
       */
      click: null
    }

    const configAbleNot = {
      status: 'static',
      animationRoot: [],
      animationKeys: [],
      animationFrameState: [],
      cache: {}
    }

    if (!config.shape) config.shape = {}
    if (!config.style) config.style = {}

    const shape = Object.assign({}, graph.shape, config.shape)

    Object.assign(defaultConfig, config, configAbleNot)

    Object.assign(this, graph, defaultConfig)

    // this.render = null
    this.shape = shape
    this.style = new Style(config.style)

    this.addedProcessor()
  }

  addedProcessor () {
    if (typeof this.setGraphCenter === 'function') this.setGraphCenter(null, this)

    // The life cycle 'added"
    if (typeof this.added === 'function') this.added(this)
  }

  drawProcessor (render, graph) {
    const { ctx } = render
    graph.style.initStyle(ctx)

    if (typeof this.beforeDraw === 'function') this.beforeDraw(this, render)

    graph.draw(render, graph)

    if (typeof this.drawed === 'function') this.drawed(this, render)

    graph.style.restoreTransform(ctx)

  }

  hoverCheckProcessor (position, graph) {
    const { hoverRect, style, hoverCheck } = graph
    const { graphCenter, rotate, scale, translate } = style

    if (graphCenter) {
      if (rotate) position = getRotatePointPos(-rotate, position, graphCenter)
      if (scale) position = getScalePointPos(scale.map(s => 1 / s), position, graphCenter)
      if (translate) position = getTranslatePointPos(translate.map(v => v * -1), position)
    }
    const [x, y, width, height] = hoverRect || []
    if (hoverRect) return checkPointIsInRect(position, x, y, width, height)

    return hoverCheck(position, this)
  }

  moveProcessor (e) {
    this.move(e, this)

    if (typeof this.beforeMove === 'function') this.beforeMove(e, this)

    if (typeof this.setGraphCenter === 'function') this.setGraphCenter(e, this)

    if (typeof this.moved === 'function') this.moved(e, this)
  }

  attr (attrName, change = undefined) {
    if (!attrName || change === undefined) return false

    const isObject = typeof this[attrName] === 'object'

    if (isObject) change = deepClone(change, true)

    const { render } = this

    if (attrName === 'style') {
      this.style.update(change)
    } else if (isObject) {
      Object.assign(this[attrName], change)
    } else {
      this[attrName] = change
    }

    if (attrName === 'index') render.sortGraphsByIndex()

    // render.drawAllGraph()
  }

  async animation (attrName, change, wait = false, animation = true) {
    if (attrName !== 'shape' && attrName !== 'style') {
      console.error('Only supported shape and style animation!')

      return
    }

    change = deepClone(change, true)

    if (attrName === 'style') this.style.colorProcessor(change)

    const changeRoot = this[attrName]

    const changeKeys = Object.keys(change)

    const beforeState = {}

    changeKeys.forEach(key => (beforeState[key] = changeRoot[key]))

    const { animationFrame, animationCurve, animationDelay } = this

    let animationFrameState = [change]

    if (animation) {
      animationFrameState = transition(animationCurve, beforeState, change, animationFrame, true)
    }

    this.animationRoot.push(changeRoot)
    this.animationKeys.push(changeKeys)
    this.animationFrameState.push(animationFrameState)

    if (wait) return

    if (animationDelay > 0) await delay(animationDelay)

    const { render } = this

    // return new Promise<void>(async resolve => {
    //   await render.launchAnimation()
    //   resolve()
    // })
  }

  turnNextAnimationFrame (timeStamp) {
    const { animationDelay, animationRoot, animationKeys, animationFrameState, animationPause } = this

    if (animationPause) return

    if (Date.now() - timeStamp < animationDelay) return

    animationRoot.forEach((root, i) => {
      animationKeys[i].forEach(key => {
        root[key] = animationFrameState[i][0][key]
      })
    })

    animationFrameState.forEach((stateItem, i) => {
      stateItem.shift()

      const noFrame = stateItem.length === 0

      if (noFrame) animationRoot[i] = null
      if (noFrame) animationKeys[i] = null
    })

    this.animationFrameState = animationFrameState.filter(state => state.length)
    this.animationRoot = animationRoot.filter(root => root)
    this.animationKeys = animationKeys.filter(keys => keys)
  }

  animationEnd () {
    const { animationFrameState, animationKeys, animationRoot, render } = this

    animationRoot.forEach((root, i) => {
      const currentKeys = animationKeys[i]
      const lastState = animationFrameState[i].pop()

      currentKeys.forEach(key => (root[key] = lastState[key]))
    })

    this.animationFrameState = []
    this.animationKeys = []
    this.animationRoot = []

    return render.drawAllGraph()
  }

  pauseAnimation () {
   this.animationPause = true
  }

  playAnimation () {
    this.animationPause = false
    // const { render } = this
    //
    // this.attr('animationPause', false)
    //
    // return new Promise<void>(async resolve => {
    //   await render.launchAnimation()
    //   resolve()
    // })
  }

  delProcessor  (render) {
    const { graphs } = render

    const index = graphs.findIndex(graph => graph === this)

    if (index === -1) return

    if (typeof this.beforeDelete === 'function') this.beforeDelete(this)

    graphs.splice(index, 1, null)

    if (typeof this.deleted === 'function') this.deleted(this)
  }

}

function delay (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}
