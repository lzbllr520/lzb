import { RobotArmState } from '../../model/RobotArmState'
import { RoboticArmWorkRangeView } from '../../components/RoboticArmWorkRangeView'
import { Server, Node } from '../../model/ServerState';

@Component
export struct RobotArm3 {

  addLog: (level: 'info' | 'warning' | 'error', message: string,shouldSave:boolean) => void = () => {};

  @Link data:RobotArmState;
  @Link avatar:Resource;

  // 基础信息卡片和控制卡片联动动画控制器
  @State button_icon_size:number=25
  @State button_size:number=40
  @State catch_size_height:number=40
  @State catch_size_width:string='25%'
  @State catch_font_size:number=18
  @State con_width:string='90%'
  @State con_height:number=50

  @State button_icon_size2:number=18
  @State button_size2:number=28
  @State catch_size_height2:number=30
  @State catch_size_width2:string='70%'
  @State catch_font_size2:number=20
  @State con_width2:string='95%'
  @State con_height2:number=40


  private increaseSpeedX() {
    this.data.xValue+=this.data.step_xyz
  }
  private decreaseSpeedX() {
    this.data.xValue-=this.data.step_xyz
  }

  private increaseSpeedY() {
    this.data.yValue+=this.data.step_xyz
  }
  private decreaseSpeedY() {
    this.data.yValue-=this.data.step_xyz
  }

  private increaseSpeedZ() {
    this.data.zValue+=this.data.step_xyz
  }
  private decreaseSpeedZ() {
    this.data.zValue-=this.data.step_xyz
  }

  private increaseSpeedR() {
    this.data.rValue+=this.data.step_r
  }
  private decreaseSpeedR() {
    this.data.rValue-=this.data.step_r
  }

  private increaseSpeedJump() {
    this.data.jumpValue++
  }
  private decreaseSpeedJump() {
    this.data.jumpValue--
  }

  private increaseSpeedZZ() {
    this.data.zzValue++
  }
  private decreaseSpeedZZ() {
    this.data.zzValue--
  }

  private increaseSpeedRR() {
    this.data.rrValue++
  }
  private decreaseSpeedRR() {
    this.data.rrValue--
  }


  // 用于控制按钮按压动画的状态
  @State isPressed: boolean = false;

  //用于追踪鼠标悬浮状态
  @State isHover: boolean = false;

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
    if (this.isHover && !this.isPressed) {
      return {
        radius: 15,
        color: 'rgba(0, 0, 0, 0.25)',
        offsetX: 0,
        offsetY: 8
      };
    }
    return {
      radius: 5,
      color: 'rgba(0, 0, 0, 0.15)',
      offsetX: 2,
      offsetY: 2
    };
  }

  private getScaleValue(): number {
    if (this.isPressed) {
      return 0.95;
    }
    if (this.isHover) {
      return 1.05;
    }
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

  @State private idleTimer: number = -1;

  onDisappear() {
    // 清理 setTimeout 创建的定时器
    if (this.idleTimer !== -1) clearTimeout(this.idleTimer);
  }

  private activateArm() {
    if (this.data.statusText === '空闲中') {
      this.data.statusText = '运行中';
    }
  }

  private resetIdleTimer() {
    if (this.idleTimer !== -1) {
      clearTimeout(this.idleTimer);
    }
    if (this.data.statusText === '运行中') {
      this.idleTimer = setTimeout(() => {
        if (this.data.statusText === '运行中') {
          this.data.statusText = '空闲中';
        }
      }, 10000);
    }
  }

  @State isPreviewVisible: boolean = false;

  @Builder
  private buildImagePreview() {
    Stack() {
      Column()
        .width('100%')
        .height('100%')
        .backgroundColor('rgba(0, 0, 0, 0.7)')
        .onClick(() => {
          this.isPreviewVisible = false;
        })

      Image($r('app.media.robotArm'))
        .width('50%')
        .objectFit(ImageFit.Contain)
        .borderRadius(16)
        .hitTestBehavior(HitTestMode.Block)
    }
    .width('100%')
    .height('100%')
    .alignContent(Alignment.Center)
    .transition(TransitionEffect.OPACITY.animation({ duration: 250, curve: Curve.EaseInOut }))
  }
  build() {
    Stack(){
      Row({space:20}){
        if (!this.data.isInfoCardVisible){
          //基础信息展示
          Stack(){
            Column(){
              //模型展示
              Column(){
                Image(this.avatar)
                  .width(150)
                  .height(120)
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

              //信息展示
              Column({space:20}){
                //机械臂名称
                Row(){
                  Text('名称：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(20)
                    .fontColor(Color.White)
                  Text('机械臂003')
                    .fontColor(Color.White)
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //机械臂状态
                Row(){
                  Text('运作状态：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(20)
                    .fontColor(Color.White)
                  Text(this.data.statusText)
                    .fontColor(Color.White)
                  Circle()
                    .margin({left:10})
                    .width(16)
                    .height(16)
                    .fill(this.getStatusColor())
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //末端状态
                Row(){
                  Text('末端状态：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(20)
                    .fontColor(Color.White)
                  Text(this.data.endStatusText)
                    .fontColor(Color.White)
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //负载状态
                Row(){
                  Text('负载：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(20)
                    .fontColor(Color.White)
                  Text(this.data.loadText)
                    .fontColor(Color.White)
                  if (this.data.loadText==='有物品'){
                    Image($r('app.media.close_box'))
                      .width(20)
                      .height(20)
                      .margin({left:10})
                  }else {
                    Image($r('app.media.open_box'))
                      .width(20)
                      .height(20)
                      .margin({left:10})
                  }
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //控制按钮
                Row() {
                  if (this.data.statusText === '运行中'||this.data.statusText==='空闲中') {
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
                .backgroundColor(this.data.statusText === '运行中'||this.data.statusText==='空闲中' ? 'rgba(255, 80, 80, 0.4)' : 'rgba(0, 200, 83, 0.5)')
                .borderRadius(25)
                .border({
                  width: 1,
                  color: 'rgba(255, 255, 255, 0.3)'
                })
                .margin({ top: 20 })

                //使用辅助方法来动态设置阴影
                .shadow(this.getShadowOptions())

                //使用辅助方法来动态设置缩放
                .scale({
                  x: this.getScaleValue(),
                  y: this.getScaleValue()
                })

                //透明度只响应点击，不响应悬浮
                .opacity(this.isPressed ? 0.8 : 1.0)

                //添加 onHover 事件来更新 isHover 状态
                .onHover((isHover: boolean) => {
                  this.isHover = isHover;
                })

                //onTouch 事件保持不变
                .onTouch((event: TouchEvent) => {

                  event.stopPropagation()

                  if (event.type === TouchType.Down) {
                    this.isPressed = true;
                  }
                  if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.isPressed = false;

                    //判断当前状态，准备不同的对话框信息
                    const isCurrentlyRunning = this.data.statusText === '运行中'||this.data.statusText==='空闲中';
                    const message = isCurrentlyRunning ? '您确定要关闭二号机械臂吗？' : '您确定要启动二号机械臂吗？';

                    AlertDialog.show({
                      title: '操作确认',
                      message: message,
                      autoCancel: true, // 点击对话框外部可取消
                      alignment: DialogAlignment.Center,
                      buttons: [
                        {
                          value: '取消',
                          action: () => {
                            // 用户点击取消，不做任何事
                            console.info('操作已取消');
                          }
                        },
                        {
                          value: '确认',
                          fontColor: Color.Red, // 将确认按钮设为红色以示警示
                          action: () => {
                            if (isCurrentlyRunning) {
                              //创建一个新的、干净的 RobotArmState 实例
                              const newData = new RobotArmState();
                              //将这个全新的、准备好的对象赋值给 this.data
                              //因为原来的RobotArmState对象初始值就是关闭的状态
                              this.data = newData;
                              this.showSystemToast('关闭成功')

                              //关闭时清除定时器
                              if (this.idleTimer !== -1) {
                                clearTimeout(this.idleTimer);
                                this.idleTimer = -1;
                              }

                              this.addLog('warning', '关闭了二号传送带，停止了对二号传送带的操作。',true)

                            } else {
                              this.data.statusText = '空闲中';
                              this.showSystemToast('启动成功')
                              this.addLog('info', '启动了二号传送带，要对二号传送带进行操作。',true)
                            }
                          }
                        }
                      ]
                    });
                  }
                })

                //动画曲线作用于所有变化的属性（scale, shadow, opacity）
                .animation({ duration: 150, curve: Curve.EaseOut })

              }
              .width('100%')
              .height('70%')
              .alignItems(HorizontalAlign.Center)
              .justifyContent(FlexAlign.Center)
              .padding({left:10})
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
          .offset({ x: this.data.isInfoCardVisible ? '-120%' : 0 })
          .opacity(this.data.isInfoCardVisible ? 0 : 1)
        }else {
          Stack() {
            Column() {
              Row(){
                Text('抬起高度控制：')
                  .fontColor(Color.White)
              }
              .width('100%')
              //jump高度控制
              Row() {
                Row(){
                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.left_button'))
                      .width(this.button_icon_size2)
                      .height(this.button_icon_size2)
                  }
                  .width(this.button_size2)
                  .height(this.button_size2)
                  .backgroundColor(Color.Transparent) // 背景改为透明
                  .onClick(()=>{
                    this.activateArm()
                    this.decreaseSpeedJump();
                    this.resetIdleTimer()
                  })

                  Text('H-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size2)
                }

                Row() {
                  Text(this.data.jumpValue+' mm')
                    .fontSize(this.button_icon_size2)
                    .fontWeight(FontWeight.Bold)
                    .width(100)
                    .height(50)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor(Color.Transparent)
                }
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                Row(){
                  Text('H+')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size2)

                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.right_button'))
                      .width(this.button_icon_size2)
                      .height(this.button_icon_size2)
                  }
                  .width(this.button_size2)
                  .height(this.button_size2)
                  .backgroundColor(Color.Transparent)
                  .onClick(()=>{
                    this.activateArm()
                    this.increaseSpeedJump();
                    this.resetIdleTimer()
                  })
                }
              }
              .width(this.con_width2) // 控制条宽度
              .height(this.con_height2)   // 控制条高度
              .justifyContent(FlexAlign.SpaceBetween) // 两端对齐，中间自适应
              //为整个控制条应用磨砂玻璃风格
              .backgroundColor('rgba(255, 255, 255, 0.2)')
              .borderRadius(30) // 使用大的圆角形成“胶囊”形状
              .border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
              })
              .backdropBlur(8) // 添加磨砂效果
              .opacity(this.data.statusText === '运行中'||this.data.statusText==='空闲中' ? 1.0 : 0.4) // 运行时不透明，离线时半透明
              .enabled(this.data.statusText === '运行中'||this.data.statusText==='空闲中') // 运行时启用，离线时禁用交互
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              Row(){
                Text('方位控制：')
                  .fontColor(Color.White)
              }
              .width('100%')
              Row() {
                Row(){
                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.left_button'))
                      .width(this.button_icon_size2)
                      .height(this.button_icon_size2)
                  }
                  .width(this.button_size2)
                  .height(this.button_size2)
                  .backgroundColor(Color.Transparent) // 背景改为透明
                  .onClick(()=>{
                    this.activateArm()
                    this.decreaseSpeedZZ();
                    this.resetIdleTimer()
                  })

                  Text('Z-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size2)
                }

                //数值显示
                Row() {
                  Text(this.data.zzValue+' mm')
                    .fontSize(this.button_icon_size2)
                    .fontWeight(FontWeight.Bold)
                    .width(100)
                    .height(50)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor(Color.Transparent)
                }
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                Row(){
                  Text('Z+')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size2)

                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.right_button'))
                      .width(this.button_icon_size2)
                      .height(this.button_icon_size2)
                  }
                  .width(this.button_size2)
                  .height(this.button_size2)
                  .backgroundColor(Color.Transparent)
                  .onClick(()=>{
                    this.activateArm()
                    this.increaseSpeedZZ();
                    this.resetIdleTimer()
                  })
                }
              }
              .width(this.con_width2) // 控制条宽度
              .height(this.con_height2)   // 控制条高度
              .justifyContent(FlexAlign.SpaceBetween) // 两端对齐，中间自适应
              //为整个控制条应用磨砂玻璃风格
              .backgroundColor('rgba(255, 255, 255, 0.2)')
              .borderRadius(30) // 使用大的圆角形成“胶囊”形状
              .border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
              })
              .backdropBlur(8) // 添加磨砂效果
              .opacity(this.data.statusText === '运行中'||this.data.statusText==='空闲中' ? 1.0 : 0.4) // 运行时不透明，离线时半透明
              .enabled(this.data.statusText === '运行中'||this.data.statusText==='空闲中') // 运行时启用，离线时禁用交互
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              Row(){
                Text('角度控制：')
                  .fontColor(Color.White)
              }
              .width('100%')
              Row() {
                Row(){
                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.left_button'))
                      .width(this.button_icon_size2)
                      .height(this.button_icon_size2)
                  }
                  .width(this.button_size2)
                  .height(this.button_size2)
                  .backgroundColor(Color.Transparent) // 背景改为透明
                  .onClick(()=>{
                    this.activateArm()
                    this.decreaseSpeedRR();
                    this.resetIdleTimer()
                  })

                  Text('R-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size2)
                }

                //数值显示
                Row() {
                  Text(this.data.rrValue+' °')
                    .fontSize(this.button_icon_size2)
                    .fontWeight(FontWeight.Bold)
                    .width(100)
                    .height(50)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor(Color.Transparent)
                }
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                Row(){
                  Text('R+')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size2)

                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.right_button'))
                      .width(this.button_icon_size2)
                      .height(this.button_icon_size2)
                  }
                  .width(this.button_size2)
                  .height(this.button_size2)
                  .backgroundColor(Color.Transparent)
                  .onClick(()=>{
                    this.activateArm()
                    this.increaseSpeedRR();
                    this.resetIdleTimer()
                  })

                }
              }
              .width(this.con_width2) // 控制条宽度
              .height(this.con_height2)   // 控制条高度
              .justifyContent(FlexAlign.SpaceBetween) // 两端对齐，中间自适应
              //为整个控制条应用磨砂玻璃风格
              .backgroundColor('rgba(255, 255, 255, 0.2)')
              .borderRadius(30) // 使用大的圆角形成“胶囊”形状
              .border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
              })
              .backdropBlur(8) // 添加磨砂效果
              .opacity(this.data.statusText === '运行中'||this.data.statusText==='空闲中' ? 1.0 : 0.4) // 运行时不透明，离线时半透明
              .enabled(this.data.statusText === '运行中'||this.data.statusText==='空闲中') // 运行时启用，离线时禁用交互
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              //抓取释放按钮
              Button() {
                Row({ space: 10 }) {
                  // 根据状态显示不同文本
                  Text(this.data.endStatusText === '释放' ? '点击抓取' : '点击释放')
                    .fontSize(this.catch_font_size2)
                    .fontColor(Color.White)
                }
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)
              }
              .width(this.catch_size_width2) // 按钮宽度
              .height(this.catch_size_height2)   // 按钮高度
              .onClick(() => {
                this.activateArm()
                // 切换末端状态
                if (this.data.endStatusText === '释放') {
                  this.data.endStatusText = '抓取';
                  this.showSystemToast('末端已抓取');
                } else {
                  this.data.endStatusText = '释放';
                  this.showSystemToast('末端已释放');
                }
                this.resetIdleTimer()
              })
              // 沿用统一的磨砂玻璃风格
              .backgroundColor('rgba(255, 255, 255, 0.2)')
              .borderRadius(30)
              .border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)'
              })
              .backdropBlur(12)
              .opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8) // 根据机械臂状态决定是否可用
              .enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中') // 根据机械臂状态决定是否可交互
              .animation({ duration: 250, curve: Curve.EaseInOut })
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' })

              //停止按钮
              Button('停止')
                .width(this.catch_size_width2) // 按钮宽度
                .height(this.catch_size_height2)   // 按钮高度
                .fontSize(this.catch_font_size2)
                .fontColor(Color.White)
                .onClick(() => {
                })
                // 沿用统一的磨砂玻璃风格
                .backgroundColor('rgba(255, 255, 255, 0.2)')
                .borderRadius(30)
                .border({
                  width: 1.5,
                  color: 'rgba(255, 255, 255, 0.3)'
                })
                .backdropBlur(12)
                .opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8) // 根据机械臂状态决定是否可用
                .enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中') // 根据机械臂状态决定是否可交互
                .animation({ duration: 250, curve: Curve.EaseInOut })
                .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' })

              //急停按钮
              Button('急停')
                .width(this.catch_size_width2) // 按钮宽度
                .height(this.catch_size_height2)   // 按钮高度
                .fontSize(this.catch_font_size2)
                .fontColor(Color.White)
                .onClick(() => {

                })
                // 沿用统一的磨砂玻璃风格
                .backgroundColor('rgba(255, 255, 255, 0.2)')
                .borderRadius(30)
                .border({
                  width: 1.5,
                  color: 'rgba(255, 255, 255, 0.3)'
                })
                .backdropBlur(12)
                .opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8) // 根据机械臂状态决定是否可用
                .enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中') // 根据机械臂状态决定是否可交互
                .animation({ duration: 250, curve: Curve.EaseInOut })
                .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' })

            }
            .width('100%')
            .height('100%')
            .justifyContent(FlexAlign.SpaceAround)
            .alignItems(HorizontalAlign.Center)
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
          //宽度使用动态状态变量
          .width('30%')
          .height('100%')
          .clip(true)
          .offset({ x: this.data.isInfoCardVisible ? 0 : '-120%' })
          .opacity(this.data.isInfoCardVisible ? 1 : 0)
        }

        //控制区域
        Stack({ alignContent: Alignment.TopEnd }){
          // 根据 isRegionAVisible 的值，决定显示按钮调节还是量角器调节
          if (this.data.isRegionAVisible) {
            Stack() {
              Column() {
                RoboticArmWorkRangeView({
                  data:this.data,
                  onActivate: this.activateArm.bind(this)
                })
              }
              .width('100%')
              .height('100%')
              .justifyContent(FlexAlign.Center)
              .alignItems(HorizontalAlign.Center)
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
            .clip(true)
          } else {
            // 原有的控制面板UI
            Column({space:15}){
              Row({space:40}){
                Text('方位控制：')
                  .fontColor(Color.White)

                //步长设置
                Row(){
                  Text('设置步长(mm)：')
                    .fontColor(Color.White)
                  TextInput({ text: this.data.step_xyz + ' mm' })
                    .type(InputType.Number)
                    .width(120)
                    .height(30)
                    .fontSize(12)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor('rgba(255, 255, 255, 0.2)')
                    .borderRadius(20)
                    .onChange((value: string) => {
                      const num = parseInt(value, 10);
                      // 步长必须是大于等于1的有效数字
                      if (!isNaN(num) && num >= 1) {
                        this.data.step_xyz = num;
                      } else {
                        // 如果输入不合法（如0、负数、文本），则恢复为1
                        this.data.step_xyz = 5;
                      }
                    })
                }

              }
              .width('100%')
              .opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4) // 根据机械臂状态决定是否可用
              .enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中') // 根据机械臂状态决定是否可交互

              //控制x轴（左右）
              Row() {
                Row(){
                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.left_button'))
                      .width(this.button_icon_size)
                      .height(this.button_icon_size)
                  }
                  .width(this.button_size)
                  .height(this.button_size)
                  .backgroundColor(Color.Transparent) //背景改为透明
                  .onClick(()=>{
                    this.activateArm(); //激活机械臂
                    this.decreaseSpeedX();
                    this.resetIdleTimer()
                  })
                  Text('X-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)
                }
                //数值显示
                Row() {
                  Text(this.data.xValue+' mm')
                    .fontSize(this.button_icon_size)
                    .fontWeight(FontWeight.Bold)
                    .width(150)
                    .height(50)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor(Color.Transparent)
                }
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                Row(){
                  Text('X+')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)

                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.right_button'))
                      .width(this.button_icon_size)
                      .height(this.button_icon_size)
                  }
                  .width(this.button_size)
                  .height(this.button_size)
                  .backgroundColor(Color.Transparent)
                  .onClick(()=>{
                    this.activateArm()
                    this.increaseSpeedX()
                    this.resetIdleTimer()
                  })
                }
              }
              .width(this.con_width) // 控制条宽度
              .height(this.con_height)   // 控制条高度
              .justifyContent(FlexAlign.SpaceBetween) // 两端对齐，中间自适应
              //为整个控制条应用磨砂玻璃风格
              .backgroundColor('rgba(255, 255, 255, 0.2)')
              .borderRadius(30) // 使用大的圆角形成“胶囊”形状
              .border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
              })
              .backdropBlur(8) // 添加磨砂效果
              .opacity(this.data.statusText === '运行中'||this.data.statusText==='空闲中' ? 1.0 : 0.4) // 运行时不透明，离线时半透明
              .enabled(this.data.statusText === '运行中'||this.data.statusText==='空闲中') // 运行时启用，离线时禁用交互
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              //y控制（前后）
              Row() {
                Row(){
                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.left_button'))
                      .width(this.button_icon_size)
                      .height(this.button_icon_size)
                  }
                  .width(this.button_size)
                  .height(this.button_size)
                  .backgroundColor(Color.Transparent) //背景改为透明
                  .onClick(()=>{
                    this.activateArm()
                    this.decreaseSpeedY();
                    this.resetIdleTimer()
                  })

                  Text('Y-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)
                }

                //数值显示
                Row() {
                  Text(this.data.yValue+' mm')
                    .fontSize(this.button_icon_size)
                    .fontWeight(FontWeight.Bold)
                    .width(150)
                    .height(50)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor(Color.Transparent)
                }
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                Row(){
                  Text('Y+')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)

                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.right_button'))
                      .width(this.button_icon_size)
                      .height(this.button_icon_size)
                  }
                  .width(this.button_size)
                  .height(this.button_size)
                  .backgroundColor(Color.Transparent)
                  .onClick(()=>{
                    this.activateArm()
                    this.increaseSpeedY();
                    this.resetIdleTimer()
                  })
                }
              }
              .width(this.con_width) // 控制条宽度
              .height(this.con_height)   // 控制条高度
              .justifyContent(FlexAlign.SpaceBetween) // 两端对齐，中间自适应
              //为整个控制条应用磨砂玻璃风格
              .backgroundColor('rgba(255, 255, 255, 0.2)')
              .borderRadius(30) // 使用大的圆角形成“胶囊”形状
              .border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
              })
              .backdropBlur(8) // 添加磨砂效果
              .opacity(this.data.statusText === '运行中'||this.data.statusText==='空闲中' ? 1.0 : 0.4) // 运行时不透明，离线时半透明
              .enabled(this.data.statusText === '运行中'||this.data.statusText==='空闲中') // 运行时启用，离线时禁用交互
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              //z轴控制（上下）
              Row() {
                Row(){
                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.left_button'))
                      .width(this.button_icon_size)
                      .height(this.button_icon_size)
                  }
                  .width(this.button_size)
                  .height(this.button_size)
                  .backgroundColor(Color.Transparent) // 背景改为透明
                  .onClick(()=>{
                    this.activateArm()
                    this.decreaseSpeedZ();
                    this.resetIdleTimer()
                  })
                  Text('Z-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)
                }

                //数值显示
                Row() {
                  Text(this.data.zValue+' mm')
                    .fontSize(this.button_icon_size)
                    .fontWeight(FontWeight.Bold)
                    .width(150)
                    .height(50)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor(Color.Transparent)
                }
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                Row(){
                  Text('Z+')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)

                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.right_button'))
                      .width(this.button_icon_size)
                      .height(this.button_icon_size)
                  }
                  .width(this.button_size)
                  .height(this.button_size)
                  .backgroundColor(Color.Transparent)
                  .onClick(()=>{
                    this.activateArm()
                    this.increaseSpeedZ();
                    this.resetIdleTimer()
                  })
                }
              }
              .width(this.con_width) // 控制条宽度
              .height(this.con_height)   // 控制条高度
              .justifyContent(FlexAlign.SpaceBetween) // 两端对齐，中间自适应
              //为整个控制条应用磨砂玻璃风格
              .backgroundColor('rgba(255, 255, 255, 0.2)')
              .borderRadius(30) // 使用大的圆角形成“胶囊”形状
              .border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
              })
              .backdropBlur(8) // 添加磨砂效果
              .opacity(this.data.statusText === '运行中'||this.data.statusText==='空闲中' ? 1.0 : 0.4) // 运行时不透明，离线时半透明
              .enabled(this.data.statusText === '运行中'||this.data.statusText==='空闲中') // 运行时启用，离线时禁用交互
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              Row({space:40}){
                Text('角度控制：')
                  .fontColor(Color.White)

                //步长设置
                Row(){
                  Text('设置步长(mm)：')
                    .fontColor(Color.White)
                  TextInput({ text: this.data.step_r + '' })
                    .type(InputType.Number)
                    .width(120)
                    .height(30)
                    .fontSize(12)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor('rgba(255, 255, 255, 0.2)')
                    .borderRadius(20)
                    .onChange((value: string) => {
                      const num = parseInt(value, 10);
                      // 步长必须是大于等于1的有效数字
                      if (!isNaN(num) && num >= 1) {
                        this.data.step_xyz = num;
                      } else {
                        // 如果输入不合法（如0、负数、文本），则恢复为1
                        this.data.step_xyz = 5;
                      }
                    })
                }

              }
              .width('100%')
              .opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4) // 根据机械臂状态决定是否可用
              .enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中') // 根据机械臂状态决定是否可交互

              //r轴控制（角度）
              Row() {
                Row(){
                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.left_button'))
                      .width(this.button_icon_size)
                      .height(this.button_icon_size)
                  }
                  .width(this.button_size)
                  .height(this.button_size)
                  .backgroundColor(Color.Transparent) // 背景改为透明
                  .onClick(()=>{
                    this.activateArm()
                    this.decreaseSpeedR();
                    this.resetIdleTimer()
                  })
                  Text('R-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)
                }
                //数值显示
                Row() {
                  Text(this.data.rValue+' °')
                    .fontSize(this.button_icon_size)
                    .fontWeight(FontWeight.Bold)
                    .width(150)
                    .height(50)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor(Color.Transparent)
                }
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                Row(){
                  Text('R+')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)

                  Button({ type: ButtonType.Circle, stateEffect: true }) {
                    Image($r('app.media.right_button'))
                      .width(this.button_icon_size)
                      .height(this.button_icon_size)
                  }
                  .width(this.button_size)
                  .height(this.button_size)
                  .backgroundColor(Color.Transparent)
                  .onClick(()=>{
                    this.activateArm()
                    this.increaseSpeedR();
                    this.resetIdleTimer()
                  })
                }
              }
              .width(this.con_width) // 控制条宽度
              .height(this.con_height)   // 控制条高度
              .justifyContent(FlexAlign.SpaceBetween) // 两端对齐，中间自适应
              //为整个控制条应用磨砂玻璃风格
              .backgroundColor('rgba(255, 255, 255, 0.2)')
              .borderRadius(30) // 使用大的圆角形成“胶囊”形状
              .border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
              })
              .backdropBlur(8) // 添加磨砂效果
              .opacity(this.data.statusText === '运行中'||this.data.statusText==='空闲中' ? 1.0 : 0.4) // 运行时不透明，离线时半透明
              .enabled(this.data.statusText === '运行中'||this.data.statusText==='空闲中') // 运行时启用，离线时禁用交互
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              Row(){
                Text('状态控制：')
                  .fontColor(Color.White)
              }
              .opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4) // 根据机械臂状态决定是否可用
              .enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中') // 根据机械臂状态决定是否可交互
              .width('100%')

              Row({space:10}){
                //抓取释放按钮
                Button() {
                  Row({ space: 10 }) {
                    // 根据状态显示不同文本
                    Text(this.data.endStatusText === '释放' ? '点击抓取' : '点击释放')
                      .fontSize(this.catch_font_size)
                      .fontColor(Color.White)
                  }
                  .justifyContent(FlexAlign.Center)
                  .alignItems(VerticalAlign.Center)
                }
                .width(this.catch_size_width) // 按钮宽度
                .height(this.catch_size_height)   // 按钮高度
                .onClick(() => {
                  this.activateArm()
                  // 切换末端状态
                  if (this.data.endStatusText === '释放') {
                    this.data.endStatusText = '抓取';
                    this.showSystemToast('末端已抓取');
                  } else {
                    this.data.endStatusText = '释放';
                    this.showSystemToast('末端已释放');
                  }
                  this.resetIdleTimer()
                })
                // 沿用统一的磨砂玻璃风格
                .backgroundColor('rgba(255, 255, 255, 0.2)')
                .borderRadius(30)
                .border({
                  width: 1.5,
                  color: 'rgba(255, 255, 255, 0.3)'
                })
                .backdropBlur(12)
                .opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8) // 根据机械臂状态决定是否可用
                .enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中') // 根据机械臂状态决定是否可交互
                .animation({ duration: 250, curve: Curve.EaseInOut })
                .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' })

                //停止按钮
                Button('停止')
                  .width(this.catch_size_width) // 按钮宽度
                  .height(this.catch_size_height)   // 按钮高度
                  .fontSize(this.catch_font_size)
                  .fontColor(Color.White)
                  .onClick(() => {

                  })
                  // 沿用统一的磨砂玻璃风格
                  .backgroundColor('rgba(255, 255, 255, 0.2)')
                  .borderRadius(30)
                  .border({
                    width: 1.5,
                    color: 'rgba(255, 255, 255, 0.3)'
                  })
                  .backdropBlur(12)
                  .opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8) // 根据机械臂状态决定是否可用
                  .enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中') // 根据机械臂状态决定是否可交互
                  .animation({ duration: 250, curve: Curve.EaseInOut })
                  .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' })

                //急停按钮
                Button('急停')
                  .width(this.catch_size_width) // 按钮宽度
                  .height(this.catch_size_height)   // 按钮高度
                  .fontSize(this.catch_font_size)
                  .fontColor(Color.White)
                  .onClick(() => {

                  })
                  // 沿用统一的磨砂玻璃风格
                  .backgroundColor('rgba(255, 255, 255, 0.2)')
                  .borderRadius(30)
                  .border({
                    width: 1.5,
                    color: 'rgba(255, 255, 255, 0.3)'
                  })
                  .backdropBlur(12)
                  .opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8) // 根据机械臂状态决定是否可用
                  .enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中') // 根据机械臂状态决定是否可交互
                  .animation({ duration: 250, curve: Curve.EaseInOut })
                  .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' })
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceAround)

            }
            .justifyContent(FlexAlign.SpaceAround)
            .width('100%')
            .height('100%')
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

          //切换按钮
          ActionButton({
            // 请替换为您的图标资源
            icon: $r('app.media.change'),
            click: () => {
              animateTo({ duration: 800, curve: Curve.EaseInOut }, () => {
                this.data.isRegionAVisible=!this.data.isRegionAVisible
                this.data.isInfoCardVisible=!this.data.isInfoCardVisible
              });
            }
          })
            .position({top:10,right:10})
            .enabled(this.data.statusText === '运行中'||this.data.statusText === '空闲中')
            .opacity(this.data.statusText === '运行中'||this.data.statusText === '空闲中' ? 1.0 : 0.4)
        }
        .width(this.data.controlCardWidth)
        .height('100%')
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

//组件无需修改
@Component
struct ActionButton {
  private icon!: Resource;
  private click!: () => void;
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