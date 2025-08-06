import {ServerInfoView} from '../components/ServerInfoView'
import { Server } from '../model/ServerState'
import { ConveyorState } from '../model/ConveyorState'
import { DollyState } from '../model/DollyState'
import { RobotArmState } from '../model/RobotArmState'
import { promptAction } from '@kit.ArkUI'

@Component
export struct MasterStation {
  @State currentIndex: number=0
  @Prop servers: Server[] = []

  private controller: TabsController = new TabsController();

  @Link isLineRunning: boolean

  addLog: (level: 'info' | 'warning' | 'error', message: string,shouldSave:boolean) => void = () => {};

  @Link conveyorData1:ConveyorState;
  @Link conveyorData2:ConveyorState;
  @Link dollyData:DollyState;
  @Link robot1Data: RobotArmState;
  @Link robot2Data: RobotArmState;
  @Link robot3Data: RobotArmState;

  //停止产线函数
  private stopLine() {
    AlertDialog.show({
      title: '操作确认',
      message: '是否停止产线运作',
      autoCancel: true,
      alignment: DialogAlignment.Center,
      buttons: [
        {
          value: '取消',
          action: () => {
            //用户点击取消，不做任何操作
          }
        },
        {
          value: '确认',
          fontColor: Color.Red,
          action: () => {
            promptAction.showToast({message:'关闭成功',bottom:'50%'})
            this.isLineRunning = false;
            this.addLog('warning','停止产线运行',true)
          }
        }
      ]
    })
  }

  //启动产线函数
  private startLine() {
    AlertDialog.show({
      title: '操作确认',
      message: '是否开启产线运作',
      autoCancel: true,
      alignment: DialogAlignment.Center,
      buttons: [
        {
          value: '取消',
          action: () => {
            //用户点击取消，不做任何操作
          }
        },
        {
          value: '确认',
          fontColor: Color.Red,
          action: () => {
            promptAction.showToast({message:'启动成功!',bottom:'50%'})
            this.isLineRunning = true;
            this.addLog('info','启动产线运行',true)
          }
        }
      ]
    });
  }

  build() {
    Column() {
      Row() {
        Button('启动产线运作')
          .onClick(() => this.startLine())
          .backgroundColor(this.isLineRunning ? Color.Gray : '#28a745')
          .enabled(!this.isLineRunning)

        Button('停止产线运作')
          .onClick(() => this.stopLine())
          .backgroundColor(this.isLineRunning ? '#dc3545' : Color.Gray)
          .enabled(this.isLineRunning)
      }
      .margin({top:20})
      .width('100%')
      .justifyContent(FlexAlign.SpaceEvenly)

      if (this.isLineRunning){
        if (!this.servers || this.servers.length === 0) {
          Column() {
            Text('暂无服务器')
              .fontColor(Color.White)
              .fontWeight(FontWeight.Bolder)
              .fontSize(30)
              .opacity(0.8)
          }
          .width('100%')
          .height('100%')
          .justifyContent(FlexAlign.Center)
        } else {
          Row() {
            Tabs({
              controller: this.controller,
              barPosition: BarPosition.Start,
              index: this.currentIndex
            }) {
              ForEach(
                this.servers,
                (server: Server, index: number) => {
                  TabContent() {
                    Column() {
                      ServerInfoView({ server: server })
                    }
                    .width('100%')
                    .height('100%')
                  }
                  .tabBar(this.buildTabBar($r('app.media.server'), index))
                },
                (server: Server) => server.id
              )
            }
            .margin({left:10})
            .vertical(true)
            .barMode(BarMode.Fixed)
            .barWidth(60)
            .animationDuration(300)
            .onChange((index: number) => {
              this.currentIndex = index;
            })
            .layoutWeight(1)
          }
          .width('100%')
          .layoutWeight(1)
        }
      }else {
        Column() {
          Text('未启动产线，无法获取数据信息')
            .fontColor(Color.White)
            .fontWeight(FontWeight.Bolder)
            .fontSize(30)
            .opacity(0.8)
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  private buildTabBar(icon: Resource, index: number) {
    Column() {
      Image(icon)
        .width(18)
        .height(18)
        .fillColor(Color.White)
        .objectFit(ImageFit.Contain)
    }
    .width('90%')
    .aspectRatio(1)
    .justifyContent(FlexAlign.Center)
    .backgroundColor(this.currentIndex === index ? 'rgba(255, 255, 255, 0.25)' : Color.Transparent)
    .scale(this.currentIndex === index ? { x: 1.1, y: 1.1 } : { x: 1.0, y: 1.0 })
    .borderRadius(12)
    .animation({ duration: 200, curve: Curve.EaseInOut })
  }
}