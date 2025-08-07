import { MasterStation } from '../view/MasterStation'
import { DeviceManager } from '../view/DeviceManager'
import { TaskLog } from '../view/TaskLog'
import { DataStatics } from '../view/DataStatics'
import { SystemSetting } from '../view/SystemSetting'

import window from '@ohos.window';
import { common } from '@kit.AbilityKit'

import {RobotArmState} from '../model/RobotArmState'
import { ConveyorState } from '../model/ConveyorState'
import {DollyState} from '../model/DollyState'

import preferences from '@ohos.data.preferences';

import promptAction from '@ohos.promptAction';
import { getAllServers } from '../service/Request'

import {Server} from '../model/ServerState'
import { Environment } from '../view/Enviroment'

//日志接口
interface LogEntry {
  id: number;
  level: 'info' | 'warning' | 'error';
  timestamp: string;
  message: string;
}

//用于持久化存储日志的变量
const PREFERENCES_FILE_NAME = 'app_main_data';
const KEY_LOG_ITEMS = 'all_log_items';

@Entry
@Component
struct MainPage {
  //处理页面跳转函数
  handleNavigation(index: number) {
    // 检查是否要跳转到设备管理(index: 1) 且 产线正在运行
    if (index === 1 && this.isLineRunning) {
      AlertDialog.show({
        title: '操作提示',
        message: '产线正在运行，关闭产线运行才可对设备进行单独操作。',
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
    } else if (index===1&&this.servers?.length===0) {
      AlertDialog.show({
        title: '操作提示',
        message: '没有可用服务对象，无法对设备进行操作管理',
        alignment: DialogAlignment.Center,
        autoCancel: true,
        buttons: [
          {
            value: '确定',
            action: () => {
              //无需做任何操作
            }
          }
        ]
      });
    }else {
      this.currentPage = index;
    }
  }

  //保存日志函数
  async saveLogs() {
    try {
      const prefs = await preferences.getPreferences(getContext(this), PREFERENCES_FILE_NAME)
      // 将日志数组转换为 JSON 字符串
      const jsonString = JSON.stringify(this.allLogItems)
      //将字符串存入 preferences
      await prefs.put(KEY_LOG_ITEMS, jsonString)
      //确保数据写入磁盘
      await prefs.flush();
      //保存日志到本地成功
    } catch (e) {
      //保存日志到本地失败
    }
  }

  //从本地加载日志的异步函数
  async loadLogs() {
    try {
      const prefs = await preferences.getPreferences(getContext(this), PREFERENCES_FILE_NAME);
      //从 preferences 读取 JSON 字符串，如果不存在则返回一个空数组的字符串 '[]'
      const jsonString = await prefs.get(KEY_LOG_ITEMS, '[]') as string;
      //将字符串解析回对象数组
      const loadedLogs = JSON.parse(jsonString) as LogEntry[];
      this.allLogItems = loadedLogs;
      // 如果加载后一条日志都没有，则添加一条欢迎日志
      if (this.allLogItems.length === 0) {
        this.addLog('info', '欢迎来到家电能效检测中控平台！', false); // 首次加载不重复保存
      }
      //加载日志到应用上成功
    } catch (e) {
      promptAction.showToast({message:'加载日志到应用上失败',bottom:'50%',duration:1000})
    }
  }

  //清除日志函数
  async clearAllLogs() {
    // 确认操作弹窗
    AlertDialog.show({
      title: '确认操作',
      message: '您确定要清除所有日志吗？此操作不可撤销。',
      alignment: DialogAlignment.Center,
      buttons: [
        {
          value: '取消',
          action: () => {
          }
        },
        {
          value: '确认清除',
          fontColor: Color.Red,
          action: async () => {
            try {
              //清空内存中的 @State 数组
              this.allLogItems = [];
              //清除本地存储中的日志
              const prefs = await preferences.getPreferences(getContext(this), PREFERENCES_FILE_NAME);
              await prefs.delete(KEY_LOG_ITEMS); // 使用 delete 删除对应的键
              await prefs.flush();
              //日志从本地和应用中清除成功
              //添加一条清除记录
              this.addLog('warning', '所有日志信息已被管理员清除。');
              //清除成功提示
              promptAction.showToast({message:'清除日志成功',bottom:'50%',duration:1000})
            } catch (e) {
              promptAction.showToast({message:'清除日志失败',bottom:'50%',duration:1000})
            }
          }
        }
      ]
    });
  }

  @State private allLogItems: LogEntry[] = [];

  //获取日志生成时间
  private getCurrentTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    // getMonth() 返回的月份是从0开始的 (0-11)，所以需要加 1
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  //添加新日志的函数，这个函数将传递给子组件
  addLog(level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean = true) {
    const newLog: LogEntry = {
      id: this.allLogItems.length > 0 ? Math.max(...this.allLogItems.map(item => item.id)) + 1 : 1,
      level: level,
      timestamp: this.getCurrentTime(),
      message: message
    };
    this.allLogItems.unshift(newLog);
    //添加日志后，调用保存函数
    if (shouldSave) {
      this.saveLogs();
    }
  }

  //（组件销毁生命周期）组件销毁时进行一次保存，确保万无一失
  onDisappear() {
    this.saveLogs();
  }

  //状态提升
  //设备控制页面导航，默认为0
  @State deviceManagerIndex: number = 0;

  //保持一号传送带的数据
  @State conveyorData1:ConveyorState=new ConveyorState();

  //保持二号传送带的数据
  @State conveyorData2:ConveyorState=new ConveyorState();

  //保持小车的数据
  @State dollyData:DollyState=new DollyState();

  //保持一号机械臂的数据
  @State robot1Data: RobotArmState = new RobotArmState();

  //保持二号机械臂的数据
  @State robot2Data: RobotArmState = new RobotArmState();

  //保持三号机械臂的数据
  @State robot3Data: RobotArmState = new RobotArmState();

  //持久化产线是否运作信息
  @State isLineRunning: boolean = false;

  //用来存储预先加载好的用户头像信息，这样切换到系统设置界面的话图片就不用再每次都重新加载
  @State userAvatar: Resource | undefined = undefined;
  //这些是提前加载好的设备图像
  @State conveyorAvatar:Resource | undefined = undefined;
  @State dollyAvatar:Resource | undefined = undefined;
  @State robotArmAvatar:Resource | undefined = undefined;

  @State currentPage: number = 0 // 当前页面索引，默认为0
  @State showSidebar: boolean = true  // 控制侧边栏显示
  private context = getContext(this) as common.UIAbilityContext // 获取应用上下文

  //侧边栏显示与隐藏按钮的点击动画控制变量
  @State isSidebarButtonPressed: boolean = false

  //侧边栏的显示与隐藏
  toggleSidebar() {
    this.showSidebar = !this.showSidebar
  }

  @State servers:Server[]|null=[]

  //页面的初始生命周期
  async aboutToAppear() {
    try {
      //获取所有服务器
      const servers:Server[]|null=await getAllServers()
      this.servers=servers

      //先加载本地的日志到应用中
      this.loadLogs()
      //先将图像信息状态提升，这样就不用每次切换页面都去重新加载了
      this.userAvatar = $r('app.media.user');
      this.conveyorAvatar=$r('app.media.conveyor')
      this.dollyAvatar=$r('app.media.dolly')
      this.robotArmAvatar=$r('app.media.robotArm')
      //获取窗口对象
      const win = await window.getLastWindow(this.context);
      //背景缓慢显示动画控制代码
      animateTo({ duration: 3000, curve: Curve.EaseInOut }, () => {
        this.bgOpacity = 1;
      })
    } catch (exception) {
      //页面初始生成周期函数执行出错
    }
  }

  //背景缓慢显示数值
  @State bgOpacity: number = 0;

  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      Image($r('app.media.zb'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
        .opacity(this.bgOpacity)
      Row() {
        // 侧边栏
        Column() {
          if (this.showSidebar){
            Image($r('app.media.left'))
              .width(18)
              .height(18)
              .scale({ x: this.isSidebarButtonPressed ? 0.85 : 1, y: this.isSidebarButtonPressed ? 0.85 : 1 })
              .animation({
                duration: 100, // 动画时长，要短，显得干脆
                curve: Curve.EaseInOut
              })
              .onClick(() => {
                this.isSidebarButtonPressed = true
                setTimeout(() => {
                  this.isSidebarButtonPressed = false
                  this.toggleSidebar()
                }, 200)
              })
          }else {
            Image($r('app.media.right'))
              .width(18)
              .height(18)
              .scale({ x: this.isSidebarButtonPressed ? 0.85 : 1, y: this.isSidebarButtonPressed ? 0.85 : 1 })
              .animation({
                duration: 100, // 动画时长，要短，显得干脆
                curve: Curve.EaseInOut
              })
              .onClick(() => {
                this.isSidebarButtonPressed = true
                setTimeout(() => {
                  this.isSidebarButtonPressed = false
                  this.toggleSidebar()
                }, 200)
              })
          }

          //环境数据
          NavigationItem({
            index: 0,
            current: this.currentPage,
            icon: $r("app.media.master"),
            selectedIcon:$r("app.media.master_active"),
            text: '主控台',
            currentPage: $currentPage,
            showSidebar: this.showSidebar,
            onNavigate: this.handleNavigation.bind(this)
          })

          // 主控台
          NavigationItem({
            index: 1,
            current: this.currentPage,
            icon: $r("app.media.environment"),
            selectedIcon:$r("app.media.environment_active"),
            text: '环境数据',
            currentPage: $currentPage,
            showSidebar: this.showSidebar,
            onNavigate: this.handleNavigation.bind(this)
          })

          // 设备管理
          NavigationItem({
            index: 2,
            current: this.currentPage,
            icon: $r('app.media.device'),
            selectedIcon:$r("app.media.device_active"),
            text: '设备管理',
            currentPage: $currentPage,
            showSidebar: this.showSidebar,
            onNavigate: this.handleNavigation.bind(this)
          })

          // 任务日志
          NavigationItem({
            index: 3,
            current: this.currentPage,
            icon: $r('app.media.task'),
            selectedIcon:$r("app.media.task_active"),
            text: '任务日志',
            currentPage: $currentPage,
            showSidebar: this.showSidebar,
            onNavigate: this.handleNavigation.bind(this)
          })

          // 知识库
          NavigationItem({
            index: 4,
            current: this.currentPage,
            icon: $r('app.media.data'),
            selectedIcon:$r("app.media.data_active"),
            text: '知识库',
            currentPage: $currentPage,
            showSidebar: this.showSidebar,
            onNavigate: this.handleNavigation.bind(this)
          })

          // 系统设置
          NavigationItem({
            index: 5,
            current: this.currentPage,
            icon: $r('app.media.setting'),
            selectedIcon:$r("app.media.setting_active"),
            text: '系统设置',
            currentPage: $currentPage,
            showSidebar: this.showSidebar,
            onNavigate: this.handleNavigation.bind(this)
          })
        }
        .padding({top:10})
        .width(this.showSidebar ? '12%' : '6%')
        .height('100%')
        .justifyContent(FlexAlign.SpaceAround)
        .backgroundEffect({
          radius: 40, // 模糊半径，数值越大越模糊
          saturation: 1.8, // 增加饱和度，让背景图像透过来的颜色更鲜艳
          color: 'rgba(10, 10, 10, 0.2)' // 叠加一层半透明颜色，打造磨砂质感
        })
        .border({
          width: { right: 1 },
          color: 'rgba(255, 255, 255, 0.2)'
        })
        .animation({
          duration: 300,
          curve: Curve.EaseInOut
        })

        // 内容区域
        Column() {
          if (this.currentPage===0){
            MasterStation({
              conveyorData1:this.conveyorData1,
              conveyorData2:this.conveyorData2,
              dollyData:this.dollyData,
              robot1Data:this.robot1Data,
              robot2Data:this.robot2Data,
              robot3Data:this.robot3Data,
              addLog: this.addLog.bind(this),
              isLineRunning:this.isLineRunning
            })
          } else if (this.currentPage === 1) {
            Environment({
              servers:this.servers??[]
            })
          } else if (this.currentPage === 1) {
            DeviceManager({
              currentIndex: this.deviceManagerIndex,
              conveyorData1:this.conveyorData1,
              conveyorData2:this.conveyorData2,
              dollyData:this.dollyData,
              robot1Data:this.robot1Data,
              robot2Data:this.robot2Data,
              robot3Data:this.robot3Data,
              addLog: this.addLog.bind(this),
              conveyorAvatar:this.conveyorAvatar,
              dollyAvatar:this.dollyAvatar,
              robotArmAvatar:this.robotArmAvatar,
              onIndexChange: (index: number) => {
                this.deviceManagerIndex = index;
              },
              servers:this.servers
            })
          } else if (this.currentPage === 2) {
            TaskLog({
              allLogItems: this.allLogItems,
              clearAllLogs: this.clearAllLogs.bind(this)
            })
          } else if (this.currentPage === 3) {
            DataStatics()
          } else {
            SystemSetting({
              addLog: this.addLog.bind(this),
              avatar:this.userAvatar
            })
          }
        }
        .width(this.showSidebar ? '88%' : '94%')
        .height('100%')
        .animation({
          duration: 300,
          curve: Curve.EaseInOut
        })

      }
      .width('100%')
      .height('100%')
    }
    .backgroundColor('#0E1307')
    .width('100%')
    .height('100%')
  }
}

@Component
struct NavigationItem {
  @Prop index: number
  @Prop current: number
  @Prop icon: Resource
  @Prop selectedIcon:Resource
  @Prop text: string

  @Link currentPage: number

  @Prop showSidebar:boolean

  // 定义选中和未选中时的颜色
  private selectedColor: string = '#1890ff' // 选中颜色(蓝色)
  private normalColor: string = '#FFFFFF'  // 默认颜色(深灰色)

  //用于控制按压动效的状态变量
  @State isPressed: boolean = false;

  onNavigate: (index: number) => void = () => {}

  build() {
    Column() {
      Image(this.index === this.currentPage ? this.selectedIcon : this.icon)
        .width(this.showSidebar ? 18 : 18)
        .height(this.showSidebar ? 18 : 18)
      if (this.showSidebar) {
        Text(this.text)
          .fontSize(10)
          .margin({ top: 10 })
          .fontColor(this.index === this.currentPage ? this.selectedColor : this.normalColor)
          .transition(TransitionEffect.opacity(0).animation({ duration: 0, curve: Curve.EaseInOut }))
      }
    }
    .width('85%')
    .height(this.showSidebar ? 70 : 50)
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .borderRadius(15)
    .backgroundColor(this.index === this.current ? 'rgba(255, 255, 255, 0.25)' : 'transparent')
    .scale({ x: this.isPressed ? 0.95 : 1, y: this.isPressed ? 0.95 : 1 })
    .onClick(() => {
      this.onNavigate(this.index)
    })
    .onTouch((event: TouchEvent) => {
      if (event.type === TouchType.Down) {
        this.isPressed = true;
      }
      if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
        this.isPressed = false;
      }
    })
    .animation({
      duration: 50, // 动画时长
      curve: Curve.EaseInOut // 动画曲线
    })
  }
}