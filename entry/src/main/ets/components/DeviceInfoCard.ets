import { ConveyorState } from "../model/ConveyorState";
import { DollyState } from "../model/DollyState"
import { RobotArmState } from "../model/RobotArmState";

@Component
export struct DeviceInfoCard {

  @Link conveyorData1:ConveyorState;
  @Link conveyorData2:ConveyorState;
  @Link dollyData:DollyState;
  @Link robot1Data: RobotArmState;
  @Link robot2Data: RobotArmState;
  @Link robot3Data: RobotArmState;

  @Link isLineRunning:boolean

  // 定义设备信息的数据结构
  @Prop title: string = ''
  @Prop icon: Resource = $r('app.media.device') // 默认图标
  @Prop temperature: number = 0
  @Prop humidity: number = 0
  @Prop noise: number = 0
  @Prop vibration: boolean=false
  @Prop status:string='离线中'

  // 预警阈值
  private tempThreshold: number = 60
  private humidityThreshold: number = 80
  private noiseThreshold: number = 70

  private getStatusColor(status:string): Color {
    switch (status) {
      case '空闲中':
        return Color.Green;
      case '运行中':
        return Color.Yellow;
      case '离线中':
        return Color.Gray
      default:
        return Color.Gray;
    }
  }

  @Builder
  private StatusIndicator(status: string) {
    Row() {
      // 状态指示灯
      Circle()
        .width(10)
        .height(10)
        .fill(this.getStatusColor(status)) // 根据状态获取颜色
        .margin({ right: 5 })

      // 状态文本
      Text(status)
        .fontSize(14)
        .fontColor(this.getStatusColor(status))
    }
    .margin({top:8})
  }

  build() {
    Row() {
      // 左侧：图标和设备名称
      Column() {
        Image(this.icon)
          .width(48)
          .height(48)
          .objectFit(ImageFit.Contain)
        Text(this.title)
          .fontColor(Color.White)
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .margin({ top: 8 })

        if (this.title==='传送带 #1'){
          if (this.isLineRunning) {
            this.StatusIndicator(this.status)
          }else {
            this.StatusIndicator(this.conveyorData1.statusText)
          }
        }else if (this.title==='传送带 #2'){
          if (this.isLineRunning) {
            this.StatusIndicator(this.status)
          }else {
            this.StatusIndicator(this.conveyorData2.statusText)
          }
        }else if (this.title==='小车 #1'){
          if (this.isLineRunning) {
            this.StatusIndicator(this.status)
          }else {
            this.StatusIndicator(this.dollyData.statusText)
          }
        }else if(this.title==='机械臂 #1'){
          if (this.isLineRunning) {
            this.StatusIndicator(this.status)
          }else {
            this.StatusIndicator(this.robot1Data.statusText)
          }
        }else if(this.title==='机械臂 #2'){
          if (this.isLineRunning) {
            this.StatusIndicator(this.status)
          }else {
            this.StatusIndicator(this.robot2Data.statusText)
          }
        }else if(this.title==='机械臂 #3'){
          if (this.isLineRunning) {
            this.StatusIndicator(this.status)
          }else {
            this.StatusIndicator(this.robot3Data.statusText)
          }
        }

      }
      .width('30%')
      .alignItems(HorizontalAlign.Center)
      .justifyContent(FlexAlign.Center)

      // 分隔线
      Divider()
        .vertical(true)
        .height('80%')
        .strokeWidth(1)
        .color('#FFFFFF')
        .margin({ left: 5, right: 10 })

      // 右侧：具体的监控数据
      GridRow() {
        // 温度
        GridCol({ span: { xs: 6, sm: 6, md: 6, lg: 6 } }) {
          this.DataText("温度", `${this.temperature}°C`, this.temperature > this.tempThreshold)
        }
        // 湿度
        GridCol({ span: { xs: 6, sm: 6, md: 6, lg: 6 } }) {
          this.DataText("湿度", `${this.humidity}%`, this.humidity > this.humidityThreshold)
        }
        // 噪音
        GridCol({ span: { xs: 6, sm: 6, md: 6, lg: 6 } }) {
          this.DataText("噪音", `${this.noise}dB`, this.noise > this.noiseThreshold)
        }
        // 震动
        GridCol({ span: { xs: 6, sm: 6, md: 6, lg: 6 } }) {
          this.DataText("震动", this.vibration ? '有' : '无', this.vibration)
        }
      }
      .width('70%')
    }
    .padding(15)
    .borderRadius(24)
    .backdropBlur(12)
    .backgroundColor('rgba(10, 10, 15, 0.3)')
    .borderRadius(16)
    //添加清晰的轮廓线
    .border({
      width: 1.5,
      color: 'rgba(255, 255, 255, 0.15)'
    })
    //添加柔和的背景光晕
    .shadow({
      radius: 30,
      color: 'rgba(173, 216, 230, 0.2)',
      offsetX: 0,
      offsetY: 0
    })
  }

  // 自定义数据展示组件，包含预警变色逻辑
  @Builder
  DataText(label: string, value: string, isWarning: boolean) {
    Column() {
      Text(label)
        .fontSize(14)
        .fontColor(Color.White)
      Text(value)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor(isWarning ? Color.Red : Color.White) // 关键：根据是否预警显示不同颜色
        .margin({ top: 4 })
    }
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .padding(5)
  }
}