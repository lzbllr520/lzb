// 定义卡片的数据模型
@Component
export struct ValueCard {
  private icon ?:Resource
  private title: string = '标题'
  private value: string = '0.0'
  private unit: string = '单位'

  build() {
    Column({space:10}) {
      Row({ space: 8 }) {

          Image(this.icon)
            .width(20)
            .height(20)
            .fillColor('rgba(255, 255, 255, 0.9)')

        Text(this.title)
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor('rgba(255, 255, 255, 0.8)')
      }
      .justifyContent(FlexAlign.Center)
      .alignItems(VerticalAlign.Center)
      .width('100%')

      Row() {
        Text(this.value)
          .fontSize(25)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)

        Text(this.unit)
          .fontSize(15)
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
    .padding(10)
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
}