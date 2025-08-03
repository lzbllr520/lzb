import { router } from "@kit.ArkUI";
import {Server,Node} from '../model/ServerState'
import {getNodeStart,getNodeOther} from '../service/Request'

//定义卡片的数据模型
interface CardInfo {
  id: string;
  title: string;
  description: string;
}

@Component
struct InfoCard {
  private title: string = ''
  private description: string = ''

  @State private isPressed: boolean = false

  build() {
    Row() {
      Column() {
        Text(this.title)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
          .margin({ bottom: 8 })

        Text(this.description)
          .fontSize(14)
          .fontColor('rgba(255, 255, 255, 0.75)')
          .lineHeight(20)
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      .margin({ right: 16 })

      Text('＞')
        .fontSize(30)
        .fontColor('rgba(255, 255, 255, 0.75)')
    }
    .padding(20)
    .width('100%')
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
    .scale({ x: this.isPressed ? 0.96 : 1.0, y: this.isPressed ? 0.96 : 1.0 })
    .animation({
      duration: 200,
      curve: Curve.EaseInOut
    })
    .onTouch((event: TouchEvent) => {
      if (event.type === TouchType.Down) {
        this.isPressed = true;
      }
      if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
        this.isPressed = false;
      }
    })
  }
}

@Component
export struct ServerInfoView {
  // 创建一个包含多个卡片信息的数组作为数据源
  private cardData: CardInfo[] = [
    { id: '1', title: 'VOC传感器', description: '动态获取VOC浓度、甲醛浓度、二氧化碳浓度、温度、湿度这些和环境有关的数据信息并实时展示。' },
    { id: '2', title: '噪声传感器', description: '动态获取并展示当前噪声值。' },
    { id: '3', title: '红外传感器', description: '动态获取并展示红外检测状态、检测次数信息。' },
    { id: '4', title: '震动传感器', description: '动态获取并展示震动状态、震动次数、脉冲总数信息。' },
    {id: '5', title:'RFID读卡器', description:'动态获取并展示'}
  ];

  @Prop @Watch('onServersChange') server:Server|null
  //标志位，表示只加载一次
  @State private hasLoaded: boolean = false;

  @State private node_id_voc:string=''
  @State private node_id_voice:string=''
  @State private node_id_red:string=''
  @State private node_id_shark:string=''

  aboutToAppear() {
    this.onServersChange();
  }

  async onServersChange(): Promise<void> {
    if (this.server&& !this.hasLoaded) {
      // 调用数据加载函数
      const nodes1:Node[]|null=await getNodeStart(this.server.id)
      if (nodes1&&nodes1.length>0) {
        const nodes2:Node[]|null=await getNodeOther(this.server.id,nodes1[3].node_id)
        if (nodes2&&nodes2.length>0) {
          const nodes3:Node[]|null=await getNodeOther(this.server.id,nodes2[1].node_id)
          if (nodes3&&nodes3.length>0) {
            this.node_id_voc=nodes3[1].node_id
            this.node_id_voice=nodes3[2].node_id
            this.node_id_red=nodes3[3].node_id
            this.node_id_shark=nodes3[4].node_id
          }
        }
      }
      // 将标志位置为 true，防止重复加载
      this.hasLoaded = true;
    }
  }


  build() {
    Column(){
      Text((this.server ? this.server.name : 'null') + '——传感器动态数据集')
        .fontSize(34)
        .fontWeight(FontWeight.Bold)
        .fontColor(Color.White)
        .width('100%')
        .textAlign(TextAlign.Start)
        .padding({ top: 50, left: 20, right: 20, bottom: 10 })
      Stack() {
        List({ space: 16 }) {
          // ForEach 循环和 ListItem 放在这里
          ForEach(this.cardData, (item: CardInfo) => {
            ListItem() {
              InfoCard({
                title: item.title,
                description: item.description
              })
            }
            .onClick(()=>{
              if (item.title==='VOC传感器') {
                router.pushUrl({
                  url: 'pages/SensorInfoVOC',
                  params: { title: item.title, id:this.server?this.server.id:'', node_id:this.node_id_voc}
                })
              }else if (item.title==='噪声传感器'){
                router.pushUrl({
                  url: 'pages/SensorInfoVoice',
                  params: { title: item.title, id:this.server?this.server.id:'', node_id:this.node_id_voice}
                })
              }else if (item.title==='红外传感器'){
                router.pushUrl({
                  url: 'pages/SensorInfoRed',
                  params: { title: item.title, id:this.server?this.server.id:'', node_id:this.node_id_red}
                })
              }else if (item.title==='震动传感器'){
                router.pushUrl({
                  url: 'pages/SensorInfoShark',
                  params: { title: item.title, id:this.server?this.server.id:'', node_id:this.node_id_shark}
                })
              }
            })
          }, (item:CardInfo) => item.id)
        }
        .width('100%')
        .height('100%')
        .padding({ left: 16, right: 16, top: 20, bottom: 20 })
        .scrollBar(BarState.On)                // 显示滚动条
        .scrollBarColor('#888888')             // 更明显的滚动条颜色
        .scrollBarWidth(8)                    // 适当宽度
        .edgeEffect(EdgeEffect.Spring)         // 滑动边缘效果
      }
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
  }
}