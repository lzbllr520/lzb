
@Component
export struct IconTab {
  // 接收父组件传入的图标资源
  @Prop private icon: Resource;
  // 接收父组件传入的是否为“当前选中”的状态
  @Prop private isSelected: boolean;

  // 组件内部状态，用于追踪是否被按下
  @State private isPressed: boolean = false;

  build() {
    Column() {
      // 显示图标
      Image(this.icon)
        .width(28)
        .height(28)
        .fillColor(this.isSelected ? Color.White : 'rgba(255, 255, 255, 0.6)')
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    // 背景色：选中时有高亮效果
    .backgroundColor(this.isSelected ? 'rgba(255, 255, 255, 0.15)' : Color.Transparent)
    .borderRadius(12)
    // 动画效果：当背景色、缩放、颜色等属性变化时，平滑过渡
    .animation({ duration: 200, curve: Curve.EaseInOut })
    // 缩放效果：按下时缩小，松开时恢复
    .scale({ x: this.isPressed ? 0.9 : 1.0, y: this.isPressed ? 0.9 : 1.0 })
    // 触摸事件：用于更新 isPressed 状态
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