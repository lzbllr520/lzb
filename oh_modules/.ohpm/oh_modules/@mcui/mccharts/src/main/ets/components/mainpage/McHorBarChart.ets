// import DrawHorBar from '../../utils/drawHorBar'
// import { Chart } from './Chart'
// import { Options } from './Options'
// import { globalBuilder } from './Tooltip'
// import { InterfaceObj, OptionInterface } from '../../utils/chartInterface'
// import { Chart as CommonChart } from '../../utils/charts'
// let drawMcHorBarChart: CommonChart;
// @Component
// export struct McHorBarChart {
//   @Prop @Watch('onCountUpdated') options: Options;
//   @State chartOption: OptionInterface = {};
//   @State renderType: string = 'init'
//   private click: Function = (event: InterfaceObj, params: InterfaceObj) => {}
//   private tooltipClick: Function = (event: InterfaceObj, params: InterfaceObj) => {}
//   @BuilderParam customTooltip: (tooltipInfo: InterfaceObj) => void = globalBuilder; // 自定义组件
//   // @Watch 回调
//   onCountUpdated(): void {
//     this.renderType = 'update'
//     this.chartOption = this.options.options
//   }
//   aboutToAppear() {
//     this.chartOption = this.options.options
//     drawMcHorBarChart = new DrawHorBar()
//   }
//   build() {
//     Chart({
//       options: $chartOption,
//       drawMcChart: drawMcHorBarChart,
//       customTooltip: this.customTooltip,
//       renderType: this.renderType,
//       click: (event: InterfaceObj, params: InterfaceObj) => {
//         this.click(event, params)
//       },
//       tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
//         this.tooltipClick(event, params)
//       }
//     })
//   }
// }


import { globalBuilder } from '../../pageView/Tooltip'
import { InterfaceObj, OptionInterface } from '../../utils/chartInterface'
import { Chart, Options } from '../../pageView/Charts'
import { deepCopy } from '../../utils';


@Component
export struct McHorBarChart {
  @Prop @Watch('onCountUpdated') options: Options;
  @State chartOption: OptionInterface = {};
  @State renderType: string = 'init'
  private callbackSendableClass: InterfaceObj = {};
  private click: Function = (event: InterfaceObj, params: InterfaceObj) => {}
  private tooltipClick: Function = (event: InterfaceObj, params: InterfaceObj) => {}

  @BuilderParam customTooltip: (tooltipInfo: InterfaceObj) => void = globalBuilder; // 自定义组件
  // @Watch 回调
  onCountUpdated(options: Options): void {
    this.renderType = 'update'
    const newOptions = this.initOption(this.options.options)
    this.chartOption = newOptions
  }
  aboutToAppear() {
    const options = this.initOption(this.options.options)
    this.chartOption = options
  }

  initOption(options: InterfaceObj) {
    const xAxis: InterfaceObj = deepCopy(options.xAxis || {})
    const yAxis: InterfaceObj = deepCopy(options.yAxis || {})
    options.xAxis = yAxis
    options.yAxis = xAxis
    options.xAxis.type = 'value'
    options.yAxis.type = 'data'
    if (!options.legend) {
      options.legend = {
        show: true
      }
    }
    if (options.series && options.series.length) {
      options.series = options.series.map((item: InterfaceObj): InterfaceObj => {
        item.type = 'bar'
        return item
      })
    }
    return options
  }

  build() {
    Chart({
      options: $chartOption,
      chartType: 'hor',
      customTooltip: this.customTooltip,
      callbackSendableClass: this.callbackSendableClass,
      renderType: this.renderType,
      click: (event: InterfaceObj, params: InterfaceObj) => {
        this.click(event, params)
      },
      tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
        this.tooltipClick(event, params)
      }
    })
  }
}