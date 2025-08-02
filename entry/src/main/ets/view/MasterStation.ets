//定义卡片的数据模型
interface CardInfo {
  id: string;
  title: string;
  description: string;
}

@Component
struct InfoCard {
  private title: string = '';
  private description: string = '';

  @State private isPressed: boolean = false;

  build() {
    // 1. 将根组件从 Column 改为 Row，以实现水平布局
    Row() {
      // 2. 左侧的文本区域
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
      .alignItems(HorizontalAlign.Start) // 内部文本左对齐
      .layoutWeight(1) // 使用 layoutWeight(1) 使其占据所有可用空间，将图标推到最右边
      .margin({ right: 16 }) // 和右边的图标保持一点间距

      // 3. 右侧的箭头图标。我们用 Text 组件来模拟，方便调整样式
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
export struct MasterStation {
  // 创建一个包含多个卡片信息的数组作为数据源
  private cardData: CardInfo[] = [
    { id: '1', title: 'VOC传感器', description: '动态获取VOC浓度、甲醛浓度、二氧化碳浓度、温度、湿度这些和环境有关的数据信息并实时展示。' },
    { id: '2', title: '噪声传感器', description: '一次开发，多端部署。鸿蒙的分布式技术让应用无缝流转于手机、平板、手表和智慧屏之间。' },
    { id: '3', title: '红外传感器', description: '无需安装，即点即用。通过服务卡片，用户可以直接在桌面获取核心服务信息和快捷入口。' },
    { id: '4', title: '震动传感器', description: '结合背景模糊、半透明材质和柔和光影，创造出层次分明、通透精致的视觉效果。' },
  ];

  build() {
    Column(){
      Text('传感器动态数据集')
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
          }, (item:CardInfo) => item.id)
        }
        .width('100%')
        .height('100%')
        .padding({ left: 16, right: 16, top: 20, bottom: 20 })
        .edgeEffect(EdgeEffect.Spring)
      }
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
  }
}