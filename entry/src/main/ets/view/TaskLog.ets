interface LevelStyle {
  icon: Resource;
  color: Color;
}

interface LogEntry {
  id: number;
  level: 'info' | 'warning' | 'error';
  timestamp: string;
  message: string;
}

@Component
export struct TaskLog {

  @Prop @Watch('onAllLogsUpdated') allLogItems: LogEntry[];

  @State private displayedLogs: LogEntry[] = [];
  @State private searchQuery: string = '';

  //接收从父组件传来的 clearAllLogs 函数，清除日志
  clearAllLogs: () => void = () => {};

  onAllLogsUpdated() {
    console.info('TaskLog:检测到父组件日志更新，同步刷新界面。');
    // 当父组件的数据源改变时（例如清空后），同步更新子组件的显示数据
    // 同时清空搜索框，确保显示的是最新的完整列表
    this.searchQuery = '';
    this.displayedLogs = this.allLogItems;
  }

  aboutToAppear() {
    this.displayedLogs = this.allLogItems;
  }

  performSearch() {
    if (!this.searchQuery.trim()) {
      this.displayedLogs = this.allLogItems;
      return;
    }
    const query = this.searchQuery.toLowerCase();
    const filtered = this.allLogItems.filter(item =>
    item.level.toLowerCase().includes(query) ||
    item.timestamp.toLowerCase().includes(query) ||
    item.message.toLowerCase().includes(query)
    );
    this.displayedLogs = filtered;
  }

  private getLevelStyle(level: 'info' | 'warning' | 'error'): LevelStyle {
    switch (level) {
      case 'info':
        return { icon: $r('app.media.log_info'), color: Color.White };
      case 'warning':
        return { icon: $r('app.media.log_warming'), color: Color.Yellow };
      case 'error':
        return { icon: $r('app.media.log_error'), color: Color.Red };
    }
  }

  build() {
    Column() {
      Row({ space: 10 }) {
        Row() {
          Image($r('app.media.search'))
            .width(20)
            .height(20)
            .fillColor(Color.Gray)
            .margin({ left: 15 })

          TextInput({ placeholder: '搜索等级/时间/内容...' })
            .placeholderColor('rgba(255, 255, 255, 0.6)')
            .fontColor(Color.White)
            .fontSize(16)
            .layoutWeight(1)
            .backgroundColor(Color.Transparent)
            .onChange((value: string) => { this.searchQuery = value; })
            .onSubmit(() => { this.performSearch(); })
        }
        .layoutWeight(1)
        .height(50)
        .borderRadius(15)
        .backgroundColor('rgba(255, 255, 255, 0.15)')
        .border({ width: 1.5, color: 'rgba(255, 255, 255, 0.2)' })

        Button('搜索')
          .height(50).width(80).fontSize(16).fontWeight(FontWeight.Bold)
          .type(ButtonType.Capsule).backgroundColor('#1890ff')
          .onClick(() => { this.performSearch(); })

        Button('清除')
          .height(50).width(80).fontSize(16).fontWeight(FontWeight.Bold)
          .type(ButtonType.Capsule).backgroundColor('rgba(255, 80, 80, 0.76)')
          .onClick(() => { this.clearAllLogs(); })

      }
      .width('100%')
      .margin({ bottom: 20 })

      Scroll() {
        Column({ space: 12 }) {
          ForEach(
            this.displayedLogs,
            (item: LogEntry) => {
              // 确保 Row 组件内包含用于显示内容的子组件
              Row({ space: 15 }) {
                // 等级图标
                Image(this.getLevelStyle(item.level).icon)
                  .width(24)
                  .height(24)
                  .fillColor(this.getLevelStyle(item.level).color)

                // 时间戳和消息
                Column({ space: 5 }) {
                  Text(item.message)
                    .fontSize(16)
                    .fontColor(Color.White)
                    .width('100%')
                    .textAlign(TextAlign.Start)

                  Text(item.timestamp)
                    .fontSize(12)
                    .fontColor(Color.Gray)
                    .width('100%')
                    .textAlign(TextAlign.Start)
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)
              }
              .width('100%')
              .padding(15)
              .backgroundColor('rgba(10, 10, 15, 0.3)')
              .borderRadius(12)
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
            },
            (item: LogEntry) => item.id.toString()
          )
        }
        .justifyContent(FlexAlign.Start)
        .width('100%')
      }
      .width('100%')
      .layoutWeight(1)
      .scrollable(ScrollDirection.Vertical)  // 启用垂直滚动
      .scrollBar(BarState.On)                // 显示滚动条
      .scrollBarColor('#888888')             // 更明显的滚动条颜色
      .scrollBarWidth(8)                    // 适当宽度
      .edgeEffect(EdgeEffect.Spring)         // 滑动边缘效果
    }
    .width('100%')
    .height('100%')
    .padding(24)
    .alignItems(HorizontalAlign.Start)
  }
}