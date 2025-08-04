
import { McGaugeChart, Options } from '@mcui/mccharts'
import { ConveyorState } from '../../model/ConveyorState'
import { Server, Node,Data } from '../../model/ServerState';
import { promptAction } from '@kit.ArkUI';
import { getNodeOther,setConveyorSpeed,openConveyor,closeConveyor,setConveyorDirection,setConveyorStop,
  getConveyorSpeed } from '../../service/Request';
import { AxiosResponse } from '@ohos/axios';

@Component
export struct Conveyor2 {

  addLog: (level: 'info' | 'warning' | 'error', message: string,shouldSave:boolean) => void = () => {};

  @Link @Watch('onDataChange') data:ConveyorState;

  @State private lastKnownSpeed: number = 0;

  @Link avatar:Resource

  private readonly MAX_SPEED: number = 3000;
  private readonly START_SPEED: number = 800;
  private readonly MIN_ADJUSTABLE_SPEED: number = 800;

  private rawSpeedToPercentage(rawSpeed: number): number {
    if (rawSpeed <= 0) return 0;
    return Math.round((rawSpeed / this.MAX_SPEED) * 100);
  }

  private percentageToRawSpeed(percentage: number): number {
    const rawSpeed = (percentage / 100) * this.MAX_SPEED;
    return Math.round(rawSpeed);
  }


  @Prop @Watch('onNodeChange') node:Data={id:'',node_id:''}

  @State private hasLoaded: boolean = false

  @State private getSpeedNode:string=''

  @State private setSpeedNode:string=''

  @State private openNode:string=''

  @State private  setCloseModelNode:string=''

  @State private  closeNode:string=''

  @State private setDirectionNode:string=''

  //获取传送带速度
  async getSpeed(): Promise<void>{
    if (this.node.id&&this.node.node_id&&this.getSpeedNode){
      const res:AxiosResponse|null=await getConveyorSpeed(this.node.id,this.getSpeedNode)
      if (!res) {
        promptAction.showToast({message:'首次获取传送带速度失败'})
      }else if (res.data.code!==0){
        promptAction.showToast({message:'首次获取传送带速度失败'})
      }else {
        if (res.data.data.value>0) {
          this.data.statusText='运行中'
          this.data.speedValue=this.rawSpeedToPercentage(res.data.data.value)
        }
      }
    }else {
      promptAction.showToast({message:'首次获取传送带速度失败'})
    }
  }

  //设置传送带速度
  async setSpeed(action:number): Promise<boolean>{
    if (this.node.id&&this.node.node_id&&this.setSpeedNode){
      const res:AxiosResponse|null=await setConveyorSpeed(this.node.id,this.setSpeedNode,action+'')
      return res?.data.code===0//为0的话就是设置成功
    }else {
      return false
    }
  }

  //启动传送带
  async open(): Promise<boolean>{
    if (this.node.id&&this.node.node_id&&this.openNode){
      const res:AxiosResponse|null=await openConveyor(this.node.id,this.openNode)
      return res?.data.code===0
    }else {
      return false
    }
  }

  //设置关闭模式
  async setCloseModel(action:number): Promise<boolean>{
    if (this.node.id&&this.node.node_id&&this.setCloseModelNode){
      const res:AxiosResponse|null=await setConveyorStop(this.node.id,this.setCloseModelNode,action+'')
      return res?.data.code===0
    }else {
      return false
    }
  }

  //关闭传送带
  async close(): Promise<boolean>{
    if (this.node.id&&this.node.node_id&&this.closeNode){
      const res:AxiosResponse|null=await closeConveyor(this.node.id,this.closeNode)
      return res?.data.code===0
    }else {
      return false
    }
  }

  //设置运动方向
  async setDirection(action:number): Promise<boolean>{
    if (this.node.id&&this.node.node_id&&this.setDirectionNode){
      const res:AxiosResponse|null=await setConveyorDirection(this.node.id,this.setDirectionNode,action+'')
      return res?.data.code===0
    }else {
      return false
    }
  }

  async onNodeChange(): Promise<void>{
    if (this.node.id&&this.node.node_id&& !this.hasLoaded) {
      const nodes1:Node[]|null=await getNodeOther(this.node.id,this.node.node_id)
      if (nodes1&&nodes1.length>0) {
        //先获取传送带控制结点的node_id
        const nodes3:Node[]|null=await getNodeOther(this.node.id,nodes1[2].node_id)
        if (nodes3&&nodes3.length>0) {
          this.openNode=nodes3[1].node_id
          this.closeNode=nodes3[2].node_id
          this.setSpeedNode=nodes3[3].node_id
          this.setDirectionNode=nodes3[4].node_id
          this.setCloseModelNode=nodes3[5].node_id
        }
        //再获取传送带的速度结点的node_id
        const nodes4:Node[]|null=await getNodeOther(this.node.id,nodes1[1].node_id)
        if (nodes4&&nodes4.length>0) {
          this.getSpeedNode=nodes4[1].node_id
        }
      }
    }
    this.hasLoaded=true
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

  private getStatusColor(): Color {
    switch (this.data.statusText) {
      case '运行中':
        return Color.Orange;
      case '离线中':
        return Color.Gray;
      default:
        return Color.Gray;
    }
  }

  // 用于控制按钮按压动画的状态
  @State isPressed: boolean = false;
  //用于追踪鼠标悬浮状态
  @State isHover: boolean = false;

  //仪表盘的显示与隐藏控制器
  @State isChartVisible: boolean=false;

  @Prop @Watch('onActiveChange') isActive: boolean = false;

  onActiveChange() {
    if (this.isActive) {
      // 当组件从非激活变为激活时，播放动画
      this.playEntryAnimation();
    } else {
      // 当组件变为非激活时，重置状态
      this.isChartVisible = false;
    }
  }

  // 新增：将动画逻辑封装成一个独立的私有方法，供多处调用
  private playEntryAnimation() {
    // 立即将图表设为不可见，为播放动画做准备
    this.isChartVisible = false;
    // 使用延时确保UI更新
    setTimeout(() => {
      this.isChartVisible = true;
    }, 50);
  }

  //根据状态计算缩放值
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

  //根据状态计算阴影效果
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

  @State speedInputText: string = '0';
  @State chartOptions: Options = new Options({})

  // 用于存放长按时启动的定时器ID
  @State private holdTimer: number = -1;

  handleSpeedValueUpdate() {
    // 在这里统一分发任务
    this.onSpeedChange();      // 更新图表
    this.syncInputText();    // 更新文本输入框
  }

  private commitSpeedInput() {
    let num = parseInt(this.speedInputText, 10);
    // 计算800对应的百分比下限
    const minPercentage = this.rawSpeedToPercentage(this.MIN_ADJUSTABLE_SPEED);

    if (isNaN(num)) {
      this.syncInputText();
    } else {
      // 修改：限制速度范围在 minPercentage 到 100 之间
      this.data.speedValue = Math.min(100, Math.max(minPercentage, num));
    }
  }

  // 增加速度的辅助方法
  private increaseSpeed() {
    if (this.data.speedValue < 100) {
      this.data.speedValue++;
    } else {
      // 如果已达最大值，清除定时器
      if (this.holdTimer !== -1) {
        clearInterval(this.holdTimer);
        this.holdTimer = -1;
      }
    }
  }

  // 减少速度的辅助方法
  private decreaseSpeed() {
    // 计算800对应的百分比下限
    const minPercentage = this.rawSpeedToPercentage(this.MIN_ADJUSTABLE_SPEED);
    // 只有当速度高于下限时，才允许减少
    if (this.data.speedValue > minPercentage) {
      this.data.speedValue--;
    } else {
      // 如果已达最小值，清除定时器
      if (this.holdTimer !== -1) {
        clearInterval(this.holdTimer);
        this.holdTimer = -1;
      }
    }
  }

  syncInputText() {
    this.speedInputText = this.data.speedValue.toFixed(0);
  }

  onSpeedChange() {
    const chartValue = this.data.speedValue === 0 ? 0.01 : this.data.speedValue;
    this.chartOptions.setVal({
      series: [
        {
          data: [
            {
              value: chartValue,
              gradient: ['#11998e' , '#38ef7d']
            }
          ]
        }
      ]
    })
  }

  async aboutToAppear() {
    //加上await的原因是等onNodeChange中的请求执行完毕再执行getSpeed中的请求
    await this.onNodeChange()
    await this.getSpeed()
    this.lastKnownSpeed = this.data.speedValue;
    this.speedInputText = this.data.speedValue.toFixed(0);
    this.initChartOptions();
    this.updateChart();
    if (this.isActive) {
      this.playEntryAnimation();
    }
  }

  private initChartOptions() {
    this.chartOptions = new Options({
      series: [
        {
          // 设置仪表盘的起始和结束角度，形成一个非完整的环形
          startAngle: -(Math.PI / 4) * 5,
          endAngle: Math.PI / 4,

          // 设置仪表盘的数值范围
          min: 0,
          max: 100,

          // 设置主要的刻度分割数量
          splitNum: 11,

          // 设置进度条（彩色弧线）的宽度
          arcLineWidth: 15,

          // 初始化图表的数值数据
          data: [
            {
              name: '速度',
              // 注意：这里的 value 会在 aboutToAppear 中被 updateChart() 再次更新
              value: this.data.speedValue,
              // 设置进度条的渐变色
              gradient: ['#11998e' , '#38ef7d']
            }
          ],

          // 配置轴刻度线（白色的小短线）
          axisTick: {
            show: true,
            style: { lineWidth: 3, stroke: '#ffffffff' }
          },

          // 配置轴标签（例如 "0%", "10%" 等文字）
          axisLabel: {
            show: true,
            formatter: (label: string) => `${label}%`, // 为标签添加 '%' 后缀
            style: { fontSize: 16, fill: '#ffffffff' }
          },

          // 配置指针（中间的指示针）
          pointer: {
            show: true,
            style: {
              color: '#1890ff' // 设置指针颜色
            }
          },

          // 隐藏仪表盘中心默认的文字详情
          details: {
            show: false
          },

          // 配置背景弧线（进度条底下的灰色弧线）
          backgroundArc: {
            show: true,
            style: {
              stroke: '#ffd0d0d0', // 背景为浅灰色
              lineWidth: 15
            }
          }
        }
      ]
    })
  }

  async onDataChange() {
    if (this.data.speedValue !== this.lastKnownSpeed) {

      // 只有速度真的变了，才执行核心逻辑
      this.updateChart();
      this.syncInputText();

      if (this.data.statusText === '运行中' && this.data.speedValue > 0) {
        const rawSpeed = this.percentageToRawSpeed(this.data.speedValue);
        await this.setSpeed(rawSpeed)
      }

      //执行完逻辑后，千万不要忘记更新 "lastKnownSpeed" 的值！
      this.lastKnownSpeed = this.data.speedValue;
    }
  }

  updateChart() {
    const chartValue = this.data.speedValue === 0 ? 0.01 : this.data.speedValue;
    this.chartOptions.setVal({
      series: [{ data: [{ value: chartValue, gradient: ['#11998e' , '#38ef7d'] }] }]
    })
  }

  //用于控制图片预览是否显示的状态变量
  @State isPreviewVisible: boolean = false;

  //预览层
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
      Image($r('app.media.conveyor'))
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
      Row({space:20}) {
        //基础信息卡片
        Column() {
          Column(){
            Image(this.avatar)
              .width(150)
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

          Column({space:20}){
            //传送带名称
            Row(){
              Text('名称：')
                .fontWeight(FontWeight.Bold)
                .fontSize(20)
                .fontColor(Color.White)
              Text('传送带002')
                .fontColor(Color.White)
            }
            .width('100%')
            .justifyContent(FlexAlign.Center)
            .alignItems(VerticalAlign.Center)

            //传送带状态
            Row(){
              Text('状态：')
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

            //传送带速度
            Row(){
              Text('运行速度：')
                .fontWeight(FontWeight.Bold)
                .fontSize(20)
                .fontColor(Color.White)
              Text(this.data.speedValue+'  %')
                .fontColor(Color.White)
            }
            .width('100%')
            .justifyContent(FlexAlign.Center)
            .alignItems(VerticalAlign.Center)

            //传送带负载状态
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

            //控制按钮 (已添加点击和悬浮动画)
            Row() {
              if (this.data.statusText === '运行中') {
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
            .backgroundColor(this.data.statusText === '运行中' ? 'rgba(255, 80, 80, 0.4)' : 'rgba(0, 200, 83, 0.5)')
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
                const isCurrentlyRunning = this.data.statusText === '运行中';
                const message = isCurrentlyRunning ? '您确定要停止二号传送带吗？' : '您确定要启动二号传送带吗？';

                //显示确认对话框
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
                      }
                    },
                    {
                      value: '确认',
                      fontColor: Color.Red, // 将确认按钮设为红色以示警示
                      action: async () => {
                        if (isCurrentlyRunning) {
                          const isClose:boolean=await this.close()
                          if (isClose) {
                            this.data.speedValue=0
                            this.data.statusText='离线中'
                            this.showSystemToast('关闭成功')
                            this.addLog('warning', '关闭了二号传送带，停止了对二号传送带的操作。',true)
                          }else {
                            this.showSystemToast('关闭失败')
                          }
                        } else {
                          const isRun1:boolean=await this.setSpeed(this.START_SPEED)
                          const isRun2:boolean=await this.open()
                          if (isRun1&&isRun2) {
                            this.data.speedValue = this.rawSpeedToPercentage(this.START_SPEED)
                            this.data.statusText='运行中'
                            this.showSystemToast('启动成功')
                            this.addLog('info', '启动了二号传送带，要对二号传送带进行操作。',true)
                          }else {
                            this.showSystemToast('启动失败')
                          }
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
        .width('30%')
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

        //速度调节卡片
        Column({space:10}){
          if (this.isChartVisible) {
            McGaugeChart({ options: this.chartOptions })
              .height(300)
              .width(320)
              // 使用 .combine() 组合动画，这是正确的写法
              .transition(
                // 创建一个从完全透明开始的动画效果
                TransitionEffect.opacity(0)
                // 将其与一个从90%大小开始的缩放效果组合起来
                  .combine(TransitionEffect.scale({ x: 0.9, y: 0.9 }))
                  // 为这个组合后的动画效果统一设置时长和曲线
                  .animation({
                    duration: 400,
                    curve: Curve.EaseOut
                  })
              )
          }


          Row(){
            //选择传送带运动方向
            Select([
              { value: '正向运行' },
              { value: '反向运行' }
            ])
              .optionWidth(90)
              .menuBackgroundBlurStyle(BlurStyle.COMPONENT_ULTRA_THICK)
              .menuBackgroundColor(Color.Transparent)
              .onSelect(async (event) => {
                const newDirection = event.valueOf() === 0 ? '正向运行' : '反向运行';
                const isSet:boolean= await this.setDirection(event.valueOf())
                if (isSet){
                  this.showSystemToast('设置运行方向成功')
                }else {
                  this.showSystemToast('设置运行方向失败')
                }
                if (this.data.direction !== newDirection) {
                  this.data.direction = newDirection;
                }
              })
              .selected(this.data.direction === '正向运行' ? 0 : 1)
              .value(this.data.direction)
              .width('40%')
              .height(50)
              .backgroundColor('rgba(255, 255, 255, 0.2)')
              .borderRadius(25)
              .fontColor(Color.White)
              .border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)'
              })
              // 同样，只有在运行时才启用，并有透明度变化
              .enabled(this.data.statusText === '离线中')
              .opacity(this.data.statusText === '离线中' ? 1.0 : 0.4)
              .animation({ duration: 250, curve: Curve.EaseInOut })

            Select([
              { value: '正常停止' },
              { value: '急停' }
            ])
              .optionWidth(180)
              .menuBackgroundBlurStyle(BlurStyle.COMPONENT_ULTRA_THICK)
              .menuBackgroundColor(Color.Transparent)
              .onSelect(async (event) => {
                const newStopMethod = event.valueOf() === 0 ? '正常停止' : '急停';
                const isSet:boolean= await this.setCloseModel(event.valueOf())
                if (isSet){
                  this.showSystemToast('设置停止模式成功')
                }else {
                  this.showSystemToast('设置停止模式失败')
                }
                if (this.data.stopMethod !== newStopMethod) {
                  this.data.stopMethod = newStopMethod
                }
              })
              .selected(this.data.direction === '正常停止' ? 0 : 1)
              .value(this.data.stopMethod)
              .width('40%')
              .height(50)
              .backgroundColor('rgba(255, 255, 255, 0.2)')
              .borderRadius(25)
              .fontColor(Color.White) // 设置选中项的字体颜色
              .border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)'
              })
              // 同样，只有在运行时才启用，并有透明度变化
              .enabled(this.data.statusText === '运行中')
              .opacity(this.data.statusText === '运行中' ? 1.0 : 0.4)
              .animation({ duration: 250, curve: Curve.EaseInOut })
          }
          .width('100%')
          .justifyContent(FlexAlign.SpaceAround)


          Row() {
            // 减速按钮
            Button({ type: ButtonType.Circle, stateEffect: true }) {
              Text('-').fontSize(26).fontWeight(FontWeight.Bold).fontColor(Color.White) // 字体改为白色
            }
            .width(50)
            .height(50)
            .backgroundColor(Color.Transparent) // 背景改为透明
            .onTouch((event: TouchEvent) => {

              event.stopPropagation()

              if (event.type === TouchType.Down) {
                this.decreaseSpeed();
                this.holdTimer = setInterval(() => { this.decreaseSpeed(); }, 120);
              }
              if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                clearInterval(this.holdTimer);
                this.holdTimer = -1;
              }
            })

            // 当前速度值显示
            Row() {
              TextInput({ text: this.speedInputText })
                .type(InputType.Number)
                .maxLength(3)
                .fontSize(28)
                .fontWeight(FontWeight.Bold)
                .width(85)
                .height(50)
                .fontColor(Color.White) // 字体改为白色
                .textAlign(TextAlign.Center)
                .backgroundColor(Color.Transparent)
                .onChange((value: string) => { this.speedInputText = value; })
                .onSubmit(() => { this.commitSpeedInput(); })
                .onBlur(() => { this.commitSpeedInput(); })

              Text('%')
                .fontSize(28)
                .fontWeight(FontWeight.Bold)
                .fontColor(Color.White)

            }
            .justifyContent(FlexAlign.Center)
            .alignItems(VerticalAlign.Center)

            // 加速按钮
            Button({ type: ButtonType.Circle, stateEffect: true }) {
              Text('+').fontSize(28).fontWeight(FontWeight.Bold).fontColor(Color.White) // 字体改为白色
            }
            .width(50)
            .height(50)
            .backgroundColor(Color.Transparent) //背景改为透明
            .onTouch((event: TouchEvent) => {

              event.stopPropagation()

              if (event.type === TouchType.Down) {
                this.increaseSpeed();
                this.holdTimer = setInterval(() => { this.increaseSpeed(); }, 120);
              }
              if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                clearInterval(this.holdTimer);
                this.holdTimer = -1;
              }
            })
          }
          .width('90%') // 控制条宽度
          .height(60)   // 控制条高度
          .justifyContent(FlexAlign.SpaceBetween) // 两端对齐，中间自适应
          //为整个控制条应用磨砂玻璃风格
          .backgroundColor('rgba(255, 255, 255, 0.2)')
          .borderRadius(30) // 使用大的圆角形成“胶囊”形状
          .border({
            width: 1.5,
            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
          })
          .backdropBlur(8) // 添加磨砂效果
          .opacity(this.data.statusText === '运行中' ? 1.0 : 0.4) // 运行时不透明，离线时半透明
          .enabled(this.data.statusText === '运行中') // 运行时启用，离线时禁用交互
          .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
          .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影
        }
        .width('65%')
        .height('100%')
        .backdropBlur(12)
        .backgroundColor('rgba(10, 10, 15, 0.3)')
        .borderRadius(16)
        // 添加清晰的轮廓线
        .border({
          width: 1.5,
          color: 'rgba(255, 255, 255, 0.15)'
        })
        // 添加柔和的背景光晕
        .shadow({
          radius: 30,
          color: 'rgba(173, 216, 230, 0.2)',
          offsetX: 0,
          offsetY: 0
        })
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