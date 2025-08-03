import { router } from '@kit.ArkUI';
import { Node } from '../model/ServerState';
import {getNodeOther, getNodeRed1,getNodeRed2} from '../service/Request'

interface CardData {
  title: string;
  value: string;
  unit: string;
}

@Component
struct ValueCard {
  private title: string = '标题';
  private value: string = '0.0';
  private unit: string = '单位';

  build() {
    Column({space:10}) {
      Text(this.title)
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor('rgba(255, 255, 255, 0.8)')
        .width('100%')
        .textAlign(TextAlign.Center)

      Row() {
        Text(this.value)
          .fontSize(38)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)

        Text(this.unit)
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .fontColor('rgba(255, 255, 255, 0.85)')
          .margin({ left: 8 })
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .alignItems(VerticalAlign.Center)
    }
    .width('100%') // 卡片宽度将由Grid控制，这里设为100%
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .height(150)
    .padding(15)
    .backdropBlur(15)
    .backgroundColor('rgba(25, 29, 40, 0.5)')
    .borderRadius(24)
    .border({
      width: 1.5,
      color: 'rgba(255, 255, 255, 0.15)'
    })
    .shadow({
      radius: 20,
      color: 'rgba(0, 0, 0, 0.2)',
      offsetX: 0,
      offsetY: 10
    })
  }
}

interface MasterStationInfo {
  title: string
  id: string
  node_id:string
}

@Entry
@Component
struct SensorInfoRed {
  @State sensorData: CardData[] = [
    { title: '检测状态', value: 'null', unit: '' },
    { title: '检测次数', value: 'null', unit: '次' }
  ];

  @State bgOpacity: number = 0;

  private routeParams = router.getParams() as MasterStationInfo;

  private timer: number = -1;

  private sensorNodeId1: string = '';
  private sensorNodeId2: string = '';

  // 定义一个可重用的数据获取和更新函数
  async fetchAndUpdateData() {
      // 确保已经获取到了传感器的node_id
      if (!this.sensorNodeId1||!this.sensorNodeId2) {
        const nodes1: Node[] | null = await getNodeOther(this.routeParams.id, this.routeParams.node_id);
        if (nodes1 && nodes1.length > 0) {
          const nodes2: Node[] | null = await getNodeOther(this.routeParams.id, nodes1[1].node_id);
          if (nodes2&&nodes2.length>0) {
            this.sensorNodeId1=nodes2[1].node_id
            this.sensorNodeId2=nodes2[2].node_id
          }
        } else {
          return;
        }
      }

      const data1: boolean | null = await getNodeRed1(this.routeParams.id, this.sensorNodeId1)
      const data2: number | null = await getNodeRed2(this.routeParams.id, this.sensorNodeId2)

      if (data1 !== null && data2 !== null) {
        const newSensorData: CardData[] = [
          {
            title: '检测状态',
            value: data1 ? '有目标' : '无目标',
            unit: ''
          },
          {
            title: '检测次数',
            value: data2.toString(),
            unit: '次'
          }
        ];
        this.sensorData = newSensorData;
        console.error("获取红外传感器数据成功",data1,data2);
      } else {
        console.error("获取红外传感器数据失败");
      }
  }

  async aboutToAppear() {
    // 背景缓慢显示动画控制代码
    animateTo({ duration: 3000, curve: Curve.EaseInOut }, () => {
      this.bgOpacity = 1;
    });
    if (this.routeParams.id&&this.routeParams.node_id){
      //页面出现时，立即执行一次数据获取
      await this.fetchAndUpdateData();
      //启动一个定时器，每隔1000毫秒（1秒）调用一次数据获取函数
      this.timer = setInterval(() => {
        this.fetchAndUpdateData();
      }, 1000); // 时间单位是毫秒
    }
  }

  // 当用户离开这个页面时，这个函数会被调用
  aboutToDisappear() {
    // 5. 清除定时器，防止页面销毁后定时器仍在后台运行，导致内存泄漏和不必要的网络请求
    if (this.timer !== -1) {
      clearInterval(this.timer);
      this.timer = -1; // 重置timer ID
    }
  }

  build() {
    Stack({ alignContent: Alignment.TopStart }){

      Image($r('app.media.zb'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
        .opacity(this.bgOpacity)

      Column() {
        Row() {
          Image($r('app.media.left_arrow'))
            .width(28)
            .height(28)
            .fillColor(Color.White)
            .onClick(() => {
              router.back();
            })

          // 4. 将页面大标题也放入这个Row中
          Text(this.routeParams.title)
            .fontSize(28)
            .fontWeight(FontWeight.Bold)
            .fontColor(Color.White)
            .margin({ left: 16 }) // 给标题和返回按钮之间增加一些间距
        }
        .width('100%')
        .height(56) // 标准的导航栏高度
        .padding({ left: 20, right: 20 })
        .margin({ top: 40 }) // 距离屏幕顶部的安全距离
        .justifyContent(FlexAlign.Start)
        .alignItems(VerticalAlign.Center)

        // 1. 使用 Scroll 组件包裹整个网格，使其可以滚动
        Scroll() {
          // 2. 使用 Grid 组件进行网格布局
          Grid() {
            // 3. 遍历数据数组，为每个数据对象创建一个卡片
            ForEach(this.sensorData, (item: CardData) => {
              GridItem() { // 每个卡片都是一个GridItem
                ValueCard({
                  title: item.title,
                  value: item.value,
                  unit: item.unit
                })
              }
            }, (item: CardData) => JSON.stringify(item)) // 使用唯一key提高性能
          }
          // --- Grid 的核心配置 ---
          // 设置Grid的列模板为4列，每列占据1份空间（等宽）
          .columnsTemplate('1fr 1fr 1fr 1fr')
          // 设置列与列之间的间距
          .columnsGap(16)
          // 设置行与行之间的间距
          .rowsGap(16)
          .padding({ left: 16, right: 16, bottom: 50 }) // 给网格整体一些内边距
        }
        .width('100%')
        .layoutWeight(1) // 让滚动区域占据剩余的所有空间
      }
      .width('100%')
      .height('100%')
    }
    .backgroundColor('#0A0A0F')
    .width('100%')
    .height('100%')
  }
}