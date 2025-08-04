
import {ServerInfoView} from '../components/ServerInfoView'
import { Server } from '../model/ServerState'
import {IconTab} from '../components/IconTab'
import { ConveyorState } from '../model/ConveyorState'
import { DollyState } from '../model/DollyState'
import { RobotArmState } from '../model/RobotArmState'

@Component
export struct MasterStation {
  @State currentIndex: number=0
  @Prop servers: Server[] = []

  private controller: TabsController = new TabsController();

  @Link isLineRunning: boolean

  addLog: (level: 'info' | 'warning' | 'error', message: string,shouldSave:boolean) => void = () => {};

  @Builder
  private CustomIconTabBar(icon: Resource) {
    IconTab({
      icon: icon
    })
  }

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
            this.isLineRunning = false;
            this.addLog('warning','停止产线运行',true)
          }
        }
      ]
    });
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
            //将所有独立的 @Link 状态文本放入一个数组中
            const allDeviceStatuses = [
              this.conveyorData1.statusText,
              this.conveyorData2.statusText,
              this.dollyData.statusText,
              this.robot1Data.statusText,
              this.robot2Data.statusText,
              this.robot3Data.statusText
            ];
            //检查这个数组中是否有任何一个状态不是“离线中”
            const isAnyDeviceNotOffline = allDeviceStatuses.some(status => status !== '离线中');
            if (isAnyDeviceNotOffline) {
              //有设备未进入离线状态，无法进入产线运作
              //进行弹窗提示
              AlertDialog.show({
                title: '操作提示',
                message: '有设备未进入离线状态，请前往设备管理界面中停止设备运作。',
                alignment: DialogAlignment.Center, // 弹窗居中显示
                autoCancel: true, // 点击弹窗外部区域不可关闭，强制用户点击按钮
                buttons: [
                  {
                    value: '确定', // 按钮显示的文字
                    action: () => {
                      //无需做任何操作
                    }
                  }
                ]
              });
            }else {
              this.isLineRunning = true;
              this.addLog('info','启动产线运行',true)
            }
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
          .backgroundColor(this.isLineRunning ? Color.Gray : '#28a745') // 运行时变灰
          .enabled(!this.isLineRunning) // 运行时禁用

        Button('停止产线运作')
          .onClick(() => this.stopLine())
          .backgroundColor(this.isLineRunning ? '#dc3545' : Color.Gray) // 运行时才可用
          .enabled(this.isLineRunning) // 未运行时禁用
      }
      .margin({top:20})
      .width('100%')
      .justifyContent(FlexAlign.SpaceEvenly) // 让按钮均匀分布

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
        Tabs({
          controller: this.controller,
          barPosition: BarPosition.Start
        }) {
          ForEach(
            this.servers,
            (server: Server,index: number) => {
              TabContent() {
                ServerInfoView({ server: server })
              }
              .tabBar(this.CustomIconTabBar($r('app.media.server')))
            },
            (server: Server) => server.id
          )
        }
        .scrollable(false)
        .vertical(true)
        .barMode(BarMode.Fixed)
        .barWidth(60)
        .animationDuration(300)
        .onChange((index: number) => {
          this.currentIndex = index;
        })
        .layoutWeight(1)
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  buildTabBar(name: string) {
    Column() {
      Text(name)
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor(Color.White)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .textAlign(TextAlign.Center)
    }
    .padding({ left: 10, right: 10, top: 15, bottom: 15 })
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}