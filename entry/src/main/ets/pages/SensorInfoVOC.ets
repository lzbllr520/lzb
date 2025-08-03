import { promptAction, router } from '@kit.ArkUI';
import { Node } from '../model/ServerState';
import {getNodeEn, getNodeOther} from '../service/Request'

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
    .width('100%')
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
struct SensorInfo {
  @State sensorData: CardData[] = [
    { title: '当前温度', value: 'null', unit: '°C' },
    { title: '当前湿度', value: 'null', unit: '%' },
    { title: 'VOC 浓度', value: 'null', unit: 'ppm' },
    { title: '甲醛浓度', value: 'null', unit: 'mg/m³' },
    { title: '二氧化碳浓度', value: 'null', unit: 'ppm' }
  ];

  @State bgOpacity: number = 0;

  private routeParams = router.getParams() as MasterStationInfo;

  private timer: number = -1;
  // 缓存nodes[2].node_id，避免重复获取
  private sensorNodeId: string = '';

  // 定义一个可重用的数据获取和更新函数
  async fetchAndUpdateData() {
      // 确保已经获取到了传感器的node_id
      if (!this.sensorNodeId) {
        const nodes: Node[] | null = await getNodeOther(this.routeParams.id, this.routeParams.node_id);
        if (nodes && nodes.length > 0) {
          // 假设传感器节点固定是第三个
          this.sensorNodeId = nodes[2].node_id;
        } else {
          return;
        }
      }
      const data: number[] | null = await getNodeEn(this.routeParams.id, this.sensorNodeId);
      if (data && data.length > 0) {
        this.sensorData = this.sensorData.map((item: CardData, index: number) => {
          const newItem: CardData = {
            title: item.title,
            unit: item.unit,
            value: data[index] + ''
          };
          return newItem;
        });
        console.info('获取VOC传感器数据成功：',JSON.stringify(data))
      } else {
        console.info('获取VOC传感器数据失败')
      }
  }

  async aboutToAppear() {
    // 背景缓慢显示动画控制代码
    animateTo({ duration: 3000, curve: Curve.EaseInOut }, () => {
      this.bgOpacity = 1;
    });
    if (this.routeParams.id&&this.routeParams.node_id){
      await this.fetchAndUpdateData();
      this.timer = setInterval(() => {
        this.fetchAndUpdateData();
      }, 1000)
    }
  }

  // 当用户离开这个页面时，这个函数会被调用
  aboutToDisappear() {
    //清除定时器，防止页面销毁后定时器仍在后台运行，导致内存泄漏和不必要的网络请求
    if (this.timer !== -1) {
      clearInterval(this.timer)
      this.timer = -1
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

          Text(this.routeParams.title)
            .fontSize(28)
            .fontWeight(FontWeight.Bold)
            .fontColor(Color.White)
            .margin({ left: 16 })
        }
        .width('100%')
        .height(56)
        .padding({ left: 20, right: 20 })
        .margin({ top: 40 })
        .justifyContent(FlexAlign.Start)
        .alignItems(VerticalAlign.Center)

        Scroll() {
          Grid() {
            ForEach(this.sensorData, (item: CardData) => {
              GridItem() {
                ValueCard({
                  title: item.title,
                  value: item.value,
                  unit: item.unit
                })
              }
            }, (item: CardData) => JSON.stringify(item))
          }
          .columnsTemplate('1fr 1fr 1fr 1fr')
          .columnsGap(16)
          .rowsGap(16)
          .padding({ left: 16, right: 16, bottom: 50 })
        }
        .width('100%')
        .layoutWeight(1)
      }
      .width('100%')
      .height('100%')
    }
    .backgroundColor('#0A0A0F')
    .width('100%')
    .height('100%')
  }
}