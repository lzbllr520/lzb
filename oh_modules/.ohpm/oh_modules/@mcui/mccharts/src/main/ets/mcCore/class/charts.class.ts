import '../extend/index'

import CRender from '../cRender'


import { deepClone } from '../util/common'

import { findNearestPointIndex, isPointInSector } from '../util'

import { mergeColor, title, grid, axis, radarAxis } from '../core'

import { pie, line, bar, radar, gauge, legend, tooltip, dataZoom } from '../core'

import { OptionInterface, SeriesInterface, InterfaceObj } from '../../utils/chartInterface'

export default class Charts {
  sendableTestClass: null
  option: OptionInterface
  render: InterfaceObj
  container: InterfaceObj
  canvas: InterfaceObj
  axisData: InterfaceObj
  tooltip: InterfaceObj
  radar: InterfaceObj
  radarPoint: InterfaceObj
  pie: InterfaceObj
  linePoint: InterfaceObj
  grid: InterfaceObj
  dataZoom: {
    show: boolean;
    start: number;
    end: number;
    num: number
  }
  scrollPosition: number = 0
  // stepNum: number = 0
  zoomAccumulator: number = 0 // 缩放累积量
  zoomStep: number = 0.06 // 每次滚动累积的步数，根据需要调整
  oldAnimation: boolean = true
  constructor(dom, workerPort?, info?, sendableTestClass?, chartId?) {
    if (!dom) {
      console.error('Charts Missing parameters!')
    } else {
      const attribute = {
        container: '',
        canvas: dom,
        render: new CRender(dom, workerPort, info, chartId),
        option: null
      }

      Object.assign(this, attribute)
    }
    this.sendableTestClass = sendableTestClass
    // const { clientWidth, clientHeight } = dom

    // const canvas = document.createElement('canvas')
    //
    // canvas.setAttribute('width', clientWidth)
    // canvas.setAttribute('height', clientHeight)

    // dom.appendChild(canvas)


  }

  async setOption(option, oldAnimation?) {
    if (!option || typeof option !== 'object') {
      console.error('setOption Missing parameters!')

      return false
    }

    // if (animationEnd) {
    //   this.render.graphs.forEach(graph => graph.pauseAnimation())
    // }

    this.render.animationStatus = false

    if (this.render.animationTimer) {
      clearTimeout(this.render.animationTimer)
    }

    // if (this.render.backAnimator) {
    //   this.render.backAnimator.cancel()
    // }
    const optionCloned = deepClone(option, true)

    if (!optionCloned.series) {
      optionCloned.series = []
    }

    this.render.animation = optionCloned.animation !== undefined ? optionCloned.animation : true

    // 找出相关的类型图表
    const types: string[] = []
    optionCloned.series.forEach((item: SeriesInterface) => {
      if (item.type && !types.includes(item.type)) {
        types.push(item.type)
      }
    })
    const time = Date.now()
    mergeColor(this, optionCloned)
    const time1 = Date.now()
    console.log('时间1', time1-time)
    grid(this, optionCloned)
    const time2 = Date.now()
    console.log('时间2', time2-time1)
    if (optionCloned.title) {
      title(this, optionCloned)
    }
    const time3 = Date.now()
    console.log('时间3', time3-time2)
    if (optionCloned.dataZoom) {
      dataZoom(this, optionCloned)
    }
    const time4 = Date.now()
    console.log('时间4', time4-time3)
    if (optionCloned.legend) {
      legend(this, optionCloned)
    }
    const time5 = Date.now()
    console.log('时间5', time5)
    if (types.includes('line') || types.includes('bar')) {
      axis(this, optionCloned)
    }
    const time6 = Date.now()
    console.log('时间6', time6-time5)
    if (types.includes('radar')) {
      radarAxis(this, optionCloned)
      radar(this, optionCloned)
    }
    const time7 = Date.now()
    console.log('时间7', time7-time6)
    if (types.includes('bar')) {
      bar(this, optionCloned)
    }
    const time8 = Date.now()
    console.log('时间8', time8-time7)
    if (types.includes('line')) {
      line(this, optionCloned)
    }
    const time9 = Date.now()
    console.log('时间9', time9-time8)
    if (types.includes('pie')) {
      pie(this, optionCloned)
    }
    const time10 = Date.now()
    console.log('时间10', time10-time9)
    if (types.includes('gauge')) {
      gauge(this, optionCloned)
    }
    tooltip(this, optionCloned)
    const time11 = Date.now()
    console.log('时间11', time11-time10)
    this.option = optionCloned

    this.render.launchAnimation()
    const time12 = Date.now()
    console.log('时间112', time12-time11)
    if (oldAnimation !== undefined) {
      this.render.animation = oldAnimation
    }
    // console.warn(this)
  }

  resize() {
    const { container, canvas, render, option } = this

    // const { clientWidth, clientHeight } = container
    //
    // canvas.setAttribute('width', clientWidth)
    // canvas.setAttribute('height', clientHeight)

    // render.area = [clientWidth, clientHeight]

    this.setOption(option)
  }

  animationTimer () {
    this.render.animationStatus = false

    if (this.render.animationTimer) {
      clearTimeout(this.render.animationTimer)
    }
  }

  ctxClick(event, tipCallback) {
    const { x, y } = event
    const { axisData, option, linePoint, tooltip, grid } = this
    // 找出相关的类型图表
    const types: string[] = []
    option.series.forEach((item: SeriesInterface) => {
      if (item.type && !types.includes(item.type)) {
        types.push(item.type)
      }
    })

    this.closeTip(tipCallback, types)

    if (!tooltip.series.show) return

    const isLegend = this.ctxClickLegend(event, types)

    if (isLegend) return;
    if (this.render.animationStatus) {
      return;
    }
    // 判断点击的是否在内部
    try {
      const {x: gridX, y: gridY, w, h} = grid.graphs[0][0].shape
      if (x < gridX - 10 || y < gridY) return;
      if (x > gridX + w + 10 || y > gridY + h) return;
    } catch (e) {
      console.log('点击图表的时候边界处理异常')
    }

    if (types.includes('line') || types.includes('bar')) {
      this.tipLineAndBar(event, types, axisData, x, y, linePoint, tooltip, tipCallback)
    } else if (types.includes('radar')) {
      const { radar, radarPoint } = this
      this.tipRadarAndBar(event, option, radar, x, y, radarPoint, tooltip, tipCallback)
    } else if (types.includes('pie')) {
      const { pie } = this
      this.tipPie(event, option, pie, x, y, tooltip, tipCallback)
    }
  }

  // 点击图例
  ctxClickLegend (event, types) {
    const { x, y } = event
    const position = [x, y]
    const hoverAbleGraphs = this.render.graphs.filter(graph =>
    (graph.hover && (typeof graph.hoverCheck === 'function' || graph.hoverRect)))

    const hoveredGraph = hoverAbleGraphs.find(graph => graph.hoverCheckProcessor(position, graph))

    if (hoveredGraph && typeof hoveredGraph.click === 'function') {
      // // 先判断一下点击的是图例还是
      // if (hoveredGraph && !hoverGraph) {
      //   hoveredGraph.status = 'hover'
      //   hoveredGraph.status = 'active'
      // } else if (hoveredGraph && hoverGraph && hoveredGraph !== hoverGraph) {
      //   hoverGraph.status = 'static'
      //   hoveredGraph.status = 'hover'
      //   hoveredGraph.status = 'active'
      // }
      //
      // const activeGraph = this.render.graphs.find(graph => graph.status === 'active')
      // const dragGraph = this.render.graphs.find(graph => graph.status === 'drag')
      this.render.animationStatus = false

      if (this.render.animationTimer) {
        clearTimeout(this.render.animationTimer)
      }
      if (types.includes('pie')) {
        const { pie } = this
        for (let index = 0, l = pie.graphs.length; index < l; index++) {
          const item = pie.graphs[index];
          for (let i = 0; i < item.length; i++) {
            item[i].shape.scaleSize = 0
            item[i].style.shadowBlur = 0
          }
        }
      }
      hoveredGraph.click(event, hoveredGraph)

      // this.render.graphs.forEach(graph => graph && (graph.status = 'static'))
      //
      // if (activeGraph) activeGraph.status = 'hover'
      return true
    }
    return false
  }

  // 折线图跟柱状图的点击提示层逻辑
  tipLineAndBar (event, types, axisData, x, y, linePoint, tooltip, tipCallback) {
    // 获取x轴的长度
    let { linePosition, data, tickGap, boundaryGap, axis, label } = axisData.find(item => item.type === 'data')
    const { linePosition: yLinePosition} = axisData.find(item => item.type === 'value')

    tickGap = Math.abs(tickGap)

    // 遍历获取对应的位置
    let activeIndex = null
    let activeOption = {
      downX: x,
      downY: y,
      x: x,
      y: y,
      gapStartX: 0,
      gapEndX: 0
    }

    const [[start, startY], [endX, end]] = linePosition
    const startX = axis === 'x' ? start : end
    for (let i = 0; i < data.length; i++) {
      const gap = boundaryGap === false ? (i) * tickGap + startX : (i * tickGap + startX)
      const gapNext = boundaryGap === false ? (i + 1) * tickGap + startX : ((i + 1) * tickGap + startX)
      const flag = axis === 'x' ? x > gap && x < gapNext : y > gap && y < gapNext
      if (flag && i < label.length) {
        activeIndex = i
        const pos = boundaryGap === false ? i * tickGap : ((i + 1) * tickGap / 2 + startX)
        if ( axis === 'x') {
          activeOption.x = pos
        } else {
          activeOption.y = pos
        }
        activeOption.gapStartX = gap
        activeOption.gapEndX = gapNext
        //activeOption.y = pointItem[1]
      }
    }
    // 设置选中的样式
    if (types.includes('line')) { // 如果是线条，则高亮拐点
      this.render.checkLinePoint(linePoint, activeIndex)
    }
    const params = {
      index: activeIndex,
      title: '',
      ...activeOption,
      ...tooltip.series,
      data: []
    }

    if (activeIndex !== null) {
      if (axis === 'y') {
        const length = this.dataZoom && this.dataZoom.show ? this.dataZoom.num : data.length
        activeIndex = length - activeIndex - 1
      }
      if (this.dataZoom && this.dataZoom.show) {
        activeIndex += this.dataZoom.start
      }
      const axisItem = this.axisData.find((item) => item.type === 'data')
      params.title = axisItem.data && axisItem.data.length ? axisItem.data[activeIndex] || '' : ''
      this.option.series.forEach((item: SeriesInterface) => {
        const show = item.show !== undefined ? item.show : true
        if (item.data && item.data[activeIndex] !== undefined && show) {
          const dataItem = item.data[activeIndex]
          if (typeof dataItem !== 'object') {
            params.data.push({
              name: item.name,
              value: dataItem,
              num: dataItem
            })
          } else if (typeof dataItem === 'object') {
            params.data.push({
              name: item.name,
              ...dataItem,
              num: dataItem.value
            })
          }
        }
      })
      // 添加提示线条，或者背景
      const {
        axisPointer: {
          type
        }
      } = tooltip.series
      const [[startX, startY], [endX, endY]] = yLinePosition
      if (type === 'line') {
        const x  = (activeOption.gapStartX + activeOption.gapEndX) / 2
        if (axis === 'x') {
          if (boundaryGap === false) {
            tooltip.series.linePosition = [[activeOption.gapStartX, startY], [activeOption.gapStartX, endY]]
          } else {
            tooltip.series.linePosition = [[activeOption.gapStartX + (0.5 * tickGap), startY], [activeOption.gapStartX + (0.5 * tickGap), endY]]
          }
        } else {
          tooltip.series.linePosition = [[startX, x], [endX, x]]
        }
      } if (type === 'shadow') {
        if (axis === 'x') {
          tooltip.series.linePosition = [[activeOption.gapStartX, startY], [activeOption.gapEndX, endY]]
        } else {
          tooltip.series.linePosition = [[startX, activeOption.gapStartX + 1], [endX, activeOption.gapEndX + 1]]
        }
      }
      tooltip.series.visible = true
    } else {
      tooltip.series.visible = false
    }
    tooltip.updateKey([tooltip.series], ['shape', 'visible'])
    tipCallback(activeIndex !== null, event, params)
    this.render.drawAllGraph()
  }

  // 雷达图的提示层
  tipRadarAndBar (event, option, radar, x, y, radarPoint, tooltip, tipCallback) {
    let radarItemIndex = null
    let radarIndex = null
    let activeOption = {
      downX: x,
      downY: y,
      x: 0,
      y: 0
    }
    radar.graphs.forEach((item, index) => {
      const { shape: { points }, visible } = item[0]
      const itemIndex = findNearestPointIndex(points, x, y)
      if (itemIndex !== -1 && visible) {
        radarIndex = index
        radarItemIndex = itemIndex
        activeOption.x = points[itemIndex][0]
        activeOption.y = points[itemIndex][1]
      }
    })

    const params = {
      radarIndex: radarIndex,
      index: radarItemIndex,
      title: '',
      ...activeOption,
      ...tooltip.series,
      data: []
    }
    if (radarIndex !== null) {
      const dataItem = option.series[radarIndex].data[radarItemIndex]
      const title = option.series[radarIndex].name
      const name = option.radar?.indicator[radarItemIndex].name
      params.title = title
      if (typeof dataItem !== 'object') {
        params.data.push({
          name: name,
          value: dataItem,
          num: dataItem
        })
      } else if (typeof dataItem === 'object') {
        params.data.push({
          name: name || '',
          ...dataItem,
          num: dataItem.value
        })
      }
    }
    this.render.checkLinePoint(radarPoint, radarItemIndex, radarIndex)
    tipCallback(radarIndex !== null, event, params)
    this.render.drawAllGraph()
  }

  // 饼图的提示层
  tipPie (event, option, pie, x, y, tooltip, tipCallback) {
    const pieSeries = []
    option.series.forEach((item: SeriesInterface) => {
      if (item.type == 'pie') {
        pieSeries.push(item)
      }
    })
    let activeOption = {
      downX: x,
      downY: y,
      x: x,
      y: y
    }
    let activeItemIndex = null
    let activeIndex = null
    for (let index = 0, l = pie.graphs.length; index < l; index++) {
      const item = pie.graphs[index];
      for (let i = 0; i < item.length; i++) {
        const { shape: {rx, ry, ir, or, startAngle, endAngle}, visible } = item[i]
        item[i].shape.scaleSize = 0
        item[i].style.shadowBlur = 0
        if (!visible) continue;
        if (ir) {
          // 判断是否点击在环形的内部
          const flag = isPointInSector(x, y, rx, ry, ir, startAngle, endAngle)
          if (flag) {
            continue;
          }
        }
        const flag = isPointInSector(x, y, rx, ry, or, startAngle, endAngle)
        if (flag) {
          activeItemIndex = i
          activeIndex = index
          item[i].style.shadowBlur = 15
          item[i].shape.scaleSize = 4
        }
      }
    }
    const params = {
      index: activeIndex,
      title: '',
      ...activeOption,
      ...tooltip.series,
      data: []
    }
    if (activeIndex !== null) {
      const seriesItem = option.series[activeIndex]
      const series = seriesItem.data.filter(item => item.show !== undefined ? item.show : true)
      const dataItem: InterfaceObj = series[activeItemIndex] as InterfaceObj
      params.title = seriesItem.name
      params.data.push({
        ...dataItem,
        num: dataItem.value
      })
    }
    tipCallback(activeIndex !== null, event, params)
    this.render.drawAllGraph()
  }

  // 滑动数据
  bindZoom (offset, typeFlag) {
    const { axisData, tooltip} = this
    if (!axisData || !axisData.length || !this.dataZoom) return
    const { linePosition, data, tickGap, boundaryGap } = axisData.find(item => item.type === 'data')
    const { xl, xStart, xEnd, num, zoomShow } = this.getXdataLength(data)
    if (!zoomShow || xEnd - xStart >= xl) return;
    const viewWidth = linePosition[1][0] - linePosition[0][0]
    const viewHeight = linePosition[1][1] - linePosition[0][1]
    const contentHeight = Math.abs(tickGap) * data.length
    const viewLength = Math.abs(!typeFlag ? viewWidth : viewHeight)
    this.scrollPosition = this.scrollPosition + (-offset)
    if (this.scrollPosition < 0) {
      this.scrollPosition = 0;
    } else if (this.scrollPosition > contentHeight - viewLength) {
      this.scrollPosition = contentHeight - viewLength;
    }
    // let y = (scrollPosition / (contentHeight - viewLength)) * (viewLength - (viewLength / contentHeight) * viewLength);
    // const num = xEnd - xStart
    let start = Math.ceil(Math.abs( this.scrollPosition / tickGap))
    if (start === xStart) {
      return;
    }
    const newEnd = Math.min(start + num - 1, xl)
    const newStart = newEnd === xl ? newEnd - num + 1 : start
    this.updateZoom(newStart, newEnd, this)
  }

  getXdataLength (data) {
    let xl = data.length - 1
    let xStart = 0
    let xEnd = xl
    if (!this.dataZoom) return
    let { show: zoomShow = false, start: zoomStart = 0, end: zoomEnd = 6, num } = this.dataZoom
    if (zoomShow) {
      if (zoomStart > zoomEnd) {
        [zoomStart, zoomEnd] = [zoomEnd, zoomStart]
      }
      xStart = Math.min(zoomStart, xl)
      xEnd = Math.min(zoomEnd, xl)
    }
    return {
      xl,
      xStart,
      xEnd,
      num,
      zoomShow
    }
  }

  // 缩放数据
  bindZoomScale (scale) {
    // let ctx = this.ctx
    const { axisData, tooltip } = this
    if (!axisData || !axisData.length || !this.dataZoom) return
    const { linePosition, data, tickGap, boundaryGap } = axisData.find(item => item.type === 'data')
    let { xl, xStart, xEnd, zoomShow } = this.getXdataLength(data)
    if (!zoomShow) return;
    const delta = scale > 1 ? 1 : -1;
    if ((xEnd - xStart <= 1 && delta > 0) || (xStart === 0 && xEnd === xl && delta < 0)) return
    // 根据滚动方向累加或递减zoomAccumulator
    this.zoomAccumulator += delta * this.zoomStep;
    let newXStart = xStart
    let newXEnd = xEnd
    // 当累积到一定程度时，应用变化并重置accumulator
    if (Math.abs(this.zoomAccumulator) >= 1) {
      newXStart += Math.round(this.zoomAccumulator);
      newXEnd -= Math.round(this.zoomAccumulator);

      // 确保xStart和xEnd在有效范围内
      newXStart = Math.max(0, newXStart);
      newXEnd = Math.min(xl, newXEnd);

      // 确保xStart始终小于xEnd
      if (newXStart >= newXEnd) {
        newXStart = Math.max(0, xEnd - 1);
        newXEnd = Math.min(xl, newXStart + 1);
      }
      if (newXStart === xStart && newXEnd === xEnd) return;
      if (newXEnd === xl && newXEnd - newXStart < 2) {
        newXStart -= 1
      } else if (newXEnd - newXStart < 2) {
        newXEnd += 1
      }
      this.dataZoom.num = newXEnd - newXStart + 1
      this.updateZoom(newXStart, newXEnd, this)
      this.zoomAccumulator = 0; // 重置累积量
    }
  }

  updateZoom (newStart, newEnd, charts) {
    charts.oldAnimation = charts.render.animation
    charts.render.animation = false
    charts.dataZoom.start = newStart
    charts.option.dataZoom.start = newStart
    charts.dataZoom.end = newEnd
    charts.option.dataZoom.end = newEnd
    charts.closeTip()
    mergeColor(charts, charts.option)
    axis(charts, charts.option)
    line(charts, charts.option)
    bar(charts, charts.option)
    this.render.stopAnimation()
    charts.render.launchAnimation()
    charts.render.animation = charts.oldAnimation
  }

  closeTip (tipCallback?, types: string[] = []) {
    const { tooltip, linePoint } = this
    if (types.includes('line')) { // 如果是线条，则高亮拐点
      this.render.checkLinePoint(linePoint, null)
    }
    tooltip.series.linePosition = [[0, 0], [0, 0]]
    tooltip.series.visible = false
    tooltip.updateKey([tooltip.series], ['shape', 'visible'])
    tipCallback && tipCallback(false, {}, {})
    tipCallback && this.render.drawAllGraph()
  }
}
