import color from '../../util/color'
import bezierCurve from '../../bezierCurve/index'
import { deepClone } from '../plugin/util'

import allGraph from '../config/graphs'

import Graph from './graph.class'

import { emitter } from '@kit.BasicServicesKit';

// import { ErrorEvent, MessageEvents, ThreadWorkerGlobalScope, worker } from '@kit.ArkTS';

import { Animator as animator, AnimatorResult } from '@kit.ArkUI';

let lastTime = null;

export default class CRender {
  chartId: string;
  myWorker: null = null;
  ctx: any
  area: any[]
  animationStatus: boolean
  graphs: Graph[]
  color: {
    darken: (r: any, t?: number) => string;
    fade: (r: any, t?: number) => string;
    getColorFromRgbValue: (r: any) => string;
    getOpacity: (r: any) => number;
    getRgbValue: (r: any) => any;
    getRgbaValue: (r: any) => any;
    isHex: (r: any) => boolean;
    isRgb: (r: any) => boolean;
    isRgbOrRgba: (r: any) => boolean;
    isRgba: (r: any) => boolean;
    lighten: (r: any, t?: number) => string;
    toHex: (r: any) => any;
    toRgb: (r: any, t: any) => string
  }
  bezierCurve: {
    bezierCurveToPolyline: (bezierCurve: any, precision?: number) => any;
    getBezierCurveLength: (bezierCurve: any, precision?: number) => any;
    polylineToBezierCurve: (polyline: any, close?: boolean, offsetA?: number, offsetB?: number) => false | any[][]
  }
  animationTimer: number | null
  animation: boolean
  workerPort: null
  backAnimator: AnimatorResult | undefined

  constructor (canvas, workerPort, info, chartId) {
    if (!canvas) {
      console.error('CRender Missing parameters!')

      return
    }

    // const ctx = canvas.getContext('2d')

    const { width, height } = info || canvas

    const area = [width, height]

    // canvas.setAttribute('width', clientWidth)
    // canvas.setAttribute('height', clientHeight)

    this.chartId = chartId

    this.ctx = canvas
    this.area = area
    this.animationStatus = false
    this.animation = true
    this.animationTimer = null
    this.graphs = []
    this.color = color
    this.bezierCurve = bezierCurve
    this.workerPort = workerPort

    this.backAnimator = animator.create({// 建议使用 this.getUIContext.creatAnimator()接口
      duration: 1000 / 60,
      easing: "linear",
      delay: 0,
      fill: "forwards",
      direction: "normal",
      iterations: 1,
      begin: 0,
      end: 1
    })

  }

  clearArea () {
    const { area } = this

    this.ctx.clearRect(0, 0, ...area)
  }
  add (config) {
    const time = Date.now()
    if (!config || !Object.keys(config).length) {
      console.error('add Missing parameters!')

      return
    }
    const { name } = config

    if (!name) {
      console.error('add Missing parameters!')

      return
    }

    const graphConfig = allGraph.get(name)
    if (!graphConfig) {
      console.warn('No corresponding graph configuration found!')

      return
    }

    const graph = new Graph(graphConfig, config)

    if (!graph.validator(graph)) return

    // graph.render = this

    this.graphs.push(graph)

    this.sortGraphsByIndex()

    // console.log('时间522', time522 - time)
    // this.drawAllGraph()

    return graph
  }

  sortGraphsByIndex () {
    const { graphs } = this

    graphs.sort((a, b) => {
      if (a.index > b.index) return 1
      if (a.index === b.index) return 0
      if (a.index < b.index) return -1
    })
  }

  delGraph (graph) {
    if (!graph || typeof graph.delProcessor !== 'function') return

    graph.delProcessor(this)

    this.graphs = this.graphs.filter(graph => graph)

    this.drawAllGraph()
  }

  delAllGraph () {
    this.graphs.forEach(graph => graph.delProcessor(this))

    this.graphs = this.graphs.filter(graph => graph)

    this.drawAllGraph()
  }

  drawAllGraph (flag = true) {
    const { workerPort, ctx } = this
    this.clearArea()
    this.graphs.filter(graph => graph && graph.visible).forEach(graph => graph.drawProcessor(this, graph))

    if (workerPort) {
      // let image = ctx.transferToImageBitmap()
      // workerPort.postMessage({ myImage: image });
    }
  }

  launchAnimation () {
    const { animationStatus } = this

    if (animationStatus) return

    this.animationStatus = true

    // this.myWorker = new worker.ThreadWorker('../../../workers/Worker.ets');
    // emitter.on('animation-' + this.chartId, () => {
    //   animation.call(this, () => {
    //     // this.animationStatus = false
    //     // resolve()
    //   }, Date.now())
    // })
    // return new Promise<void>(resolve => {
    //
    // })
    lastTime = Date.now()
    animation.call(this, () => {
      // this.animationStatus = false
      // resolve()
    }, lastTime)
    const that = this
    this.backAnimator.onFinish = () => {
      const currTime = Date.now()
      animation.call(that, () => {
        // this.animationStatus = false
        // resolve()
      }, lastTime)
    }
    // this.backAnimator.play()
  }

  clone (graph) {
    // if (!graph) {
    //   graph = {}
    // }
    const style = graph.style.getStyle()

    let clonedGraph = { ...graph, style }

    delete clonedGraph.render

    clonedGraph = deepClone(clonedGraph, true)

    return this.add(clonedGraph)
  }

  checkLinePoint (point, activeIndex, lineIndex?) {
    point.graphs.forEach((item, i) => {
      item.forEach((linePointItem, index) => {
        if (!linePointItem.shape.oldR) {
          linePointItem.shape.oldR = linePointItem.shape.r
        }
        if (linePointItem.oldVisible === undefined) {
          linePointItem.oldVisible = linePointItem.visible
        }
        linePointItem.shape.r = linePointItem.shape.oldR
        linePointItem.visible = linePointItem.oldVisible
        if (lineIndex !== undefined ? lineIndex === i && index === activeIndex : index === activeIndex) {
          if (!linePointItem.visible) {
            linePointItem.visible = true
          }
          linePointItem.shape.r *= 1.5
        }
      })
    })
  }

  stopAnimation () {
    if (this.animationTimer) {
      clearInterval(this.animationTimer)
    }
    this.backAnimator.finish()
    this.animationStatus = false
    lastTime = null
  }
}

function animation (callback, timeStamp) {
  const { graphs, workerPort } = this
  if (!this.animationStatus) {
    // this.backAnimator && this.backAnimator.cancel()
    this.backAnimator.finish()
    lastTime = null
    if (this.myWorker) {
      this.myWorker.terminate()
      this.myWorker = null
    }
    return
  }
  if (!animationAble(graphs)) {
    // workerPort.close()
    // this.backAnimator && this.backAnimator.cancel()
    // this.backAnimator.finish()
    this.backAnimator.finish()
    lastTime = null
    if (this.myWorker) {
      this.myWorker.terminate()
      this.myWorker = null
    }
    this.animationStatus = false
    return
  }

  graphs.forEach(graph => graph.turnNextAnimationFrame(timeStamp))

  this.drawAllGraph()

  this.backAnimator.play()
  // if (this.animation) {
  //   this.animationTimer = requestAnimationFrame(animation.bind(this, callback, timeStamp), this.animation)
  // } else {
  //   animation.call(this, callback, timeStamp)
  // }
  // this.myWorker.postMessageWithSharedSendable({requestAnimationFrame: true, animation: this.animation, chartId: this.chartId});
}

function requestAnimationFrame (callback, animation) {
  const currTime = new Date().getTime();
  const timeToCall = animation ? Math.max(0, 30 - (currTime - lastTime)) : 0;
  const id = setTimeout(
    () => {
      callback(currTime + timeToCall);
    }, 1000 / 30);
  lastTime = currTime + timeToCall;
  return id;
}

function animationAble (graphs) {
  return graphs.find(graph => !graph.animationPause && graph.animationFrameState.length)
}

function mouseDown (e) {
  const { graphs } = this

  const hoverGraph = graphs.find(graph => graph.status === 'hover')

  if (!hoverGraph) return

  hoverGraph.status = 'active'
}


