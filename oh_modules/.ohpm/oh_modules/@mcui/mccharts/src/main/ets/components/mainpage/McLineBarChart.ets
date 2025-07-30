import { globalBuilder } from '../../pageView/Tooltip'
import { InterfaceObj, OptionInterface } from '../../utils/chartInterface'
import { Chart, Options } from '../../pageView/Charts'
@Component
export struct McLineBarChart {
  @Prop @Watch('onCountUpdated') options: Options;
  @State chartOption: OptionInterface = {};
  @State renderType: string = 'init'
  private callbackSendableClass: InterfaceObj = {}
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
    if (!options.legend) {
      options.legend = {
        show: true
      }
    }
    return options
  }
  build() {
    Chart({
      options: $chartOption,
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
