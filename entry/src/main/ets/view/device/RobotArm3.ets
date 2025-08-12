import { RobotArmState,Point } from '../../model/RobotArmState'
import { RoboticArmWorkRangeView } from '../../components/RoboticArmWorkRangeView'
import { Server, Node,Data } from '../../model/ServerState'
import {
  clearEndAble,
  clearRobotArmAlarms,
  endControl,
  getEndStatus,
  getNodeOther, getRobotArmAlarms,
  getRobotArmNowPosition,
  getRobotArmTime, getRobotArmUid,
  jumpRobotArmMove,
  setEndAble,
  setRobotArmMove,
  setStop,
  setToStart} from '../../service/Request';

@Component
export struct RobotArm3 {

  @State redrawTrigger: number = 0;

  addLog: (level: 'info' | 'warning' | 'error', message: string,shouldSave:boolean) => void = () => {};

  @Link data:RobotArmState;
  @Link avatar:Resource;

  @State stepInputText_xyz: string = '5'
  @State stepInputText_r: string = '5'
  @State stepInputText_jump:string='5'
  @State stepInputText_zz:string='5'
  @State stepInputText_rr:string='5'


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

  //序列号
  @State sn:string='DT1420071876'
  //固定版本
  @State version:string='3.7.0'
  //系统时钟
  @State time:number=0
  //设备uid
  @State uid:string=''
  //设备警报
  @State alarms:number=0
  //使能
  @State endAbled:boolean=false
  @State node_id_endAbled:string=''
  //末端执行
  @State node_id_end:string=''
  //设置回零
  @State node_id_toStart:string=''
  //设置急停
  @State node_id_stop:string=''
  //获取当前位姿
  @State node_id_nowPosition:string=''
  //机械臂移动
  @State node_id_move:string=''
  //机械臂jump移动
  @State node_id_jump:string=''
  //是否抓取
  @State isCatch:boolean=false
  //是否点击移动
  @State isMove:boolean=false

  @Prop @Watch('onNodeChange') node:Data={id:'',node_id:''}

  async onNodeChange(): Promise<void>{
    if (this.node.id&&this.node.node_id){
      //先找到机械臂下的所有结点
      const nodes:Node[]|null=await getNodeOther(this.node.id,this.node.node_id)
      if (nodes&&nodes.length>0) {
        //获取设备信息
        const infoNodes:Node[]|null=await getNodeOther(this.node.id,nodes[1].node_id)
        if (infoNodes&&infoNodes.length>0) {
          //获取系统时钟
          const time:number|null=await getRobotArmTime(this.node.id,infoNodes[4].node_id)
          if (time) {
            this.time=time
          }else {
            this.showSystemToast('获取系统时间失败')
          }
          //获取uid
          const uid:string|null=await getRobotArmUid(this.node.id,infoNodes[5].node_id)
          if (uid) {
            this.uid=uid
          }else {
            this.showSystemToast('获取uid失败')
          }
        }
        //获取末端执行node_id
        const endNodes1:Node[]|null=await getNodeOther(this.node.id,nodes[5].node_id)
        if (endNodes1&&endNodes1.length>0) {
          const endNodes2:Node[]|null=await getNodeOther(this.node.id,endNodes1[3].node_id)
          if (endNodes2&&endNodes2.length>0) {
            this.node_id_end=endNodes2[3].node_id
            this.node_id_endAbled=endNodes2[4].node_id
          }
        }
        //获取执行回零node_id
        const toStartNode:Node[]|null=await getNodeOther(this.node.id,nodes[4].node_id)
        if (toStartNode&&toStartNode.length>0) {
          this.node_id_toStart=toStartNode[2].node_id
        }
        //获取当前位姿和急停node_id
        const control:Node[]|null=await getNodeOther(this.node.id,nodes[6].node_id)
        if (control&&control.length>0) {
          //获取机械臂急停node_id
          this.node_id_stop=control[2].node_id
          //机械臂移动控制node_id
          this.node_id_move=control[3].node_id
          //机械臂jump移动控制node_id
          this.node_id_jump=control[4].node_id
          //获取当前位姿
          this.node_id_nowPosition=control[1].node_id
          const nowPositions:number[]|null=await getRobotArmNowPosition(this.node.id,control[1].node_id)
          if (nowPositions&&nowPositions.length>0) {
            //获取当前位姿成功，然后进行回显
            this.data.xValue = parseFloat(nowPositions[0].toFixed(2))
            this.data.yValue = parseFloat(nowPositions[1].toFixed(2))
            this.data.currentPos={x:parseFloat(nowPositions[0].toFixed(2)),y:parseFloat(nowPositions[1].toFixed(2))}
            this.data.zValue = parseFloat(nowPositions[2].toFixed(2))
            this.data.zzValue=parseFloat(nowPositions[2].toFixed(2))
            this.data.rValue = parseFloat(nowPositions[3].toFixed(2))
            this.data.rrValue=parseFloat(nowPositions[3].toFixed(2))
          }
        }
      }
    }
  }

  //获取机械臂使能状态
  async getEndStatus():Promise<boolean>{
    if (this.node.id&&this.node.node_id&&this.node_id_endAbled){
      const endStatus:boolean[]|null=await getEndStatus(this.node.id,this.node_id_endAbled)
      if (endStatus&&endStatus.length>0) {
        if (endStatus[0]===true&&endStatus[1]===false) {
          //有使能(还未抓取)
          this.endAbled=true
          this.isCatch=false
        }else if (endStatus[0]===false&&endStatus[1]===false) {
          //无使能（无法抓取）
          this.endAbled=false
          this.isCatch=false
        }else if (endStatus[0]===true&&endStatus[1]===true){
          //有使能（已抓取）
          this.endAbled=true
          this.isCatch=true
        }
        return true
      }else {
        return false
      }
    }else {
      return false
    }
  }

  //赋予末端使能
  async setEndAble():Promise<void>{
    if (this.node.id&&this.node.node_id&&this.node_id_end){
      const isSet:boolean|null=await setEndAble(this.node.id,this.node_id_end,"true false")
      if (isSet) {
        this.showSystemToast('赋予末端使能成功')
      }else {
        this.showSystemToast('赋予末端使能失败')
      }
    }
  }

  //清除末端使能
  async clearEndAble():Promise<void>{
    if (this.node.id&&this.node.node_id&&this.node_id_end){
      const isSet:boolean|null=await clearEndAble(this.node.id,this.node_id_end,"false false")
      if (isSet) {
        this.showSystemToast('清除末端使能成功')
      }else {
        this.showSystemToast('清除末端使能失败')
      }
    }
  }

  //控制机械臂末端
  async setEndControl(action:string):Promise<boolean>{
    if (this.node.id&&this.node.node_id&&this.node_id_end){
      const isSet:boolean|null=await endControl(this.node.id,this.node_id_end,action)
      if (isSet) {
        return isSet
      }else {
        return false
      }
    }else {
      return false
    }
  }

  //设置回零
  async setToStart():Promise<void>{
    if (this.node.id&&this.node.node_id&&this.node_id_toStart) {
      const isSet:boolean|null=await setToStart(this.node.id,this.node_id_toStart)
      if (isSet) {
        this.showSystemToast('设置回零成功')
      }else {
        this.showSystemToast('设置回零失败')
      }
    }
  }

  //设置急停
  async setStop():Promise<void>{
    if (this.node.id&&this.node.node_id&&this.node_id_stop) {
      const isSet:boolean|null=await setStop(this.node.id,this.node_id_stop)
      if (isSet) {
        this.showSystemToast('急停成功')
      }else {
        this.showSystemToast('急停失败')
      }
    }
  }

  //获取当前位姿
  async getNowPosition():Promise<boolean>{
    if (this.node.id&&this.node.node_id&&this.node_id_nowPosition){
      const nowPositions:number[]|null=await getRobotArmNowPosition(this.node.id,this.node_id_nowPosition)
      if (nowPositions&&nowPositions.length>0) {
        this.data.xValue = parseFloat(nowPositions[0].toFixed(2))
        this.data.currentPos={x:parseFloat(nowPositions[0].toFixed(2)),y:parseFloat(nowPositions[1].toFixed(2))}
        this.data.yValue = parseFloat(nowPositions[1].toFixed(2))
        this.data.zValue = parseFloat(nowPositions[2].toFixed(2))
        this.data.zzValue=parseFloat(nowPositions[2].toFixed(2))
        this.data.rValue = parseFloat(nowPositions[3].toFixed(2))
        this.data.rrValue=parseFloat(nowPositions[3].toFixed(2))
        this.redrawTrigger++;
        return true
      }else {
        return false
      }
    }else {
      return false
    }
  }

  //机械臂移动
  async setMove(x:string,y:string,z:string,r:string):Promise<void>{
    if (this.node.id&&this.node.node_id&&this.node_id_move){
      const isSet:boolean|null=await setRobotArmMove(this.node.id,this.node_id_move,`${x} ${y} ${z} ${r}`)
      if (isSet) {
        this.isMove=false
      }else {
        this.setMove(x,y,z,r)
      }
    }
  }

  //机械臂jump移动
  async setJumpMove(x:string,y:string,z:string,r:string,h:string):Promise<void>{
    if (this.node.id&&this.node.node_id&&this.node_id_jump){
      const isSet:boolean|null=await jumpRobotArmMove(this.node.id,this.node_id_move,`${x} ${y} ${z} ${r} ${h}`)
      if (isSet) {
        this.showSystemToast('移动成功')
      }else {
        this.showSystemToast('移动失败')
      }
    }
  }

  async aboutToAppear(): Promise<void> {
    await this.onNodeChange()
    const is1= await this.getNowPosition()
    const is2 =await this.getEndStatus()
    if (is1&&is2) {
      this.showSystemToast('初始化成功')
    }else {
      this.showSystemToast('初始化失败')
    }
  }

  private async handleWorkRangeClick(): Promise<void>{
    const x=this.data.currentPos.x
    const y=this.data.currentPos.y
    const z=this.data.zzValue
    const r=this.data.rrValue
    const h=this.data.jumpValue
    const isJump:boolean|null=await jumpRobotArmMove(this.node.id,this.node_id_jump,`${x} ${y} ${z} ${r} ${h}`)
    if (isJump) {
      this.showSystemToast('移动成功')
    }else {
      this.showSystemToast('移动失败')
    }
  }

  aboutToDisappear() {
    // 清理 setTimeout 创建的定时器
    if (this.idleTimer !== -1) clearTimeout(this.idleTimer)
  }

  private getStatusColor(status:boolean): Color {
    if (status) {
      return Color.Red
    }else {
      return Color.Green
    }
  }

  private increaseSpeedX() {
    this.isMove=true
    let result = this.data.xValue + this.data.step_xyz;
    this.data.xValue = parseFloat(result.toFixed(2));
    this.setMove(this.data.xValue+'',this.data.yValue+'',this.data.zValue+'',this.data.rValue+'')
  }
  private decreaseSpeedX() {
    this.isMove=true
    let result = this.data.xValue - this.data.step_xyz;
    this.data.xValue = parseFloat(result.toFixed(2));
    this.setMove(this.data.xValue+'',this.data.yValue+'',this.data.zValue+'',this.data.rValue+'')
  }

  private increaseSpeedY() {
    this.isMove=true
    let result = this.data.yValue + this.data.step_xyz;
    this.data.yValue = parseFloat(result.toFixed(2));
    this.setMove(this.data.xValue+'',this.data.yValue+'',this.data.zValue+'',this.data.rValue+'')
  }
  private decreaseSpeedY() {
    this.isMove=true
    let result = this.data.yValue - this.data.step_xyz;
    this.data.yValue = parseFloat(result.toFixed(2));
    this.setMove(this.data.xValue+'',this.data.yValue+'',this.data.zValue+'',this.data.rValue+'')
  }

  private increaseSpeedZ() {
    this.isMove=true
    let result = this.data.zValue + this.data.step_xyz;
    this.data.zValue = parseFloat(result.toFixed(2));
    this.setMove(this.data.xValue+'',this.data.yValue+'',this.data.zValue+'',this.data.rValue+'')
  }
  private decreaseSpeedZ() {
    this.isMove=true
    let result = this.data.zValue - this.data.step_xyz;
    this.data.zValue = parseFloat(result.toFixed(2));
    this.setMove(this.data.xValue+'',this.data.yValue+'',this.data.zValue+'',this.data.rValue+'')
  }

  private increaseSpeedR() {
    this.isMove=true
    let result = this.data.rValue + this.data.step_r;
    this.data.rValue = parseFloat(result.toFixed(2));
    this.setMove(this.data.xValue+'',this.data.yValue+'',this.data.zValue+'',this.data.rValue+'')
  }
  private decreaseSpeedR() {
    this.isMove=true
    let result = this.data.rValue - this.data.step_r;
    this.data.rValue = parseFloat(result.toFixed(2));
    this.setMove(this.data.xValue+'',this.data.yValue+'',this.data.zValue+'',this.data.rValue+'')
  }

  private increaseSpeedJump() {
    let result = this.data.jumpValue + this.data.step_jump
    this.data.jumpValue = parseFloat(result.toFixed(2))
  }
  private decreaseSpeedJump() {
    let result = this.data.jumpValue - this.data.step_jump
    this.data.jumpValue = parseFloat(result.toFixed(2))
  }

  private increaseSpeedZZ() {
    let result = this.data.zzValue + this.data.step_zz
    this.data.zzValue = parseFloat(result.toFixed(2))
  }
  private decreaseSpeedZZ() {
    let result = this.data.zzValue - this.data.step_zz
    this.data.zzValue = parseFloat(result.toFixed(2))
  }

  private increaseSpeedRR() {
    let result = this.data.rrValue + this.data.step_rr
    this.data.rrValue = parseFloat(result.toFixed(2))
  }
  private decreaseSpeedRR() {
    let result = this.data.rrValue - this.data.step_rr
    this.data.rrValue = parseFloat(result.toFixed(2))
  }

  // 用于控制按钮按压动画的状态
  @State isPressed: boolean = false;

  //用于追踪鼠标悬浮状态
  @State isHover: boolean = false;

  // 用于控制按钮按压动画的状态
  @State isPressed1: boolean = false;

  //用于追踪鼠标悬浮状态
  @State isHover1: boolean = false;

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


  @State isPreviewVisible: boolean = false;

  private formattedTime(time:number): string {
    if (!time || time <= 0) {
      return 'N/A';
    }
    const date = new Date(time * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    // 拼接成 "HH:mm:ss" 格式
    return `${hours}:${minutes}:${seconds}`;
  }

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
              Column({space:12}){
                //机械臂uid
                Row(){
                  Text('UID：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(17)
                    .fontColor(Color.White)
                  Text(this.uid)
                    .fontColor(Color.White)
                    .fontSize(12)
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //机械臂序列号
                Row(){
                  Text('序列号：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(17)
                    .fontColor(Color.White)
                  Text(this.sn)
                    .fontColor(Color.White)
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //机械臂名称
                Row(){
                  Text('名称：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(17)
                    .fontColor(Color.White)
                  Text('机械臂003')
                    .fontColor(Color.White)
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //机械臂固定版本
                Row(){
                  Text('固定版本：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(17)
                    .fontColor(Color.White)
                  Text(this.version)
                    .fontColor(Color.White)
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //机械臂系统时间
                Row(){
                  Text('系统时间：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(17)
                    .fontColor(Color.White)
                  Text(this.formattedTime(this.time))
                    .fontColor(Color.White)
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //机械臂使能
                Row(){
                  Text('使能状态：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(20)
                    .fontColor(Color.White)
                  Text(this.endAbled?'有使能':'无使能')
                    .fontColor(Color.White)
                  Circle()
                    .margin({left:10})
                    .width(16)
                    .height(16)
                    .fill(this.getStatusColor(!this.endAbled))
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                //机械臂警报
                Row(){
                  Text('警报原因：')
                    .fontWeight(FontWeight.Bold)
                    .fontSize(20)
                    .fontColor(Color.White)
                  Text(this.alarms===0?'无报警':this.alarms+'')
                    .fontColor(Color.White)
                  Circle()
                    .margin({left:10})
                    .width(16)
                    .height(16)
                    .fill(this.getStatusColor(this.alarms!==0))
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)

                Row(){
                  //赋予和清除使能按钮
                  Row() {
                    Text(this.endAbled?'清除使能':'赋予使能').fontSize(15).fontWeight(FontWeight.Bold).fontColor(Color.White).margin({ left: 8 })
                  }
                  .height(40)
                  .padding(8)
                  .justifyContent(FlexAlign.Center)
                  .alignItems(VerticalAlign.Center)
                  .backgroundColor(this.endAbled? 'rgba(255, 0, 0, 0.75)' :'rgba(0, 200, 83, 0.5)')
                  .borderRadius(20)
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
                  .opacity(this.isPressed1 ? 0.8 : 1.0)
                  //添加 onHover 事件来更新 isHover 状态
                  .onHover((isHover: boolean) => {
                    this.isHover1 = isHover;
                  })
                  //onTouch 事件保持不变
                  .onTouch((event: TouchEvent) => {
                    event.stopPropagation()
                    if (event.type === TouchType.Down) {
                      this.isPressed1 = true
                    }
                    if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                      this.isPressed1 = false
                      if (this.endAbled) {
                        //清除使能
                        this.clearEndAble()
                      }else {
                        //赋予使能
                        this.setEndAble()
                      }
                    }
                  })
                  //动画曲线作用于所有变化的属性（scale, shadow, opacity）
                  .animation({ duration: 150, curve: Curve.EaseOut })

                  //清除警报按钮
                  Button('清除警报')
                    .fontSize(15)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(Color.White)
                    .enabled(this.alarms!==0)
                    .height(40)
                    .padding(8)
                    .backgroundColor(this.alarms===0?'rgba(173, 170, 170, 0.40)' :'rgba(0, 200, 83, 0.5)')
                    .borderRadius(20)
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
                    .onClick(()=>{
                    })
                    //动画曲线作用于所有变化的属性（scale, shadow, opacity）
                    .animation({ duration: 150, curve: Curve.EaseOut })
                }
                .width('100%')
                .justifyContent(FlexAlign.SpaceAround)
                .alignItems(VerticalAlign.Center)
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
              Row({space:5}){
                Text('抬起高度控制：')
                  .fontColor(Color.White)

                //步长设置
                Row(){
                  Text('设置步长(mm)：')
                    .fontColor(Color.White)
                  TextInput({ text: this.data.step_jump + ' mm' })
                    .type(InputType.Number)
                    .width(100)
                    .height(25)
                    .fontSize(12)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor('rgba(255, 255, 255, 0.2)')
                    .borderRadius(20)
                    .onChange((value: string) => {
                      this.stepInputText_jump = value;
                    })
                    .onSubmit((enterKey: EnterKeyType) => {
                      const cleanValue = this.stepInputText_jump.replace(/ mm$/, '').trim();
                      const num = parseFloat(cleanValue);
                      const decimalPart = cleanValue.split('.')[1] || '';
                      if (!isNaN(num) && num > 0 && decimalPart.length <= 2) {
                        this.data.step_jump = num;
                        this.stepInputText_jump = num.toString();
                      } else {
                        this.data.step_jump = 5;
                        this.stepInputText_jump = '5';
                        this.showSystemToast('输入无效！已恢复为 5 mm');
                      }
                    })
                }

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
                    this.decreaseSpeedJump();
                  })

                  Text('H-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size2)
                }

                Row() {
                  Text((this.data.jumpValue).toFixed(2)+' mm')
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
                    this.increaseSpeedJump();
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
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              Row(){
                Text('方位控制：')
                  .fontColor(Color.White)
                //步长设置
                Row({space:5}){
                  Text('设置步长(mm)：')
                    .fontColor(Color.White)
                  TextInput({ text: this.data.step_zz + ' mm' })
                    .type(InputType.Number)
                    .width(100)
                    .height(25)
                    .fontSize(12)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor('rgba(255, 255, 255, 0.2)')
                    .borderRadius(20)
                    .onChange((value: string) => {
                      this.stepInputText_zz = value;
                    })
                    .onSubmit((enterKey: EnterKeyType) => {
                      const cleanValue = this.stepInputText_zz.replace(/ mm$/, '').trim();
                      const num = parseFloat(cleanValue);
                      const decimalPart = cleanValue.split('.')[1] || '';
                      if (!isNaN(num) && num > 0 && decimalPart.length <= 2) {
                        this.data.step_zz = num;
                        this.stepInputText_zz = num.toString();
                      } else {
                        this.data.step_zz = 5;
                        this.stepInputText_zz = '5';
                        this.showSystemToast('输入无效！已恢复为 5 mm');
                      }
                    })
                }

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
                    this.decreaseSpeedZZ();
                  })

                  Text('Z-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size2)
                }

                //数值显示
                Row() {
                  Text((this.data.zzValue).toFixed(2)+' mm')
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
                    this.increaseSpeedZZ();
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
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              Row(){
                Text('角度控制：')
                  .fontColor(Color.White)

                //步长设置
                Row({space:5}){
                  Text('设置步长(mm)：')
                    .fontColor(Color.White)
                  TextInput({ text: this.data.step_rr + ' mm' })
                    .type(InputType.Number)
                    .width(100)
                    .height(25)
                    .fontSize(12)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor('rgba(255, 255, 255, 0.2)')
                    .borderRadius(20)
                    .onChange((value: string) => {
                      this.stepInputText_rr = value;
                    })
                    .onSubmit((enterKey: EnterKeyType) => {
                      const cleanValue = this.stepInputText_rr.replace(/ mm$/, '').trim();
                      const num = parseFloat(cleanValue);
                      const decimalPart = cleanValue.split('.')[1] || '';
                      if (!isNaN(num) && num > 0 && decimalPart.length <= 2) {
                        this.data.step_rr = num;
                        this.stepInputText_rr = num.toString();
                      } else {
                        this.data.step_rr = 5;
                        this.stepInputText_rr = '5';
                        this.showSystemToast('输入无效！已恢复为 5 mm');
                      }
                    })
                }

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
                    this.decreaseSpeedRR();
                  })

                  Text('R-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size2)
                }

                //数值显示
                Row() {
                  Text((this.data.rrValue).toFixed(2)+' °')
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
                    this.increaseSpeedRR();
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
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              //设置回零按钮
              Button('回零')
                .fontSize(this.catch_font_size2)
                .fontWeight(FontWeight.Bold)
                .fontColor(Color.White)
                .width(this.catch_size_width2) // 按钮宽度
                .height(this.catch_size_height2)   // 按钮高度
                .backgroundColor('rgba(0, 200, 83, 0.5)')
                .borderRadius(30)
                .border({
                  width: 1.5,
                  color: 'rgba(255, 255, 255, 0.3)'
                })
                .backdropBlur(12)
                .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' })
                .onClick(()=>{
                  this.setToStart()
                })
                .animation({ duration: 150, curve: Curve.EaseOut })

              //抓取释放按钮
              Button() {
                Row({ space: 10 }) {
                  // 根据状态显示不同文本
                  Text(!this.isCatch ? '点击抓取' : '点击释放')
                    .fontSize(this.catch_font_size2)
                    .fontColor(Color.White)
                }
                .justifyContent(FlexAlign.Center)
                .alignItems(VerticalAlign.Center)
              }
              .width(this.catch_size_width2) // 按钮宽度
              .height(this.catch_size_height2)   // 按钮高度
              .enabled(this.endAbled)
              .backgroundColor(!this.endAbled?'rgba(173, 170, 170, 0.40)':'rgba(0, 200, 83, 0.5)')
              .onClick(async () => {
                // 切换末端状态
                if (this.isCatch) {
                  //释放逻辑
                  const isSet:boolean=await this.setEndControl("true false")
                  if (isSet) {
                    this.showSystemToast('释放成功')
                  }else {
                    this.showSystemToast('释放失败')
                  }
                } else {
                  //抓取逻辑
                  const isSet:boolean=await this.setEndControl("true true")
                  if (isSet) {
                    this.showSystemToast('抓取成功')
                  }else {
                    this.showSystemToast('抓取失败')
                  }
                }
              })
              .borderRadius(30)
              .border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)'
              })
              .backdropBlur(12)
              .animation({ duration: 250, curve: Curve.EaseInOut })
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' })

              //急停按钮
              Button('急停')
                .width(this.catch_size_width2) // 按钮宽度
                .height(this.catch_size_height2)   // 按钮高度
                .fontSize(this.catch_font_size2)
                .fontColor(Color.White)
                .onClick(() => {
                  this.setStop()
                })
                // 沿用统一的磨砂玻璃风格
                .backgroundColor('rgba(0, 200, 83, 0.5)')
                .borderRadius(30)
                .border({
                  width: 1.5,
                  color: 'rgba(255, 255, 255, 0.3)'
                })
                .backdropBlur(12)
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
          .enabled(this.alarms===0)
          .opacity(this.alarms===0 ? 1:0.5)
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
                  onTargetSelected:this.handleWorkRangeClick.bind(this),
                  redrawTrigger: this.redrawTrigger
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
            .enabled(this.alarms===0)
            .opacity(this.alarms===0 ? 1:0.5)
            .clip(true)
          } else {
            // 原有的控制面板UI
            Column({space:15}){
              Row({space:20}){
                Text('方位控制：')
                  .fontColor(Color.White)

                //步长设置
                Row(){
                  Text('设置步长(mm)：')
                    .fontColor(Color.White)
                  TextInput({ text: this.data.step_xyz + ' mm' })
                    .type(InputType.Number)
                    .width(100)
                    .height(30)
                    .fontSize(12)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor('rgba(255, 255, 255, 0.2)')
                    .borderRadius(20)
                    .onChange((value: string) => {
                      this.stepInputText_xyz = value;
                    })
                    .onSubmit((enterKey: EnterKeyType) => {
                      const cleanValue = this.stepInputText_xyz.replace(/ mm$/, '').trim();
                      const num = parseFloat(cleanValue);
                      const decimalPart = cleanValue.split('.')[1] || '';
                      if (!isNaN(num) && num > 0 && decimalPart.length <= 2) {
                        this.data.step_xyz = num;
                        this.stepInputText_xyz = num.toString();
                      } else {
                        this.data.step_xyz = 5;
                        this.stepInputText_xyz = '5';
                        this.showSystemToast('输入无效！已恢复为 5 mm');
                      }
                    })
                }

              }
              .width('100%')

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
                    this.decreaseSpeedX();
                  })
                  Text('X-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)
                }
                //数值显示
                Row() {
                  Text((this.data.xValue).toFixed(2)+' mm')
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
                    this.increaseSpeedX()
                  })
                }
              }
              .enabled(!this.isMove)
              .opacity(this.isMove? 0.5 : 1.0)
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
                    this.decreaseSpeedY();
                  })

                  Text('Y-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)
                }

                //数值显示
                Row() {
                  Text((this.data.yValue).toFixed(2)+' mm')
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
                    this.increaseSpeedY();
                  })
                }
              }
              .enabled(!this.isMove)
              .opacity(this.isMove? 0.5 : 1.0)
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
                    this.decreaseSpeedZ();
                  })
                  Text('Z-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)
                }

                //数值显示
                Row() {
                  Text((this.data.zValue).toFixed(2)+' mm')
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
                    this.increaseSpeedZ();
                  })
                }
              }
              .enabled(!this.isMove)
              .opacity(this.isMove ? 0.5 : 1.0)
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
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              Row({space:20}){
                Text('角度控制：')
                  .fontColor(Color.White)

                //步长设置
                Row(){
                  Text('设置步长(mm)：')
                    .fontColor(Color.White)
                  TextInput({ text: this.data.step_r + '' })
                    .type(InputType.Number)
                    .width(100)
                    .height(30)
                    .fontSize(12)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .backgroundColor('rgba(255, 255, 255, 0.2)')
                    .borderRadius(20)
                    .onChange((value: string) => {
                      this.stepInputText_r = value;
                    })
                    .onSubmit((enterKey: EnterKeyType) => {
                      const cleanValue = this.stepInputText_r.replace(/ mm$/, '').trim();
                      const num = parseFloat(cleanValue);
                      const decimalPart = cleanValue.split('.')[1] || '';
                      // 开始校验
                      if (!isNaN(num) && num > 0 && decimalPart.length <= 2) {
                        this.data.step_r = num;
                        this.stepInputText_r = num.toString();
                      } else {
                        this.data.step_r = 5;
                        this.stepInputText_r = '5';
                        this.showSystemToast('输入无效！已恢复为 5 mm');
                      }
                    })
                }

              }
              .width('100%')

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
                    this.decreaseSpeedR();
                  })
                  Text('R-')
                    .fontColor(Color.White)
                    .fontSize(this.button_icon_size)
                }
                //数值显示
                Row() {
                  Text((this.data.rValue).toFixed(2)+' °')
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
                    this.increaseSpeedR();
                  })
                }
              }
              .enabled(!this.isMove)
              .opacity(this.isMove? 0.5 : 1.0)
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
              .animation({ duration: 250, curve: Curve.EaseInOut }) // 为状态切换增加平滑动画
              .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' }) // 添加细微的阴影

              Row(){
                Text('状态控制：')
                  .fontColor(Color.White)
              }
              .width('100%')

              Row({space:10}){
                //设置回零按钮
                Button('回零')
                  .fontSize(this.catch_font_size)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(Color.White)
                  .width(this.catch_size_width) // 按钮宽度
                  .height(this.catch_size_height)   // 按钮高度
                  .onClick(()=>{
                    this.setToStart()
                  })
                  .borderRadius(20)
                  .border({
                    width: 1,
                    color: 'rgba(255, 255, 255, 0.3)'
                  })
                  .backgroundColor('rgba(0, 200, 83, 0.5)')
                  .borderRadius(30)
                  .border({
                    width: 1.5,
                    color: 'rgba(255, 255, 255, 0.3)'
                  })
                  .backdropBlur(12)
                  .animation({ duration: 250, curve: Curve.EaseInOut })
                  .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' })

                //抓取释放按钮
                Button() {
                  Row({ space: 10 }) {
                    // 根据状态显示不同文本
                    Text(!this.isCatch ? '点击抓取' : '点击释放')
                      .fontSize(this.catch_font_size)
                      .fontColor(Color.White)
                  }
                  .justifyContent(FlexAlign.Center)
                  .alignItems(VerticalAlign.Center)
                }
                .width(this.catch_size_width) // 按钮宽度
                .height(this.catch_size_height)   // 按钮高度
                .enabled(this.endAbled)
                .backgroundColor(!this.endAbled?'rgba(173, 170, 170, 0.40)':'rgba(0, 200, 83, 0.5)')
                .onClick(async () => {
                  // 切换末端状态
                  if (this.isCatch) {
                    //释放逻辑
                    const isSet:boolean=await this.setEndControl("true false")
                    if (isSet) {
                      this.showSystemToast('释放成功')
                    }else {
                      this.showSystemToast('释放失败')
                    }
                  } else {
                    //抓取逻辑
                    const isSet:boolean=await this.setEndControl("true true")
                    if (isSet) {
                      this.showSystemToast('抓取成功')
                    }else {
                      this.showSystemToast('抓取失败')
                    }
                  }
                })
                .borderRadius(30)
                .border({
                  width: 1.5,
                  color: 'rgba(255, 255, 255, 0.3)'
                })
                .backdropBlur(12)
                .animation({ duration: 250, curve: Curve.EaseInOut })
                .shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' })

                //急停按钮
                Button('急停')
                  .width(this.catch_size_width) // 按钮宽度
                  .height(this.catch_size_height)   // 按钮高度
                  .fontSize(this.catch_font_size)
                  .fontColor(Color.White)
                  .onClick(() => {
                    this.setStop()
                  })
                  // 沿用统一的磨砂玻璃风格
                  .backgroundColor('rgba(0, 200, 83, 0.5)')
                  .borderRadius(30)
                  .border({
                    width: 1.5,
                    color: 'rgba(255, 255, 255, 0.3)'
                  })
                  .backdropBlur(12)
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

          //刷新按钮
          ActionButton({
            // 请替换为您的图标资源
            icon: $r('app.media.refresh'),
            click: async() => {
              const is1= await this.getNowPosition()
              const is2= await this.getEndStatus()
              if (is1&&is2) {
                this.showSystemToast('刷新成功')
              }else {
                this.showSystemToast('刷新失败')
              }
            }
          })
            .position({top:10,right:60})

          //切换按钮
          ActionButton({
            // 请替换为您的图标资源
            icon: $r('app.media.change'),
            click: () => {
              animateTo({ duration: 800, curve: Curve.EaseInOut }, async () => {
                this.data.isRegionAVisible=!this.data.isRegionAVisible
                this.data.isInfoCardVisible=!this.data.isInfoCardVisible
                if (!this.data.isInfoCardVisible) {
                  const is1= await this.getNowPosition()
                  const is2= await this.getEndStatus()
                  if (is1&&is2) {
                    this.showSystemToast('初始化成功')
                  }else {
                    this.showSystemToast('初始化失败')
                  }
                }
              });
            }
          })
            .position({top:10,right:10})
        }
        .enabled(this.alarms===0)
        .opacity(this.alarms===0 ? 1:0.5)
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