import { ConveyorState } from '../model/ConveyorState'
import { DollyState } from '../model/DollyState'
import { RobotArmState } from '../model/RobotArmState'
import {Conveyor1} from './device/Conveyor1'
import {Conveyor2} from './device/Conveyor2'
import {Dolly} from '../view/device/Dolly'
import {RobotArm1} from '../view/device/RobotArm1'
import {RobotArm2} from '../view/device/RobotArm2'
import {RobotArm3} from '../view/device/RobotArm3'

@Component
export struct DeviceManager {

  addLog: (level: 'info' | 'warning' | 'error', message: string,shouldSave:boolean) => void = () => {};

  @Link currentIndex: number;
  @Link conveyorData1:ConveyorState;
  @Link conveyorData2:ConveyorState;
  @Link dollyData:DollyState;
  @Link robot1Data: RobotArmState;
  @Link robot2Data: RobotArmState;
  @Link robot3Data: RobotArmState;

  @Link conveyorAvatar:Resource;
  @Link dollyAvatar:Resource;
  @Link robotArmAvatar:Resource;

  private tabArray: string[] = ['小车','传送带1','传送带2', '机械臂1', '机械臂2','机械臂3']
  private normalFontSize: number = 15
  private selectedFontSize: number = 22
  private normalColor: string = '#E6FFFFFF'
  private selectedColor: string = '#FFFFFF'

  //用于记录当前被按下的Tab索引，-1代表没有Tab被按下
  @State pressedTabIndex: number = -1

  private swiperController: SwiperController = new SwiperController()

  onIndexChange: (index: number) => void = () => {};

  @Builder
  deviceContent(index: number) {
    Column() {
      if (index === 0) {
        Dolly({
          data:this.dollyData,
          addLog: this.addLog,
          avatar:this.dollyAvatar
        })
      }else if (index===1){
        Conveyor1({
          data:this.conveyorData1,
          addLog: this.addLog,
          avatar:this.conveyorAvatar,
          isActive: index === this.currentIndex
        })
      } else if (index === 2) {
        Conveyor2({
          data:this.conveyorData2,
          addLog: this.addLog,
          avatar:this.conveyorAvatar,
          isActive: index === this.currentIndex
        })
      } else if (index === 3) {
        RobotArm1({
          data:this.robot1Data,
          addLog: this.addLog,
          avatar:this.robotArmAvatar
        })
      } else if (index === 4) {
        RobotArm2({
          data:this.robot2Data,
          addLog: this.addLog,
          avatar:this.robotArmAvatar
        })
      }else if(index===5){
        RobotArm3({
          data:this.robot3Data,
          addLog: this.addLog,
          avatar:this.robotArmAvatar
        })
      }
    }
  }


  @Builder
  tabBuilder(title: string, targetIndex: number) {
    Column() {
      Text(title)
        .fontSize(this.currentIndex === targetIndex ? this.selectedFontSize : this.normalFontSize)
        .fontColor(this.currentIndex === targetIndex ? this.selectedColor : this.normalColor)
        .fontWeight(this.currentIndex === targetIndex ? FontWeight.Bold : FontWeight.Normal)
        .animation({ duration: 100, curve: Curve.EaseInOut })
    }
    .justifyContent(FlexAlign.Center)
    .width('auto')
    .height('100%')
    .padding({ left: 16, right: 16 })
    .margin({ left: 15, right: 15 })
    .scale({ x: this.pressedTabIndex === targetIndex ? 0.95 : 1.0, y: this.pressedTabIndex === targetIndex ? 0.95 : 1.0 })
    .opacity(this.pressedTabIndex === targetIndex ? 0.6 : 1.0)
    .animation({ duration: 100, curve: Curve.EaseOut }) // 点击反馈动画，要快
    .onTouch((event: TouchEvent) => {
      // 监听触摸事件
      if (event.type === TouchType.Down) {
        // 手指按下时，记录当前项的索引
        this.pressedTabIndex = targetIndex;
      }
      if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
        // 手指抬起或触摸取消时，重置状态
        this.pressedTabIndex = -1;
      }
    })
  }

  build() {
    Column({ space: 0 }) {
      Row() {
        Tabs({ index: this.currentIndex }) {
          ForEach(this.tabArray, (item: string) => {
            TabContent().tabBar(this.tabBuilder(item, this.tabArray.indexOf(item)))
          }, (item: string) => item)
        }
        .barMode(BarMode.Scrollable)
        .onChange((index: number) => {
          if(index===this.currentIndex+1){
            this.swiperController.showNext()
          }else if(index===this.currentIndex-1){
            this.swiperController.showPrevious()
          }else {
            this.swiperController.changeIndex(index,true)
          }
          this.currentIndex = index;
          this.onIndexChange(index);
        })
        .barHeight(56)
        .width('100%')
      }
      .width('100%')
      .height('8%')
      .backgroundEffect({
        radius: 40,
        saturation: 1.8,
        color: 'rgba(10, 10, 10, 0.25)'
      })
      .border({
        width: { bottom: 1 },
        color: 'rgba(255, 255, 255, 0.2)'
      })

      Swiper(this.swiperController) {
        ForEach(this.tabArray, (item:string,index:number) => {
          Column() {
            this.deviceContent(index)
          }
          .width('100%')
          .height('100%')
          .justifyContent(FlexAlign.Center)
        }, (item:string) => item)
      }
      .index(this.currentIndex)
      .onChange((index: number) => {
        this.currentIndex = index;
        this.onIndexChange(index);
      })
      .loop(false)
      .indicator(false)
      .itemSpace(0)
      .width('100%')
      .layoutWeight(1)
      .animation({ duration: 300, curve: Curve.Ease })
    }
    .width('100%')
    .height('100%')
  }
}