// 导入DeviceInfoCard组件
import { DeviceInfoCard } from '../components/DeviceInfoCard'
import { ConveyorState } from '../model/ConveyorState';
import { DollyState } from '../model/DollyState';
import { RobotArmState } from '../model/RobotArmState';
import promptAction from '@ohos.promptAction';

// 定义一个简单的数据模型，实际开发中这些数据应通过ViewModel从后端或传感器获取
// 定义一个简单的数据模型
class DeviceStatus {
  //在类的顶层明确声明所有属性
  name: string;
  icon: Resource;
  temp: number;
  humidity: number;
  noise: number;
  vibration: boolean;
  status:string;

  //constructor 只负责接收参数并为已声明的属性赋值
  constructor(name: string, icon: Resource, temp: number, humidity: number, noise: number, vibration: boolean,status:string) {
    this.name = name;
    this.icon = icon;
    this.temp = temp;
    this.humidity = humidity;
    this.noise = noise;
    this.vibration = vibration;
    this.status=status
  }
}

@Component
export struct MasterStation {
  // 使用@State装饰器使数据成为响应式的，当数据改变时UI会自动更新
  @State deviceList: DeviceStatus[] = [
    new DeviceStatus("传送带 #1", $r('app.media.conveyor_icon'), 32, 45, 55, false,'离线中'),
    new DeviceStatus("传送带 #2", $r('app.media.conveyor_icon'), 35, 48, 58,false,'离线中'),
    new DeviceStatus("小车 #1", $r('app.media.dolly_icon'), 41, 50, 40, false,'离线中'),
    new DeviceStatus("机械臂 #1", $r('app.media.robotarm_icon'), 58, 65, 68,false,'离线中'),
    new DeviceStatus("机械臂 #2", $r('app.media.robotarm_icon'), 62, 66, 71,false,'离线中'), // 示例：温度和噪音超标
    new DeviceStatus("机械臂 #3", $r('app.media.robotarm_icon'), 55, 63, 65,false,'离线中')
  ];

  @Link conveyorData1:ConveyorState;
  @Link conveyorData2:ConveyorState;
  @Link dollyData:DollyState;
  @Link robot1Data: RobotArmState;
  @Link robot2Data: RobotArmState;
  @Link robot3Data: RobotArmState;

  @Link isLineRunning: boolean

  addLog: (level: 'info' | 'warning' | 'error', message: string,shouldSave:boolean) => void = () => {};

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
              // 重置所有设备状态为空闲
              this.conveyorData1.statusText = '离线中';
              this.conveyorData2.statusText = '离线中';
              this.dollyData.statusText = '离线中';
              this.robot1Data.statusText = '离线中';
              this.robot2Data.statusText = '离线中';
              this.robot3Data.statusText = '离线中';

              this.deviceList[0].status='离线中'
              this.deviceList[1].status='离线中'
              this.deviceList[2].status='离线中'
              this.deviceList[3].status='离线中'
              this.deviceList[4].status='离线中'
              this.deviceList[5].status='离线中'

              //强制进行页面刷新
              this.deviceList = [...this.deviceList];

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
              // 重置所有设备状态为空闲
              this.conveyorData1.statusText='运行中'
              this.conveyorData2.statusText = '运行中';
              this.dollyData.statusText = '运行中';
              this.robot1Data.statusText = '运行中';
              this.robot2Data.statusText = '运行中';
              this.robot3Data.statusText = '运行中';

              this.deviceList[0].status='运行中'
              this.deviceList[1].status='运行中'
              this.deviceList[2].status='运行中'
              this.deviceList[3].status='运行中'
              this.deviceList[4].status='运行中'
              this.deviceList[5].status='运行中'

              //强制进行页面刷新
              this.deviceList = [...this.deviceList];

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
      .width('100%')
      .justifyContent(FlexAlign.SpaceEvenly) // 让按钮均匀分布
      .margin({top:20})

      //使用Grid布局来展示所有设备卡片
      Grid() {
        // 循环渲染设备列表
        ForEach(this.deviceList, (item: DeviceStatus) => {
          GridItem() {
            // 使用我们封装好的DeviceInfoCard组件
            DeviceInfoCard({
              title: item.name,
              icon: item.icon,
              temperature: item.temp,
              humidity: item.humidity,
              noise: item.noise,
              vibration: item.vibration,
              status:item.status,
              conveyorData1:this.conveyorData1,
              conveyorData2:this.conveyorData2,
              dollyData:this.dollyData,
              robot1Data:this.robot1Data,
              robot2Data:this.robot2Data,
              robot3Data:this.robot3Data,
              isLineRunning:this.isLineRunning
            })
          }
        })
      }
      .columnsTemplate('1fr 1fr') // 定义网格为两列，平分宽度
      .rowsTemplate('1fr 1fr 1fr')   // 定义网格为三行
      .columnsGap(20)             // 列间距
      .rowsGap(20)                // 行间距
      .padding(20)
      .width('95%')
      .height('85%')

    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Start) // 从顶部开始排列
    .alignItems(HorizontalAlign.Center)
  }
}