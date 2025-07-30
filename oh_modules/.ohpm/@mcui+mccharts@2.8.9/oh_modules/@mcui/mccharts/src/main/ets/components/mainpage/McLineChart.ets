// import DrawLine from '../../utils/drawLine'
// import { Chart } from './Chart'
// import { Options } from './Options'
// import { globalBuilder } from './Tooltip'
// import { InterfaceObj, OptionInterface } from '../../utils/chartInterface'
// import { Chart as CommonChart } from '../../utils/charts'
// let drawMcLineChart: CommonChart;
// @Component
// export struct McLineChart {
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
//     drawMcLineChart = new DrawLine()
//   }
//   build() {
//     Chart({
//       options: $chartOption,
//       drawMcChart: drawMcLineChart,
//       renderType: this.renderType,
//       customTooltip: this.customTooltip,
//       click: (event: InterfaceObj, params: InterfaceObj) => {
//         this.click(event, params)
//       },
//       tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
//         this.tooltipClick(event, params)
//       }
//     })
//   }
// }
//

import { globalBuilder } from '../../pageView/Tooltip'
import { InterfaceObj, OptionInterface } from '../../utils/chartInterface'
import { Chart, Options } from '../../pageView/Charts'


@Component
export struct McLineChart {
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
    if (!options.yAxis) {
      options.yAxis = {
        type: 'value'
      }
    } else {
      options.yAxis.type = 'value'
    }
    if (!options.legend) {
      options.legend = {
        show: true
      }
    }
    if (options.series && options.series.length) {
      options.series = options.series.map((item: InterfaceObj): InterfaceObj => {
        item.type = 'line'
        return item
      })
    }
    return options
  }

  build() {
    Chart({
      options: $chartOption,
      chartType: 'line',
      customTooltip: this.customTooltip,
      renderType: this.renderType,
      callbackSendableClass: this.callbackSendableClass,
      click: (event: InterfaceObj, params: InterfaceObj) => {
        this.click(event, params)
      },
      tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
        this.tooltipClick(event, params)
      }
    })
  }
}