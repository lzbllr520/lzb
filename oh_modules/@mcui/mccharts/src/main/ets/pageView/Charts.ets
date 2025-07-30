import  {
  InterfaceObj,
  LegendInterface,
  TooltipInterface,
  SeriesInterface,
  AxisInterface,
  DataZoomInterface,
  RadarInterface,
  OptionInterface,
  AnimationInterface
} from '../utils/chartInterface'

// import { worker } from '@kit.ArkTS';

import {
  xAxisOpt,
  yAxisOpt,
  tooltip,
  legend,
  legendTextStyle,
  dataZoom,
  radar,
  animation
} from '../utils/defaultOption'

import { emitter } from '@kit.BasicServicesKit';

import { deepCopy, assign, getId } from '../utils/index'
import { Tooltip, globalBuilder } from './Tooltip'
import Charts from '../mcCore/index'

export class Options {
  options: OptionInterface = {
    grid: {}
  }
  cPaddingT: number = 30;
  cPaddingB: number = 30;
  cPaddingL: number = 30;
  cPaddingR: number = 20;
  color: Array<string> = ['#296DFF', '#ff5495fd', '#ff1acffd', '#ff72e4fd', '#7B72F7', '#F85758', '#FFBF29', '#D1E9F9', '#F5FAFC', '#5A657A'];
  title: InterfaceObj = {};
  legend: LegendInterface = {};
  dataZoom: DataZoomInterface = {};
  tooltip: TooltipInterface = {};
  radar: RadarInterface = {};
  xAxis: AxisInterface = {};
  yAxis: AxisInterface | AxisInterface[] = {};
  series: Array<SeriesInterface> = [];
  animation: boolean = true

  constructor(options: OptionInterface) {
    this.setVal(options)
  }

  setVal (options: OptionInterface) {
    const oldOptions: OptionInterface = deepCopy(this.options)
    const keys = ['grid', 'cPaddingT', 'cPaddingB', 'cPaddingL', 'cPaddingR', 'color', 'title', 'legend', 'xAxis', 'yAxis', 'tooltip', 'radar', 'dataZoom', 'animation', 'series']
    for (let i = 0; i < keys.length; i++) {
      const item = keys[i]
      if (options[item] === undefined) continue
      switch (item) {
        case 'grid':
          oldOptions.grid = assign(oldOptions.grid, options[item])
          break
        case 'cPaddingT':
          if (oldOptions.grid) {
            oldOptions.grid.top = options[item]
          }
          break
        case 'cPaddingB':
          if (oldOptions.grid) {
            oldOptions.grid.bottom = options[item]
          }
          break
        case 'cPaddingL':
          if (oldOptions.grid) {
            oldOptions.grid.left = options[item]
          }
          break
        case 'cPaddingR':
          if (oldOptions.grid) {
            oldOptions.grid.right = options[item]
          }
          break
        case 'tooltip':
          oldOptions.tooltip = assign(oldOptions.tooltip, options[item])
          break
        case 'title':
          oldOptions.title = assign(oldOptions.title, options[item])
          break
        case 'color':
          oldOptions.color = options[item]
          break
        case 'legend':
          oldOptions.legend = assign(oldOptions.legend, options[item])
          break
        case 'xAxis':
          oldOptions.xAxis = assign(oldOptions.xAxis, options[item])
          break
        case 'yAxis':
          oldOptions.yAxis = assign(oldOptions.yAxis, options[item])
          break
        case 'dataZoom':
          oldOptions.dataZoom = options[item]
          break
        case 'radar':
          oldOptions.radar = assign(oldOptions.radar, options[item])
          break
        case 'animation':
          oldOptions.animation = options[item]
          break
        case 'series':
          const seriesData: SeriesInterface[] | undefined = options[item]
          if (oldOptions.series && seriesData) {
            if (oldOptions.series.length === seriesData.length) {
              oldOptions.series = oldOptions.series.map((item: SeriesInterface, index): SeriesInterface => {
                item = assign(item, seriesData[index])
                return item
              })
            } else {
              oldOptions.series = options[item]
            }
          } else {
            oldOptions.series = options[item]
          }
          break
      }
    }
    this.options = oldOptions
  }
}





@Component
export struct Chart {
  private chartId: string = getId()
  private settings: RenderingContextSettings = new RenderingContextSettings(true)
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings)
  private offContext: OffscreenCanvasRenderingContext2D | null = null
  private drawMcChart: Charts | null = null;
  private callbackSendableClass: InterfaceObj = {};
  private timer: number | null = null;
  private click: Function = () => {};
  private tooltipClick: Function = () => {};
  private chartType: string = 'line'
  private startY: number = 0;
  private velocity: number = 0;
  private acceleration: number = 0.05; // 加速度
  private friction: number = 0.4; // 阻力系数
  @Link @Watch('onCountUpdated') options: OptionInterface;
  @Link renderType: string
  @State isTooltipShow: boolean = false
  @State isZoom: boolean = false
  @State isScale: boolean = false
  @State tooltipInfo: InterfaceObj = {}
  private panOption: PanGestureOptions = new PanGestureOptions({ direction: PanDirection.None, distance: 1 })
  @BuilderParam customTooltip: (tooltipInfo: InterfaceObj) => void = globalBuilder; // 自定义组件
  private myWorker: null = null;
  private isWorker: boolean = false

  onCountUpdated(options: Options): void {
    // this.isTooltipShow = false
    // if (!this.offContext) {
    //   const offCanvas: OffscreenCanvas = new OffscreenCanvas(this.context.width, this.context.height)
    //   this.offContext = offCanvas.getContext("2d", this.settings)
    // }
    this.isTooltipShow = false
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.setDirection()
    this.timer = setTimeout(() => {
      if (this.isWorker) {
        // this.myWorker && this.myWorker.postMessageWithSharedSendable({ update: true, myOptions: JSON.stringify(this.options) });
      } else {
        this.drawMcChart && this.drawMcChart.setOption(this.options)
      }
    }, 300)
  }

  aboutToAppear(): void {
    try {
      if (this.isWorker) {
        // this.myWorker = new worker.ThreadWorker('../workers/Worker.ets', {
        //   name: this.chartId
        // });
        // 收到eventId为"eventId"的事件后执行回调函数
        emitter.on('showInfo-' + this.chartId, (eventData: emitter.EventData) => {
          const param = eventData.data as InterfaceObj
          this.showInfo(param.flag, JSON.parse(param.event), JSON.parse(param.tooltipInfo))
        })
      }
    } catch (e) {
      console.log('版本太低，无法使用多线程')
      this.myWorker = null
      this.isWorker = false
    }
  }

  aboutToDisappear(): void {
    // this.myWorker && this.myWorker.postMessageWithSharedSendable({disappear: true})
    // this.myWorker && this.myWorker.terminate()
  }

  setDirection () {
    if (this.options.dataZoom && this.options.dataZoom.show) {
      this.panOption.setDirection(this.chartType === 'hor' ? PanDirection.Vertical :  PanDirection.Horizontal)
    }
  }

  showInfo (flag: boolean, event: InterfaceObj, tooltipInfo: InterfaceObj = {}) {
    // const {show, type = 'default'} = tooltipInfo || {}
    this.click && this.click(event, flag ? tooltipInfo : {})
    if (!tooltipInfo.show) {
      this.isTooltipShow = false
      return;
    }
    this.isTooltipShow = flag
    // if (tooltipInfo.type !== 'default') {
    //   this.tooltipClick && this.tooltipClick(event, flag ? tooltipInfo : {})
    // }
    // if (!tooltipInfo.show || tooltipInfo.type !== 'default') return;
    if (this.isTooltipShow) {
      this.tooltipInfo = tooltipInfo
      const keys = Object.keys(tooltipInfo)
      keys.forEach(item => {
        this.tooltipInfo[item] = tooltipInfo[item]
      })
    }
  }

  build() {
    Column () {
      Canvas(this.context)
        .width('100%')
        .height('100%')
        .onReady(() => {
          const offCanvas: OffscreenCanvas = new OffscreenCanvas(this.context.width, this.context.height)
          // this.offContext = offCanvas.getContext("2d", this.settings)
          // setOptions.Init(this.options)
          this.setDirection()
          if (this.isWorker && this.myWorker) {
            // this.myWorker.postMessageWithSharedSendable({ myOffCanvas: offCanvas, myOptions: JSON.stringify(this.options), info: {
            //   width: this.context.width,
            //   height: this.context.height
            // }, sendableTestClass: this.callbackSendableClass});
            // this.myWorker.onmessage = (e): void => {
            //   if (e.data.myImage) {
            //     try {
            //       let image: ImageBitmap = e.data.myImage
            //       this.context.clearRect(0, 0, this.context.width, this.context.height)
            //       this.context.transferFromImageBitmap(image)
            //     } catch (e) {
            //       console.log('渲染异常')
            //     }
            //   }
            //   // if (e.data.terminate) {
            //   //   this.myWorker && this.myWorker.terminate()
            //   // }
            // }
          } else {
            this.drawMcChart = new Charts(this.context, undefined, undefined, this.callbackSendableClass, this.chartId)
            setTimeout(() => {
              this.drawMcChart && this.drawMcChart.setOption(this.options)
            }, 10)
          }
        })
        .onClick((event: ClickEvent) => {
          if (this.drawMcChart) {
            this.drawMcChart.ctxClick(event, (flag: boolean, event: ClickEvent, tooltipInfo: InterfaceObj = {}) => {
              this.showInfo(flag, event, tooltipInfo)
            })
          } else {
            // this.myWorker && this.myWorker.postMessageWithSharedSendable({ ctxClick: true, event: {x: event.x, y: event.y}, chartId: this.chartId});
          }
        })
        .gesture(
          PanGesture(this.panOption)
            .onActionStart((event: GestureEvent) => {
              // console.info('Pan start')
              this.isTooltipShow = false
              this.startY = this.chartType === 'hor' ? event.offsetY : event.offsetX;
            })
            .onActionUpdate((event: GestureEvent) => {
              if (event && !this.isScale) {
                // this.drawMcChart &&
                if (this.options.dataZoom && this.options.dataZoom.show) {
                  const currentY = this.chartType === 'hor' ? -event.offsetY : event.offsetX
                  const deltaY = currentY - this.startY;
                  // 计算速度
                  this.velocity += deltaY * this.acceleration;
                  // 应用阻力
                  this.velocity *= this.friction;
                  if (this.isWorker && this.myWorker) {
                    // this.myWorker.postMessageWithSharedSendable({ bindZoom: true, velocity: this.velocity, chartTypeFlag: this.chartType === 'hor'});
                  } else {
                    this.drawMcChart && this.drawMcChart.bindZoom(this.velocity, this.chartType === 'hor')
                  }
                }
              }
            })
            .onActionEnd(() => {
            })
            .tag("mccharts.pan")
        )
        .gesture(
          PinchGesture({ fingers: 2, distance: 1 })
            .onActionStart((event: GestureEvent) => {
              this.isScale = true
              this.isTooltipShow = false
            })
            .onActionUpdate((event: GestureEvent) => {
              if (event) {
                if (this.options.dataZoom && this.options.dataZoom.show) {
                  if (this.drawMcChart) {
                    this.drawMcChart.bindZoomScale(event.scale)
                  } else {
                    // this.myWorker && this.myWorker.postMessageWithSharedSendable({ bindZoomScale: true, scale: event.scale});
                  }
                }
              }
            })
            .onActionEnd((event: GestureEvent) => {
              this.isScale = false
            })
            .tag("mccharts.pan")
        )
      if (this.isTooltipShow) {
        Tooltip({
          tooltipInfo: $tooltipInfo,
          customTooltip: this.customTooltip,
          ctxWidth: this.context.width,
          ctxHeight: this.context.height
        })
      }
    }
    .width('100%')
    .height('100%')
  }
}
