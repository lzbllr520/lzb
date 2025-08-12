import { Server, Node } from '../model/ServerState'
import {
  getNodeStart,
  getNodeOther,
  getNodeEn,
  getNodeVoice,
  getNodeShark1,
  getNodeShark2,
  getNodeShark3,
  getNodeRed1,
  getNodeRed2,
  getNodeRFID1,
  getNodeRFID2,
  getNodeRFID3,
  getNodeRFID4,
  getNodeRFID5
} from '../service/Request'
import { ValueCard } from './ValueCard'
import { promptAction } from '@kit.ArkUI';

// 定义卡片的数据模型
interface CardData {
  icon: Resource,
  title: string;
  value: string;
  unit: string;
}

@Component
export struct ServerInfoView {

  @Prop @Watch('onServersChange') server: Server | null

  @Prop @Watch('onActiveChange') isActive: boolean = false

  onActiveChange() {
    if (this.isActive) {
      this.startDataFetching()
    } else {
      this.stopDataFetching()
    }
  }

  @State private isCurrentlyVisible: boolean = false
  private timer: number = -1;

  // VOC 传感器数据
  @State vocSensorData: CardData[] = [
    { icon:$r('app.media.gas'),title: 'VOC 浓度', value: '', unit: 'ppm' },
    { icon:$r('app.media.gas'),title: '甲醛浓度', value: '', unit: 'mg/m³' },
    { icon:$r('app.media.gas'),title: '二氧化碳浓度', value: '', unit: 'ppm' },
    { icon:$r('app.media.temperature'),title: '当前温度', value: '', unit: '°C' },
    { icon:$r('app.media.humidity'),title: '当前湿度', value: '', unit: '%' }
  ]
  private node_id_voc: string = ''

  // 噪声传感器数据
  @State voiceSensorData: CardData[] = [
    { icon:$r('app.media.voice'),title: '当前噪声', value: '', unit: 'dB' }
  ]
  private node_id_voice: string = ''

  // 红外传感器数据
  @State redSensorData: CardData[] = [
    { icon:$r('app.media.status'),title: '检测状态', value: '', unit: '' },
    { icon:$r('app.media.num'),title: '检测次数', value: '', unit: '次' }
  ]
  private node_id_red_1: string = ''
  private node_id_red_2: string = ''

  // 震动传感器数据
  @State sharkSensorData: CardData[] = [
    { icon:$r('app.media.status'),title: '震动状态', value: '', unit: '' },
    { icon:$r('app.media.num'),title: '震动次数', value: '', unit: '次' },
    { icon:$r('app.media.num'),title: '脉冲总数', value: '', unit: '次' }
  ]
  private node_id_shark_1: string = ''
  private node_id_shark_2: string = ''
  private node_id_shark_3: string = ''

  // RFID 读卡器数据
  @State rfidSensorData: CardData[] = [
    { icon:$r('app.media.id'),title: '卡片UID', value: '', unit: '' },
    { icon:$r('app.media.status'),title: '卡片是否存在', value: '', unit: '' },
    { icon:$r('app.media.num'),title: '数据块内容', value: '', unit: '' },
    { icon:$r('app.media.num'),title: '读取次数', value: '', unit: '次' },
    { icon:$r('app.media.time'),title: '最后读取时间', value: '', unit: '' }
  ]
  private node_id_rfid_1: string = ''
  private node_id_rfid_2: string = ''
  private node_id_rfid_3: string = ''
  private node_id_rfid_4: string = ''
  private node_id_rfid_5: string = ''

  async startDataFetching() {
    await this.onServersChange()
    if (this.server) {
      await this.fetchAndUpdateData()
      if (this.timer === -1) { // 防止重复创建
        this.timer = setInterval(async () => {
          await this.fetchAndUpdateData();
        }, 8000);
      }
    }
  }

  // 这是一个新的方法，封装了停止数据获取的逻辑
  stopDataFetching() {
    if (this.timer !== -1) {
      clearInterval(this.timer);
      this.timer = -1;
    }
  }

  aboutToDisappear() {
    this.stopDataFetching();
  }

  async onServersChange(): Promise<void> {
    if (this.server) {
      const nodes1: Node[] | null = await getNodeStart(this.server.id)
      if (nodes1 && nodes1.length > 0) {
        const nodes2: Node[] | null = await getNodeOther(this.server.id, nodes1[3].node_id)
        if (nodes2 && nodes2.length > 0) {
          // RFID读卡器
          let index=5
          if (this.server.id==='server1'||this.server.id==='server4'){
            index=6
          }
          const rfidNodes: Node[] | null = await getNodeOther(this.server.id, nodes2[index].node_id);
          if (rfidNodes && rfidNodes.length > 0) {
            this.node_id_rfid_1 = rfidNodes[1].node_id
            this.node_id_rfid_2 = rfidNodes[2].node_id
            this.node_id_rfid_3 = rfidNodes[3].node_id
            this.node_id_rfid_4 = rfidNodes[4].node_id
            this.node_id_rfid_5 = rfidNodes[5].node_id
          }

          //所有传感器node_id
          const nodes3: Node[] | null = await getNodeOther(this.server.id, nodes2[1].node_id)
          if (nodes3 && nodes3.length > 0) {
            // VOC传感器数据node_id
            const vocNodes:Node[]|null=await getNodeOther(this.server.id,nodes3[1].node_id)
            if (vocNodes&&vocNodes.length>0) {
              this.node_id_voc=vocNodes[2].node_id
            }
            // 噪声传感器数据的node_id
            const noiseNodes:Node[]|null=await getNodeOther(this.server.id,nodes3[2].node_id)
            if (noiseNodes&&noiseNodes.length>0) {
              this.node_id_voice=noiseNodes[1].node_id
            }
            // 红外传感器数据的node_id
            const redNodes1: Node[] | null = await getNodeOther(this.server.id, nodes3[3].node_id);
            if (redNodes1 && redNodes1.length > 0) {
              const redNodes2:Node[]|null=await getNodeOther(this.server.id,redNodes1[1].node_id)
              if (redNodes2&&redNodes2.length>0) {
                this.node_id_red_1=redNodes2[1].node_id
                this.node_id_red_2=redNodes2[2].node_id
              }
            }
            // 震动传感器数据的node_id
            const sharkNodes1: Node[] | null = await getNodeOther(this.server.id, nodes3[4].node_id);
            if (sharkNodes1 && sharkNodes1.length > 0) {
              const sharkNodes2:Node[]|null=await getNodeOther(this.server.id,sharkNodes1[1].node_id)
              if (sharkNodes2&&sharkNodes2.length>0) {
                this.node_id_shark_1=sharkNodes2[1].node_id
                this.node_id_shark_2=sharkNodes2[2].node_id
                this.node_id_shark_3=sharkNodes2[3].node_id
              }
            }
          }
        }
      }
    }
  }

  async fetchAndUpdateData() {
    if (!this.server) return;
    //获取VOC传感器数据
    if (this.node_id_voc) {
      const data: number[] | null = await getNodeEn(this.server.id, this.node_id_voc);
      if (data && data.length > 0) {
        this.vocSensorData = this.vocSensorData.map((item: CardData, index: number) => {
          const newItem: CardData = {
            icon:item.icon,
            title: item.title,
            unit: item.unit,
            value: data[index] + ''
          };
          return newItem;
        });
      }
    }

    //获取噪声传感器数据
    if (this.node_id_voice) {
      const data: number | null = await getNodeVoice(this.server.id, this.node_id_voice);
      if (data !== null) {
        this.voiceSensorData = [{
          icon:$r('app.media.voice'),
          title: '当前噪声', //可以直接写定
          unit: 'dB',      //可以直接写定
          value: data.toFixed(2) + ''
        }];
      }
    }

    //获取红外传感器数据
    if (this.node_id_red_1 && this.node_id_red_2) {
      const data1: boolean | null = await getNodeRed1(this.server.id, this.node_id_red_1);
      const data2: number | null = await getNodeRed2(this.server.id, this.node_id_red_2);
      if (data1 !== null && data2 !== null) {
        this.redSensorData = [
          { icon:$r('app.media.status'),title: '检测状态', value: data1 ? '有目标' : '无目标', unit: '' },
          { icon:$r('app.media.num'),title: '检测次数', value: data2.toString(), unit: '次' }
        ];
      }
    }

    //获取震动传感器数据
    if (this.node_id_shark_1 && this.node_id_shark_2 && this.node_id_shark_3) {
      const data1: boolean | null = await getNodeShark1(this.server.id, this.node_id_shark_1);
      const data2: number | null = await getNodeShark2(this.server.id, this.node_id_shark_2);
      const data3: number | null = await getNodeShark3(this.server.id, this.node_id_shark_3);
      if (data1 !== null && data2 !== null && data3 !== null) {
        this.sharkSensorData = [
          { icon:$r('app.media.status'),title: '震动状态', value: data1 ? '有震动' : '无震动', unit: '' },
          { icon:$r('app.media.num'),title: '震动次数', value: data2 + '', unit: '次' },
          { icon:$r('app.media.num'),title: '脉冲总数', value: data3.toString(), unit: '次' }
        ];
      }
    }

    //获取RFID读卡器数据
    if (this.node_id_rfid_1 && this.node_id_rfid_2 && this.node_id_rfid_3 && this.node_id_rfid_4 && this.node_id_rfid_5) {
      const data1: string | null = await getNodeRFID1(this.server.id, this.node_id_rfid_1)
      const data2: string | null = await getNodeRFID2(this.server.id, this.node_id_rfid_2)
      const data3: string | null = await getNodeRFID3(this.server.id, this.node_id_rfid_3)
      const data4: string | null = await getNodeRFID4(this.server.id, this.node_id_rfid_4)
      const data5: string | null = await getNodeRFID5(this.server.id, this.node_id_rfid_5)
      this.rfidSensorData = [
        { icon:$r('app.media.id'),title: '卡片UID', value: data1?data1:'无UID信息' + '', unit: '' },
        { icon:$r('app.media.status'),title: '卡片是否存在', value: data2?'存在':'不存在' + '', unit: '' },
        { icon:$r('app.media.num'),title: '数据块内容', value: data3 + '', unit: '' },
        { icon:$r('app.media.num'),title: '读取次数', value: data4 + '', unit: '次' },
        { icon:$r('app.media.time'),title: '最后读取时间', value: data5?data5:'无时间信息' + '', unit: '' }
      ];
    }
  }

  @Builder
  SectionTitle(title: string) {
    Text(title)
      .fontSize(20)
      .fontWeight(FontWeight.Bold)
      .fontColor(Color.White)
      .width('100%')
      .textAlign(TextAlign.Start)
      .padding({ top: 10, bottom: 10, left: 20 })
  }

  build() {
    Column() {
      Text((this.server ? this.server.id : 'null') + '——传感器动态数据集')
        .fontSize(30)
        .fontWeight(FontWeight.Bold)
        .fontColor(Color.White)
        .width('100%')
        .textAlign(TextAlign.Start)
        .padding({ top: 50, left: 20, right: 20, bottom: 10 })

      Scroll() {
        Column({ space: 16 }) {
          // VOC传感器
          this.SectionTitle('VOC传感器')
          Grid() {
            ForEach(this.vocSensorData, (item: CardData) => {
              GridItem() { ValueCard({ icon:item.icon,title: item.title, value: item.value, unit: item.unit }) }
            }, (item: CardData) => JSON.stringify(item))
          }
          .columnsTemplate('1fr 1fr')
          .columnsGap(16)
          .rowsGap(16)

          // 噪声传感器
          this.SectionTitle('噪声传感器')
          Grid() {
            ForEach(this.voiceSensorData, (item: CardData) => {
              GridItem() { ValueCard({ icon:item.icon,title: item.title, value: item.value, unit: item.unit }) }
            }, (item: CardData) => JSON.stringify(item))
          }
          .columnsTemplate('1fr 1fr')
          .columnsGap(16)
          .rowsGap(16)

          // 红外传感器
          this.SectionTitle('红外传感器')
          Grid() {
            ForEach(this.redSensorData, (item: CardData) => {
              GridItem() { ValueCard({ icon:item.icon,title: item.title, value: item.value, unit: item.unit }) }
            }, (item: CardData) => JSON.stringify(item))
          }
          .columnsTemplate('1fr 1fr')
          .columnsGap(16)
          .rowsGap(16)

          // 震动传感器
          this.SectionTitle('震动传感器')
          Grid() {
            ForEach(this.sharkSensorData, (item: CardData) => {
              GridItem() { ValueCard({ title: item.title, value: item.value, unit: item.unit }) }
            }, (item: CardData) => JSON.stringify(item))
          }
          .columnsTemplate('1fr 1fr')
          .columnsGap(16)
          .rowsGap(16)

          // RFID读卡器
          this.SectionTitle('RFID读卡器')
          Grid() {
            ForEach(this.rfidSensorData, (item: CardData) => {
              GridItem() { ValueCard({ icon:item.icon,title: item.title, value: item.value, unit: item.unit }) }
            }, (item: CardData) => JSON.stringify(item))
          }
          .columnsTemplate('1fr')
          .columnsGap(16)
          .rowsGap(16)

        }
        .padding({ left: 16, right: 16, top: 20, bottom: 20 })
      }
      .scrollBar(BarState.On)
      .scrollBarColor('#888888')
      .scrollBarWidth(8)
      .edgeEffect(EdgeEffect.Spring)
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#0A0A0F')
    .onVisibleAreaChange([0.0, 1.0], (isVisible: boolean, currentRatio: number) => {
      // 当组件刚变得可见时
      if (currentRatio > 0 && !this.isCurrentlyVisible) {
        this.isCurrentlyVisible = true;
        this.startDataFetching()
      }
      // 当组件刚变得完全不可见时
      else if (currentRatio <= 0 && this.isCurrentlyVisible) {
        this.isCurrentlyVisible = false;
        this.stopDataFetching(); // 调用停止逻辑
      }
    })
  }
}