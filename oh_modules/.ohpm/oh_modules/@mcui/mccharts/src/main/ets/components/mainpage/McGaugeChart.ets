import { globalBuilder } from '../../pageView/Tooltip'
import { InterfaceObj, OptionInterface } from '../../utils/chartInterface'
import { Chart, Options } from '../../pageView/Charts'


@Component
export struct McGaugeChart {
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
    if (options.yAxis) {
      options.yAxis = null
    }
    if (options.xAxis) {
      options.xAxis = null
    }

    if (options.legend) {
      options.legend = null
    }
    if (options.series && options.series.length) {
      options.series = options.series.map((item: InterfaceObj): InterfaceObj => {
        item.type = 'gauge'
        return item
      })
    }
    return options
  }

  build() {
    Chart({
      options: $chartOption,
      chartType: 'gauge',
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
