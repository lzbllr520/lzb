import { ConveyorState } from '../model/ConveyorState'
import { DollyState } from '../model/DollyState'
import { RobotArmState } from '../model/RobotArmState'
import {Conveyor1} from './device/Conveyor1'
import {Conveyor2} from './device/Conveyor2'
import {Dolly} from '../view/device/Dolly'
import {RobotArm1} from '../view/device/RobotArm1'
import {RobotArm2} from '../view/device/RobotArm2'
import {RobotArm3} from '../view/device/RobotArm3'
import { Server,Node,Data } from '../model/ServerState'
import { getNodeOther, getNodeStart } from '../service/Request'
import { promptAction } from '@kit.ArkUI'

@Component
export struct DeviceManager {

//加载标志位
@State isLoading: boolean = true;

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

@State pressedTabIndex: number = -1

onIndexChange: (index: number) => void = () => {}

@Prop @Watch('onServersChange') servers:Server[]|null=[]

//传送带1
@State data1:Data={id:'', node_id:''}
//传送带2
@State data2:Data={id:'', node_id:''}
//机械臂1
@State data3:Data={id:'', node_id:''}
//机械臂2
@State data4:Data={id:'', node_id:''}
//机械臂3
@State data5:Data={id:'', node_id:''}

async onServersChange(): Promise<void>{
promptAction.showToast({message:JSON.stringify(this.servers)})
// 如果没有服务，直接结束加载
if (!this.servers || this.servers.length === 0) {
this.isLoading = false;
return;
}

    this.isLoading = true; // 开始加载

    try {
      // 使用 Promise.all 来并行处理所有服务器的节点查找请求
      // map 会返回一个 Promise 数组，Promise.all 会等待所有 Promise 完成
      await Promise.all(this.servers.map(async (item: Server) => {
        const serverId = item.id;
        // 统一处理获取节点的逻辑
        const fetchNode = async (nodeIndex: number) => {
          const nodes1 = await getNodeStart(serverId);
          if (nodes1 && nodes1.length > 3) {
            const nodes2 = await getNodeOther(serverId, nodes1[3].node_id);
            if (nodes2 && nodes2.length > nodeIndex) {
              return {
                id: serverId,
                node_id: nodes2[nodeIndex].node_id
              } as Data
            }
          }
          return null;
        };

        switch (serverId) {
          case 'server2': // 传送带1
            this.data1 = await fetchNode(3) ?? {id:'', node_id:''};
            break;
          case 'server5': // 传送带2
            this.data2 = await fetchNode(3) ?? {id:'', node_id:''};
            break;
          case 'server1': // 机械臂1
            this.data3 = await fetchNode(2) ?? {id:'', node_id:''};
            break;
          case 'server3': // 机械臂2
            this.data4 = await fetchNode(2) ?? {id:'', node_id:''};
            break;
          case 'server4': // 机械臂3
            this.data5 = await fetchNode(2) ?? {id:'', node_id:''};
            break;
        }
      }));
    } catch (error) {
      // 增加错误处理
      promptAction.showToast({message:'加载设备信息结点失败'})
    } finally {
      //无论成功还是失败，最后都要结束加载状态
      this.isLoading = false;
    }
}

aboutToAppear(): void {
this.onServersChange()
}

handleTabChange(targetIndex: number) {

    let canSwitch = true;
    let alertMessage = '';

    switch (targetIndex) {
      case 1:
        if (!this.data1.id || !this.data1.node_id) {
          canSwitch = false;
          alertMessage = '没有一号传送带对应的服务可使用';
        }
        break;
      case 2:
        if (!this.data2.id || !this.data2.node_id) {
          canSwitch = false;
          alertMessage = '没有二号传送带对应的服务可使用';
        }
        break;
      case 3:
        if (!this.data3.id || !this.data3.node_id) {
          canSwitch = false;
          alertMessage = '没有一号机械臂对应的服务可使用';
        }
        break;
      case 4:
        if (!this.data4.id || !this.data4.node_id) {
          canSwitch = false;
          alertMessage = '没有二号机械臂对应的服务可使用';
        }
        break;
      case 5:
        if (!this.data5.id || !this.data5.node_id) {
          canSwitch = false;
          alertMessage = '没有三号机械臂对应的服务可使用';
        }
        break;
    }

    if (canSwitch) {
      this.currentIndex = targetIndex;
      this.onIndexChange(targetIndex);
    } else {
      AlertDialog.show({
        title: '操作提示',
        message: alertMessage,
        alignment: DialogAlignment.Center,
        autoCancel: true,
        buttons: [
          {
            value: '确定',
            action: () => {}
          }
        ]
      })
    }
}

// @Builder deviceContent 已被移除

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
.animation({ duration: 100, curve: Curve.EaseOut })
.onTouch((event: TouchEvent) => {
if (event.type === TouchType.Down) {
this.pressedTabIndex = targetIndex;
}
if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
this.pressedTabIndex = -1;
}
})
}

build() {
Stack(){
Column({ space: 0 }) {
Row() {
Tabs({ index: this.currentIndex }) {
ForEach(this.tabArray, (item: string) => {
TabContent().tabBar(this.tabBuilder(item, this.tabArray.indexOf(item)))
}, (item: string) => item)
}
.barMode(BarMode.Scrollable)
.onChange((index: number) => {
this.handleTabChange(index)
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

        // 内容区域：直接使用 if/else if 结构，不再通过 @Builder 调用
        Column() {
          if (this.currentIndex === 0) {
            Dolly({
              data:this.dollyData,
              addLog: this.addLog,
              avatar:this.dollyAvatar
            })
          } else if (this.currentIndex === 1) {
            Conveyor1({
              data:this.conveyorData1,
              addLog: this.addLog,
              avatar:this.conveyorAvatar,
              // 因为只有在 currentIndex === 1 时才会渲染，所以 isActive 恒为 true
              isActive: true,
              node:this.data1
            })
          } else if (this.currentIndex === 2) {
            Conveyor2({
              data:this.conveyorData2,
              addLog: this.addLog,
              avatar:this.conveyorAvatar,
              // 因为只有在 currentIndex === 2 时才会渲染，所以 isActive 恒为 true
              isActive: true,
              node:this.data2
            })
          } else if (this.currentIndex === 3) {
            RobotArm1({
              data:this.robot1Data,
              addLog: this.addLog,
              avatar:this.robotArmAvatar,
              node:this.data3
            })
          } else if (this.currentIndex === 4) {
            RobotArm2({
              data:this.robot2Data,
              addLog: this.addLog,
              avatar:this.robotArmAvatar,
              node:this.data4
            })
          } else if (this.currentIndex === 5) {
            RobotArm3({
              data:this.robot3Data,
              addLog: this.addLog,
              avatar:this.robotArmAvatar,
              node:this.data5
            })
          }
        }
        // 合并了原有的两层Column的全部修饰符，以保证布局不变
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
        .layoutWeight(1)
        .animation({ duration: 300, curve: Curve.Ease })
      }
      .enabled(!this.isLoading)
      .opacity(this.isLoading?0.6:1)
      .width('100%')
      .height('100%')

      if (this.isLoading) {
        Column() {
          // 加载动画 (转圈)
          Progress({ type: ProgressType.Ring, value: 0 })
            .width(60)
            .color(Color.White)

          Text('设备信息加载中...')
            .fontColor(Color.White)
            .fontWeight(FontWeight.Bold)
            .fontSize(30)
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
        .backgroundColor('rgba(0, 0, 0, 0.4)') // 半透明黑色背景作为遮罩
        .onClick(() => {
          // 添加一个空的onClick事件，可以阻止点击穿透到下层UI
        })
      }

    }
    .width('100%')
    .height('100%')
}
}