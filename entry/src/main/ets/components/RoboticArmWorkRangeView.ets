
import {Point, RobotArmState} from '.././model/RobotArmState'

@Component
export  struct RoboticArmWorkRangeView {
  // 使用 CanvasRenderingContext2D 进行2D图形绘制
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D();

  // 画布中心点坐标 (单位: vp)
  private readonly centerX: number = 450;
  private readonly centerY: number = 210;
  // 量角器主半径 (单位: vp)
  private readonly radius: number = 180;

  //提升状态信息
  @Link data: RobotArmState;

  //动画显示位置状态：这些变量用于在动画过程中实时更新并绘制在画布上。
  // @Watch 会监控它们的变化，并在每一帧触发 redraw。
  @State @Watch('redraw') private displayCurrentPos: Point = { x: 0, y: 0 };
  @State @Watch('redraw') private displayTargetPos: Point = { x: 0, y: 0 };

  aboutToUpdate() {
    this.syncPositions()
  }

  //将同步逻辑提取到一个独立的函数中，供 aboutToAppear 和 aboutToUpdate 调用。
  private syncPositions() {
    const initialCurrentPhysical = this.dataToPhysical(this.data.currentPos);
    const initialTargetPhysical = this.dataToPhysical(this.data.targetPos);

    // 检查一下，只有在物理坐标确实发生变化时才更新，避免不必要的UI刷新循环
    if (this.displayCurrentPos.x !== initialCurrentPhysical.x || this.displayCurrentPos.y !== initialCurrentPhysical.y) {
      this.displayCurrentPos = initialCurrentPhysical;
    }
    if (this.displayTargetPos.x !== initialTargetPhysical.x || this.displayTargetPos.y !== initialTargetPhysical.y) {
      this.displayTargetPos = initialTargetPhysical;
    }
  }

  //初始化时重新绘制点的坐标
  aboutToAppear() {
    // 将 this.data 中存储的【数据坐标】转换为【物理坐标】
    const initialCurrentPhysical = this.dataToPhysical(this.data.currentPos);
    const initialTargetPhysical = this.dataToPhysical(this.data.targetPos);
    //直接设置用于绘图的局部状态，让点在正确的位置上首次亮相
    this.displayCurrentPos = initialCurrentPhysical;
    this.displayTargetPos = initialTargetPhysical;
  }

  //用于初始化时根据物理点位来计算真是需要的点位
  private dataToPhysical(dataCoords: Point): Point {
    const maxDataValue = 250;
    const physicalX = dataCoords.x * (this.radius / maxDataValue);
    const physicalY = dataCoords.y * (this.radius / maxDataValue);
    return { x: physicalX, y: physicalY };
  }

  //将逻辑坐标 (中心为0,0) 转换为画布坐标
  private logicalToCanvas(logicalCoords: Point): Point {
    return {
      x: this.centerX + logicalCoords.y,
      y: this.centerY - logicalCoords.x
    };
  }

  //主绘制函数，它会调用所有子绘制函数
  private redraw(): void {
    if (!this.context) {
      return;
    }
    this.context.clearRect(0, 0, this.centerX * 2, this.centerY * 2);
    this.drawBase();
    this.drawTicksAndLabels();
    this.drawConcentricArcs();
    this.drawInteractivePoints();
  }

  // 图形绘制函数
  private drawBase(): void {
    //定义标签坐标系中的左右边界角度
    const leftBoundaryAngle_label = -15;  // 左边界是 -15 度
    const rightBoundaryAngle_label = 195; // 右边界是 195 度

    //将标签角度转换为 Canvas arc 函数所需的角度
    // 转换公式: canvas_angle = label_angle + 180
    const startAngleRad_canvas = (leftBoundaryAngle_label + 180) * Math.PI / 180; // 165度
    const endAngleRad_canvas = (rightBoundaryAngle_label + 180) * Math.PI / 180;   // 375度

    //主要轮廓线绘制
    this.context.beginPath();
    this.context.lineWidth = 1.5;
    this.context.strokeStyle = '#E9ECEF';

    //使用转换后的 Canvas 角度和正确的方向 (true/逆时针) 来绘制主弧线
    // 从 165° 逆时针画到 375°(相当于15°), 正好是上方的弧
    this.context.arc(this.centerX, this.centerY, this.radius, startAngleRad_canvas, endAngleRad_canvas, false);

    //绘制径向线时，必须使用原始的标签角度
    const leftBoundaryRad_label = leftBoundaryAngle_label * Math.PI / 180;
    const rightBoundaryRad_label = rightBoundaryAngle_label * Math.PI / 180;

    this.context.moveTo(this.centerX, this.centerY);
    this.context.lineTo(this.centerX - this.radius * Math.cos(leftBoundaryRad_label), this.centerY - this.radius * Math.sin(leftBoundaryRad_label));
    this.context.moveTo(this.centerX, this.centerY);
    this.context.lineTo(this.centerX - this.radius * Math.cos(rightBoundaryRad_label), this.centerY - this.radius * Math.sin(rightBoundaryRad_label));

    this.context.stroke();

    //中心点绘制
    this.context.beginPath();
    this.context.fillStyle = '#C92A2A';
    this.context.arc(this.centerX, this.centerY, 4, 0, 2 * Math.PI);
    this.context.fill();
  }
  private drawTicksAndLabels(): void {
    const labelRadius = this.radius + 18;
    this.context.beginPath();
    this.context.lineWidth = 0.75;
    //辅助虚线颜色
    this.context.strokeStyle = '#495057';
    this.context.setLineDash([3, 5]);
    for (let angle = -10; angle <= 190; angle += 10) {
      const angleRad = angle * Math.PI / 180;
      this.context.moveTo(this.centerX, this.centerY);
      this.context.lineTo(this.centerX - this.radius * Math.cos(angleRad), this.centerY - this.radius * Math.sin(angleRad));
    }
    this.context.stroke();
    this.context.setLineDash([]);
    for (let angle = -15; angle <= 195; angle++) {
      const angleRad = angle * Math.PI / 180;
      const startX = this.centerX - this.radius * Math.cos(angleRad);
      const startY = this.centerY - this.radius * Math.sin(angleRad);
      let tickLength = 6;
      let tickWidth = 1;
      if (angle % 10 === 0 || angle === -15 || angle === 195) {
        tickLength = 18;
        tickWidth = 2;
      } else if (angle % 5 === 0) {
        tickLength = 14;
        tickWidth = 1.5;
      }
      const endX = this.centerX - (this.radius - tickLength) * Math.cos(angleRad);
      const endY = this.centerY - (this.radius - tickLength) * Math.sin(angleRad);
      this.context.beginPath();
      this.context.lineWidth = tickWidth;
      //刻度线颜色
      this.context.strokeStyle = '#E9ECEF';
      this.context.moveTo(startX, startY);
      this.context.lineTo(endX, endY);
      this.context.stroke();
      if (angle % 10 === 0 || angle === -15 || angle === 195) {
        const labelX = this.centerX - labelRadius * Math.cos(angleRad);
        const labelY = this.centerY - labelRadius * Math.sin(angleRad);
        this.context.save();
        this.context.translate(labelX, labelY);
        this.context.rotate(angleRad - Math.PI / 2);
        this.context.font = 'bold 14px sans-serif';
        //刻度线数字颜色
        this.context.fillStyle = '#F8F9FA';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(angle.toString(), 0, 0);
        this.context.restore();
      }
    }
  }
  private drawConcentricArcs(): void {
    const values = [50, 100, 150, 200];
    const maxDataValue = 250;

    //定义与 drawBase 一致的边界角度并进行转换
    const leftBoundaryAngle_label = -15;
    const rightBoundaryAngle_label = 195;
    const startAngleRad_canvas = (leftBoundaryAngle_label + 180) * Math.PI / 180;
    const endAngleRad_canvas = (rightBoundaryAngle_label + 180) * Math.PI / 180;

    values.forEach(value => {
      const arcRadius = (value / maxDataValue) * this.radius;
      this.context.beginPath();
      this.context.lineWidth = 1;
      //同心圆弧颜色
      this.context.strokeStyle = '#495057';
      this.context.setLineDash([4, 4]);

      //使用转换后的 Canvas 角度绘制同心圆弧
      this.context.arc(this.centerX, this.centerY, arcRadius, startAngleRad_canvas, endAngleRad_canvas, false);

      this.context.stroke();
      const labelAngleRad = 90 * Math.PI / 180; // 90度在标签坐标系里是正上方，计算位置无误
      const labelX = this.centerX - arcRadius * Math.cos(labelAngleRad);
      const labelY = this.centerY - arcRadius * Math.sin(labelAngleRad) - 8;
      this.context.font = '14px sans-serif';
      //同心圆数字颜色
      this.context.fillStyle = '#868e96';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'alphabetic';
      this.context.fillText(value.toString(), labelX, labelY);
    });

    this.context.setLineDash([]);
  }

  //绘制可交互的两个点（当前点和目标点）
  private drawInteractivePoints(): void {
    // 绘制绿色 "当前点"
    const currentCanvasPos = this.logicalToCanvas(this.displayCurrentPos);
    this.context.beginPath();
    this.context.fillStyle = '#088107';
    this.context.strokeStyle = '#FFFFFF'; // 添加白色描边，使其更清晰
    this.context.lineWidth = 1;
    this.context.arc(currentCanvasPos.x, currentCanvasPos.y, 8, 0, 2 * Math.PI);
    this.context.fill();
    this.context.stroke();

    // 绘制紫色 "目标点"
    const targetCanvasPos = this.logicalToCanvas(this.displayTargetPos);
    this.context.beginPath();
    this.context.fillStyle = '#7F007F';
    this.context.strokeStyle = '#FFFFFF'; // 添加白色描边
    this.context.lineWidth = 1;
    this.context.arc(targetCanvasPos.x, targetCanvasPos.y, 8, 0, 2 * Math.PI);
    this.context.fill();
    this.context.stroke();
  }

  build() {
    Column() {
      Stack({ alignContent: Alignment.Start }) {
        //使用 Path 绘制 L 形的边框
        Path()
          .width(60)
          .height(60)
          .commands('M 5 5 L 5 55 L 55 55')
          .stroke(Color.White)
          .strokeWidth(2)

        //放置 X 轴的文字
        // 这部分代码也保持不变，因为它的坐标是相对于Stack左上角的
        Text('X /mm')
          .fontSize(12)
          .fontColor(Color.White)
          .position({ x: 0, y: -5 })

        //放置 Y 轴的文字
        // 这部分代码也保持不变
        Text('Y /mm')
          .fontSize(12)
          .fontColor(Color.White)
          .position({ x: 45, y: 40 })
      }
      .width('100%') // 宽度为100%
      .height(80)    // 高度保持不变

      Canvas(this.context)
        .width('900vp')
        .height('290vp')
        .onReady(() => {
          this.redraw();
        })
        .onClick((event: ClickEvent) => {

          //计算【物理】逻辑坐标 (相对于中心点)
          const clickedPhysicalX = this.centerY - event.y;
          const clickedPhysicalY = event.x - this.centerX;

          //边界值计算
          const distance = Math.sqrt(clickedPhysicalX ** 2 + clickedPhysicalY ** 2);

          //使用正确的参数计算角度
          const angleRad = Math.atan2(clickedPhysicalX, clickedPhysicalY);
          let angleDeg = angleRad * 180 / Math.PI;

          //将角度归一化到 [0, 360) 范围，以便于比较
          if (angleDeg < 0) {
            angleDeg += 360;
          }

          //在归一化后的角度上进行边界检查
          const lowerBound = 345; // 相当于 -15°
          const upperBound = 195;

          if (distance <= this.radius && (angleDeg >= lowerBound || angleDeg <= upperBound)) {

            //如果在范围内，执行原有逻辑
            //计算正确的【数据坐标】用于存储
            const maxDataValue = 250;
            const scaledForDisplayX = clickedPhysicalX * (maxDataValue / this.radius);
            const scaledForDisplayY = clickedPhysicalY * (maxDataValue / this.radius);

            //更新数据模型，必须使用【数据坐标】
            this.data.currentPos = this.data.targetPos;
            this.data.targetPos = { x: scaledForDisplayX, y: scaledForDisplayY };

            //触发UI动画，必须使用【物理坐标】
            animateTo({
              duration: 400,
              curve: Curve.EaseInOut
            }, () => {
              this.displayCurrentPos = this.displayTargetPos;
              this.displayTargetPos = { x: clickedPhysicalX, y: clickedPhysicalY };
            });
          } else {
            // 超出有效范围，不执行任何操作。
          }
        })

      //修正下方坐标显示，使其直接从 this.data 读取
      Row({ space: 15 }) {
        Row({ space: 5 }) {
          Circle({ width: 13, height: 13 }).fill('#088107') // 绿色标识
          Text('当前坐标:')
            .fontSize(12)
            .fontColor('#E9ECEF')
          //从 this.data.currentPos 读取
          Text(`(x: ${this.data.currentPos.x.toFixed(2)}, y: ${this.data.currentPos.y.toFixed(2)}`)
            .fontSize(12)
            .fontWeight(FontWeight.Bold)
            .fontColor('#F8F9FA')
        }
        .alignItems(VerticalAlign.Center)

        Row({ space: 5 }) {
          Circle({ width: 13, height: 13 }).fill('#7F007F') // 紫色标识
          Text('目标坐标:')
            .fontSize(12)
            .fontColor('#E9ECEF')
          //从 this.data.targetPos 读取
          Text(`(x: ${this.data.targetPos.x.toFixed(2)}, y: ${this.data.targetPos.y.toFixed(2)}`)
            .fontSize(12)
            .fontWeight(FontWeight.Bold)
            .fontColor('#F8F9FA')
        }
        .alignItems(VerticalAlign.Center)
      }
      .margin({ top: 20 })
      .width('100%')
      .borderRadius(8)
      .justifyContent(FlexAlign.Center)
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}
