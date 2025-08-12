import { DollyState } from "../../model/DollyState"
import { webSocket } from '@kit.NetworkKit';
import { BusinessError } from '@kit.BasicServicesKit';
import webview from '@ohos.web.webview'

//为ROS指令定义三个类型接口
interface TwistVector {
  x: number;
  y: number;
  z: number;
}

interface TwistMessage {
  linear: TwistVector;
  angular: TwistVector;
}

interface RosCommand {
  op: string;
  topic: string;
  msg: TwistMessage;
}

@Component
export struct Dolly {

  controller:WebviewController = new webview.WebviewController()

  @State private holdTimers: Map<string, number> = new Map();

  //小车运动逻辑
  private startMove(direction: string) {
    // 规则1: 如果【停止】按钮正被按住，任何其他方向键都无效
    if (direction !== '停止' && this.holdTimers.has('停止')) {
      console.info('急停状态中，已忽略其他方向指令');
      return;
    }
    //如果按下的是【停止】按钮
    if (direction === '停止') {
      // 立即清除所有正在运行的方向定时器
      this.holdTimers.forEach((timerId, dir) => {
        if (dir !== '停止') {
          clearInterval(timerId);
        }
      });
      this.holdTimers.clear(); // 清空Map，只留下【停止】
      // 立即发送停止指令，这是实现“立即”响应的关键
      this.move('停止');
      console.info('急停指令已发送');
      this.data.statusText = '空闲中';
      // 启动一个专门的【停止】定时器，持续发送停止指令以确保最高优先级
      const timerId = setInterval(() => {
        this.move('停止');
      }, 200);
      this.holdTimers.set('停止', timerId);
      return; // 【停止】指令的逻辑到此结束
    }
    const allDirections = ['向前', '向后', '向左', '向右'];
    allDirections.forEach(dir => {
      if (dir !== direction && this.holdTimers.has(dir)) {
        console.info(`方向冲突：正在按下【${direction}】，自动松开【${dir}】。`);
        this.stopMove(dir); // 调用 stopMove 来清除旧方向的定时器
      }
    });
    // 如果当前方向的定时器已在运行，则不重复启动
    if (this.holdTimers.has(direction)) {
      return;
    }
    // 启动新方向的定时器
    this.data.statusText = '运行中';
    this.move(direction);
    const timerId = setInterval(() => {
      this.move(direction);
    }, 100);
    this.holdTimers.set(direction, timerId);
  }

  //小车停止逻辑
  private stopMove(direction: string) {
    // 检查并清除当前松开方向的定时器
    if (this.holdTimers.has(direction)) {
      const timerId = this.holdTimers.get(direction);
      clearInterval(timerId);
      this.holdTimers.delete(direction);
      if (this.holdTimers.size === 0) {
        this.sendCommand(0.0, 0.0);
        this.data.statusText = '空闲中';
        console.info("所有按键已松开，发送最终停止指令。");
      }
    }
  }

  private move(direction: string) {

    const speed = 2.0; // 定义前进/后退的基础速度
    const turnSpeed = 2.0; // 定义左转/右转的基础角速度

    let linearX = 0.0;
    let angularZ = 0.0;

    switch (direction) {
      case '向前':
        linearX = speed;
        break;
      case '向后':
        linearX = -speed;
        break;
      case '向左':
        angularZ = turnSpeed;
        break;
      case '向右':
        angularZ = -turnSpeed;
        break;
      case '停止':
        // '停止'按钮会直接发送 0,0 速度
        linearX = 0.0;
        angularZ = 0.0;
        break;
    }
    this.sendCommand(linearX, angularZ);
  }

  //指令发送函数
  private sendCommand(linearX: number, angularZ: number) {
    if (this.ws && this.isWsConnected) {
      const rosCmd: RosCommand = {
        op: "publish",
        topic: "/cmd_vel",
        msg: {
          linear: { x: linearX, y: 0.0, z: 0.0 },
          angular: { x: 0.0, y: 0.0, z: angularZ }
        }
      };

      const cmdJson = JSON.stringify(rosCmd);
      this.ws.send(cmdJson)
        .then((success) => {
          if (success) {
            console.info(`指令已提交发送: ${cmdJson}`);
          } else {
            console.info(`指令提交发送失败: ${cmdJson}`);
          }
        })
        .catch((err: BusinessError) => {
          console.info(`发送指令时出错. Code: ${err.code}, message: ${err.message}`);
        });
    } else {
      console.info("WebSocket 未连接，无法发送指令。");
    }
  }

  addLog: (level: 'info' | 'warning' | 'error', message: string,shouldSave:boolean) => void = () => {};

  @Link data:DollyState;

  // 用于控制按钮按压动画的状态
  @State isPressed: boolean = false;
  //用于追踪鼠标悬浮状态
  @State isHover: boolean = false;

  @Link avatar:Resource;

  //基础信息展示卡片动画控制器
  @State isInfoCardVisible: boolean = false;

  //控制卡片宽度控制
  @State controlCardWidth: string = '65%';

  //用于持有WebSocket客户端实例的变量
  private ws: webSocket.WebSocket | null = null;
  //用于跟踪WebSocket连接状态的变量
  @State private isWsConnected: boolean = false;

  //WebSocket: 封装了创建、监听和连接WebSocket的完整逻辑
  private initializeWebSocket() {
    //创建 WebSocket 实例
    this.ws = webSocket.createWebSocket();
    console.info('成功创建WebSocket实例');

    //下面进行WebSocket实例的初始化

    // 监听连接成功事件
    this.ws.on('open', (err) => {
      if (!err) {
        this.isWsConnected = true;
        console.info("连接成功");
      } else {
        console.info(`连接失败. Code: ${err.code}, message: ${err.message}`);
      }
    });

    // 监听接收到消息事件
    this.ws.on('message', (err, value) => {
      if (!err) {
        console.info("收到回显信息: " + value);
      } else {
        console.info(`收到回显信息失败. Code: ${err.code}, message: ${err.message}`);
      }
    });

    // 监听连接关闭事件
    this.ws.on('close', (err, value) => {
      this.isWsConnected = false;
      if (!err) {
        console.info(`连接已关闭: ${value.code}, reason: ${value.reason}`);
      } else {
        console.info(`连接关闭失败. Code: ${err.code}, message: ${err.message}`);
      }
    });

    // 监听错误事件
    this.ws.on('error', (err) => {
      this.isWsConnected = false;
      console.error(`发生错误: ${err.code}, message: ${err.message}`);
    });

    //发起连接
    const url = "ws://192.168.2.19:9090";
    this.ws.connect(url, (err) => {
      if (!err) {
        console.info("发起连接请求");
      } else {
        console.error(`连接请求失败. Code: ${err.code}, message: ${err.message}`);
      }
    });
  }

  //页面初始化时执行
  aboutToAppear() {
    this.initializeWebSocket();
  }

  //页面销毁时执行
  onDisappear() {
    //在界面销毁前确保让其急停
    this.sendCommand(0.0, 0.0);

    if (this.ws) {
      // 移除所有事件监听，防止在后台触发回调导致应用异常
      this.ws.off('open');
      this.ws.off('message');
      this.ws.off('close');
      this.ws.off('error');

      // 发起关闭请求
      this.ws.close()
        .then(() => {
          console.info("连接关闭成功");
        })
        .catch((err: BusinessError) => {
          console.info(`连接关闭失败. Code: ${err.code}, message: ${err.message}`);
        });
      this.ws = null; // 将WebSocket实例置空
      this.isWsConnected = false;
    }

    // 清理所有可能正在运行的定时器
    this.holdTimers.forEach((timerId) => {
      clearInterval(timerId);
    });
    this.holdTimers.clear();
  }

  private getStatusColor(): Color {
    switch (this.data.statusText) {
      case '运行中':
        return Color.Orange;
      case '离线中':
        return Color.Gray;
      case '空闲中':
        return Color.Green;
      default:
        return Color.Gray;
    }
  }

  private getShadowOptions(): ShadowOptions {
    // 仅在悬浮且未被按下时，显示“浮起”的增强阴影
    if (this.isHover && !this.isPressed) {
      return {
        radius: 15, // 阴影更宽
        color: 'rgba(0, 0, 0, 0.25)', // 阴影更深
        offsetX: 0,
        offsetY: 8 // 向下偏移更多，产生立体感
      };
    }
    // 默认或点击时的阴影
    return {
      radius: 5,
      color: 'rgba(0, 0, 0, 0.15)',
      offsetX: 2,
      offsetY: 2
    };
  }

  private getScaleValue(): number {
    // 点击状态的优先级最高
    if (this.isPressed) {
      return 0.95; // 按下时，总是缩小
    }
    // 其次是悬浮状态
    if (this.isHover) {
      return 1.05; // 悬浮时，放大
    }
    // 默认状态
    return 1.0;
  }

  private showSystemToast(message: string) {
    try {
      this.getUIContext().getPromptAction().showToast({
        message: message,
        duration: 1000,
        bottom: '80%'
      })
    } catch (error) {
      console.error('Show toast error:', error)
    }
  }

  //用于控制图片预览是否显示的状态变量
  @State isPreviewVisible: boolean = false;

  //图片预览层
  @Builder
  private buildImagePreview() {
    // 使用Stack作为根布局，以实现覆盖效果
    Stack() {
      // 半透明背景遮罩，本身就作为可点击关闭的区域
      Column()
        .width('100%')
        .height('100%')
        .backgroundColor('rgba(0, 0, 0, 0.7)')
        .onClick(() => {
          // 点击背景时，关闭预览
          this.isPreviewVisible = false;
        })

      // 居中显示的、放大的图片
      Image($r('app.media.dolly'))
        .width('50%')
        .objectFit(ImageFit.Contain)
        .borderRadius(16)
        // HitTestMode.Block 会让图片组件“消费”掉点击事件，不会传递给背景
        .hitTestBehavior(HitTestMode.Block)

    }
    .width('100%')
    .height('100%')
    .alignContent(Alignment.Center)
    .transition(TransitionEffect.OPACITY.animation({ duration: 250, curve: Curve.EaseInOut }))
  }

  build() {
    Stack(){
      Row({ space: 20 }) {
        //基础信息卡片
        if (!this.isInfoCardVisible){
          Stack(){
            Column() {
              Column(){
                Image(this.avatar)
                  .width(170)
                  .height(100)
                  .borderRadius(16)
                  .opacity(0.8)
                  .onClick(() => {
                    this.isPreviewVisible = true;
                  })
                  // 添加悬浮效果，提升交互感
                  .onHover((isHovering: boolean) => {
                    // 你可以在这里添加额外的悬浮动画，比如轻微放大
                  })
                  .animation({duration: 200, curve: Curve.EaseInOut})
              }
              .width('90%')
              .height('30%')
              .alignItems(HorizontalAlign.Center)
              .justifyContent(FlexAlign.Center)

              Column({ space: 20 }){
                //小车名称
                Row(){
                  Text('名称：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(20)
                    .fontColor(Color.White)
                  Text('小车001')
                    .fontColor(Color.White)
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //小车运行状态
                Row(){
                  Text('状态：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(20)
                    .fontColor(Color.White)
                  Text(this.data.statusText)
                    .fontColor(Color.White)
                  Circle()
                    .margin({ left:10 })
                    .width(16)
                    .height(16)
                    .fill(this.getStatusColor())
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //控制启动按钮
                Row() {
                  if (this.data.statusText === '运行中'||this.data.statusText === '空闲中') {
                    Image($r('app.media.stop'))
                      .width(22).height(22).fillColor(Color.White)
                    Text('停止').fontSize(18).fontWeight(FontWeight.Bold).fontColor(Color.White).margin({ left: 8 })
                  } else {
                    Image($r('app.media.start'))
                      .width(24).height(24).fillColor(Color.White)
                    Text('启动').fontSize(18).fontWeight(FontWeight.Bold).fontColor(Color.White).margin({ left: 8 })
                  }
                }
                .width('80%')
                .height(50)
                .padding(10)
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)
                .backgroundColor(this.data.statusText === '运行中'||this.data.statusText === '空闲中' ? 'rgba(255, 80, 80, 0.4)' : 'rgba(0, 200, 83, 0.5)')
                .borderRadius(25)
                .border({
                  width: 1,
                  color: 'rgba(255, 255, 255, 0.3)'
                })
                .margin({ top: 20 })
                .shadow(this.getShadowOptions())
                .scale({
                  x: this.getScaleValue(),
                  y: this.getScaleValue()
                })
                .opacity(this.isPressed ? 0.8 : 1.0)
                .onHover((isHover: boolean) => {
                  this.isHover = isHover;
                })
                .onTouch((event: TouchEvent) => {
                  event.stopPropagation()
                  if (event.type === TouchType.Down) {
                    this.isPressed = true;
                  }
                  if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.isPressed = false;
                    const isCurrentlyRunning = this.data.statusText === '运行中'||this.data.statusText === '空闲中';
                    const message = isCurrentlyRunning ? '您确定要停止小车吗？' : '您确定要启动小车吗？';

                    AlertDialog.show({
                      title: '操作确认',
                      message: message,
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
                            if (isCurrentlyRunning) {

                              this.data.statusText = '离线中';
                              this.showSystemToast('关闭成功')
                              this.addLog('warning', '关闭了小车，停止了对小车的操作。',true)

                            } else {
                              this.data.statusText = '空闲中';
                              this.showSystemToast('启动成功')
                              this.addLog('info', '启动了小车，要对小车进行操作。',true)
                            }
                            console.info('操作已确认');
                          }
                        }
                      ]
                    });
                  }
                })
                .animation({ duration: 150, curve: Curve.EaseOut })
              }
              .width('100%')
              .height('70%')
              .alignItems(HorizontalAlign.Center)
              .justifyContent(FlexAlign.Center)
              .padding({ left:10 })
            }
            .width('100%')
            .height('100%')
            .backdropBlur(12)
            .backgroundColor('rgba(10, 10, 15, 0.3)')
            .borderRadius(16)
            .border({
              width: 1.5,
              color: 'rgba(255, 255, 255, 0.15)'
            })
            .shadow({
              radius: 30,
              color: 'rgba(173, 216, 230, 0.2)',
              offsetX: 0,
              offsetY: 0
            })
          }
          .width('30%')
          .height('100%')
          .clip(true)
          .offset({ x: this.isInfoCardVisible ? '-120%' : 0 })
          .opacity(this.isInfoCardVisible ? 0 : 1)
        }

        // 小车控制卡片
        Stack({ alignContent: Alignment.TopEnd }){
          Column() {

            //地图位置


            //全屏按钮
            ActionButton({
              icon: $r('app.media.full_screen'),
              click: () => {
                animateTo({
                  duration: 800, // 统一的动画时长
                  curve: Curve.EaseInOut
                }, () => {
                  // 1. 先更新状态
                  this.isInfoCardVisible = !this.isInfoCardVisible;
                  //根据更新后的状态，修改所有需要动画的属性
                  // 所有这些变更都会被这一个 animateTo 捕获并同时应用动画
                  if (this.isInfoCardVisible) {
                    // 折叠视图的状态
                    this.controlCardWidth = '100%';
                  } else {
                    // 展开视图的状态
                    this.controlCardWidth = '65%';
                  }
                });
              }
            })
              .position({top:10,right:20})

            //方向控制按钮
            Row() {
              // 左下角按钮组 (向左, 向右)
              Row({ space: 20 }) {
                //向左按钮
                DirectionalButton({
                  icon: $r('app.media.dolly_left'),
                  onPress: () => { this.startMove('向左'); },
                  onRelease: () => { this.stopMove('向左'); }
                })

                //向右按钮
                DirectionalButton({
                  icon: $r('app.media.dolly_right'),
                  onPress: () => { this.startMove('向右'); },
                  onRelease: () => { this.stopMove('向右'); }
                })
              }

              // 间隔，将左右按钮组推到两边
              Blank()

              // 右下角按钮组 (向前, 向后)
              Column({ space: 20 }) {
                //向前按钮
                DirectionalButton({
                  icon: $r('app.media.dolly_up'),
                  onPress: () => { this.startMove('向前'); },
                  onRelease: () => { this.stopMove('向前'); }
                })

                //急停按钮
                DirectionalButton({
                  icon: $r('app.media.dolly_stop'), // 停止图标
                  onPress: () => { this.startMove('停止'); },
                  onRelease: () => { this.stopMove('停止'); }
                })

                //向后按钮
                DirectionalButton({
                  icon: $r('app.media.dolly_down'),
                  onPress: () => { this.startMove('向后'); },
                  onRelease: () => { this.stopMove('向后'); }
                })

              }
            }
            .width('100%')
            .padding({ left: 20, right: 20 }) // 控制按钮与卡片左右的间距
            .position({ bottom: 10 }) // 将按钮行固定在卡片底部
          }
          .animation({ duration: 300, curve: Curve.EaseInOut }) // 为使能/禁用的透明度变化添加动画
          .justifyContent(FlexAlign.Center) // 居中显示遥感
          .alignItems(HorizontalAlign.Center)
          .width('100%')
          .height('100%')
          .backdropBlur(12)
          .backgroundColor('rgba(10, 10, 15, 0.3)')
          .borderRadius(16)
          .border({
            width: 1.5,
            color: 'rgba(255, 255, 255, 0.15)'
          })
          .shadow({
            radius: 30,
            color: 'rgba(173, 216, 230, 0.2)',
            offsetX: 0,
            offsetY: 0
          })
        }
        .width(this.controlCardWidth)
        .enabled(this.data.statusText === '运行中'||this.data.statusText === '空闲中') // 同样根据小车状态控制是否可用
        .opacity(this.data.statusText === '运行中'||this.data.statusText === '空闲中' ? 1.0 : 0.4)

      }
      .padding(20)
      .width('100%')
      .height('100%')
      .justifyContent(FlexAlign.Center)
      .alignItems(VerticalAlign.Center)

      if (this.isPreviewVisible) {
        this.buildImagePreview()
      }

    }
    .width('100%')
    .height('100%')
  }
}

//全屏组件按钮
@Component
struct ActionButton {
  @Prop icon: Resource;
  click: () => void = () => {};
  @State isPressed: boolean = false;

  build() {
    Row() {
      Image(this.icon)
        .width(22)
        .height(22)
        .fillColor(Color.White)
    }
    .width(44)
    .height(44)
    .backgroundColor('rgba(255, 255, 255, 0.15)')
    .borderRadius(22)
    .justifyContent(FlexAlign.Center)
    .scale({ x: this.isPressed ? 0.9 : 1.0, y: this.isPressed ? 0.9 : 1.0 })
    .opacity(this.isPressed ? 0.7 : 1.0)
    .animation({ duration: 150, curve: Curve.EaseOut })
    .onTouch((event: TouchEvent) => {
      if (event.type === TouchType.Down) {
        this.isPressed = true;
      }
      if (event.type === TouchType.Up) {
        this.isPressed = false;
        this.click();
      }
      if (event.type === TouchType.Cancel) {
        this.isPressed = false;
      }
    })
  }
}

//可复用的方向控制按钮
@Component
struct DirectionalButton {
  @Prop icon: Resource;
  onPress: () => void = () => {};
  onRelease: () => void = () => {};

  @State isPressed: boolean = false;

  //用于根据按压状态生成不同阴影的辅助方法
  private getShadow(): ShadowOptions {
    if (this.isPressed) {
      // 按下时的阴影：更小、更贴近，模拟“按下去”的效果
      return {
        radius: 8,
        color: 'rgba(0, 0, 0, 0.4)',
        offsetX: 2,
        offsetY: 2
      }
    } else {
      // 默认的悬浮阴影：更宽、更深，产生立体感
      return {
        radius: 12,
        color: 'rgba(0, 0, 0, 0.35)',
        offsetX: 0,
        offsetY: 5
      }
    }
  }

  build() {
    Row() {
      Image(this.icon)
        .width(40)
        .height(40)
        .fillColor(Color.White)
    }
    .width(80)
    .height(80)
    .borderRadius(16) // 使用圆角来匹配界面的卡片风格
    .justifyContent(FlexAlign.Center)
    .backgroundColor('rgba(45, 50, 65, 0.45)') // 略带蓝调的深灰色，有一定透明度
    .backdropBlur(12) // 应用磨砂效果
    .border({
      width: 1.5,
      color: 'rgba(255, 255, 255, 0.2)'
    })
    .shadow(this.getShadow())
    .scale(this.isPressed ? { x: 0.9, y: 0.9 } : { x: 1.0, y: 1.0 })
    .animation({ curve: Curve.EaseOut, duration: 150 })
    .onTouch((event: TouchEvent) => {
      event.stopPropagation();
      if (event.type === TouchType.Down) {
        this.isPressed = true;
        this.onPress();
      }
      if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
        this.isPressed = false;
        this.onRelease();
      }
    })
  }
}