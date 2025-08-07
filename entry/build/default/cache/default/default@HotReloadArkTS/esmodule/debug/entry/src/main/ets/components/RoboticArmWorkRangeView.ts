if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RoboticArmWorkRangeView_Params {
    redrawTrigger?: number;
    context?: CanvasRenderingContext2D;
    centerX?: number;
    centerY?: number;
    radius?: number;
    data?: RobotArmState;
    displayPos?: Point;
    onTargetSelected?: () => void;
}
import type { Point, RobotArmState } from '.././model/RobotArmState';
export class RoboticArmWorkRangeView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__redrawTrigger = new SynchedPropertySimpleOneWayPU(params.redrawTrigger, this, "redrawTrigger");
        this.context = new CanvasRenderingContext2D();
        this.centerX = 450;
        this.centerY = 210;
        this.radius = 180;
        this.__data = new SynchedPropertyObjectTwoWayPU(params.data, this, "data");
        this.__displayPos = new ObservedPropertyObjectPU({ x: 0, y: 0 }, this, "displayPos");
        this.onTargetSelected = () => { };
        this.setInitiallyProvidedValue(params);
        this.declareWatch("redrawTrigger", this.onRedrawTrigger);
        this.declareWatch("displayPos", this.redraw);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RoboticArmWorkRangeView_Params) {
        if (params.redrawTrigger === undefined) {
            this.__redrawTrigger.set(0);
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.centerX !== undefined) {
            this.centerX = params.centerX;
        }
        if (params.centerY !== undefined) {
            this.centerY = params.centerY;
        }
        if (params.radius !== undefined) {
            this.radius = params.radius;
        }
        if (params.displayPos !== undefined) {
            this.displayPos = params.displayPos;
        }
        if (params.onTargetSelected !== undefined) {
            this.onTargetSelected = params.onTargetSelected;
        }
    }
    updateStateVars(params: RoboticArmWorkRangeView_Params) {
        this.__redrawTrigger.reset(params.redrawTrigger);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__redrawTrigger.purgeDependencyOnElmtId(rmElmtId);
        this.__data.purgeDependencyOnElmtId(rmElmtId);
        this.__displayPos.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__redrawTrigger.aboutToBeDeleted();
        this.__data.aboutToBeDeleted();
        this.__displayPos.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __redrawTrigger: SynchedPropertySimpleOneWayPU<number>;
    get redrawTrigger() {
        return this.__redrawTrigger.get();
    }
    set redrawTrigger(newValue: number) {
        this.__redrawTrigger.set(newValue);
    }
    onRedrawTrigger() {
        this.redraw();
    }
    // 使用 CanvasRenderingContext2D 进行2D图形绘制
    private context: CanvasRenderingContext2D;
    // 画布中心点坐标 (单位: vp)
    private readonly centerX: number;
    private readonly centerY: number;
    // 量角器主半径 (单位: vp)
    private readonly radius: number;
    // 提升状态信息，我们现在只关心 currentPos
    private __data: SynchedPropertySimpleOneWayPU<RobotArmState>;
    get data() {
        return this.__data.get();
    }
    set data(newValue: RobotArmState) {
        this.__data.set(newValue);
    }
    // 动画显示位置状态：该变量用于在动画过程中实时更新并绘制在画布上。
    // @Watch 会监控它的变化，并在每一帧触发 redraw。
    private __displayPos: ObservedPropertyObjectPU<Point>;
    get displayPos() {
        return this.__displayPos.get();
    }
    set displayPos(newValue: Point) {
        this.__displayPos.set(newValue);
    }
    private onTargetSelected: () => void;
    // aboutToUpdate 会在 @Link 的 data 发生外部变化时触发
    aboutToUpdate() {
        this.syncPosition();
    }
    // 将同步逻辑提取到一个独立的函数中
    private syncPosition() {
        // 将外部数据坐标转换为用于绘图的物理坐标
        const physicalPos = this.dataToPhysical(this.data.currentPos);
        // 只有在物理坐标确实发生变化时才更新，避免不必要的UI刷新循环
        if (this.displayPos.x !== physicalPos.x || this.displayPos.y !== physicalPos.y) {
            this.displayPos = physicalPos;
        }
    }
    // 初始化时，设置点的初始位置并重新绘制
    aboutToAppear() {
        // 直接将 this.data 中存储的【数据坐标】转换为【物理坐标】来设置初始显示位置
        this.displayPos = this.dataToPhysical(this.data.currentPos);
    }
    // 将数据坐标 (例如，最大值为330) 转换为画布上的物理坐标 (在半径范围内)
    private dataToPhysical(dataCoords: Point): Point {
        const maxDataValue = 330;
        const physicalX = dataCoords.x * (this.radius / maxDataValue);
        const physicalY = dataCoords.y * (this.radius / maxDataValue);
        return { x: physicalX, y: physicalY };
    }
    // 将逻辑坐标 (中心为0,0, Y轴向上) 转换为画布坐标 (左上角为0,0, Y轴向下)
    private logicalToCanvas(logicalCoords: Point): Point {
        return {
            x: this.centerX + logicalCoords.y,
            y: this.centerY - logicalCoords.x
        };
    }
    // 主绘制函数，它会调用所有子绘制函数
    private redraw(): void {
        if (!this.context) {
            return;
        }
        this.syncPosition();
        this.context.clearRect(0, 0, this.centerX * 2, this.centerY * 2);
        this.drawBase();
        this.drawTicksAndLabels();
        this.drawConcentricArcs();
        this.drawInteractivePoint();
    }
    // --- 背景绘制函数 (drawBase, drawTicksAndLabels, drawConcentricArcs) 保持不变 ---
    // --- 为了简洁，这里省略了这些函数的代码，您可以直接使用您原来的代码 ---
    private drawBase(): void {
        const leftBoundaryAngle_label = -15;
        const rightBoundaryAngle_label = 195;
        const startAngleRad_canvas = (leftBoundaryAngle_label + 180) * Math.PI / 180;
        const endAngleRad_canvas = (rightBoundaryAngle_label + 180) * Math.PI / 180;
        this.context.beginPath();
        this.context.lineWidth = 1.5;
        this.context.strokeStyle = '#E9ECEF';
        this.context.arc(this.centerX, this.centerY, this.radius, startAngleRad_canvas, endAngleRad_canvas, false);
        const leftBoundaryRad_label = leftBoundaryAngle_label * Math.PI / 180;
        const rightBoundaryRad_label = rightBoundaryAngle_label * Math.PI / 180;
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineTo(this.centerX - this.radius * Math.cos(leftBoundaryRad_label), this.centerY - this.radius * Math.sin(leftBoundaryRad_label));
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineTo(this.centerX - this.radius * Math.cos(rightBoundaryRad_label), this.centerY - this.radius * Math.sin(rightBoundaryRad_label));
        this.context.stroke();
        this.context.beginPath();
        this.context.fillStyle = '#C92A2A';
        this.context.arc(this.centerX, this.centerY, 4, 0, 2 * Math.PI);
        this.context.fill();
    }
    private drawTicksAndLabels(): void {
        const labelRadius = this.radius + 18;
        this.context.beginPath();
        this.context.lineWidth = 0.75;
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
            }
            else if (angle % 5 === 0) {
                tickLength = 14;
                tickWidth = 1.5;
            }
            const endX = this.centerX - (this.radius - tickLength) * Math.cos(angleRad);
            const endY = this.centerY - (this.radius - tickLength) * Math.sin(angleRad);
            this.context.beginPath();
            this.context.lineWidth = tickWidth;
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
                this.context.fillStyle = '#F8F9FA';
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                this.context.fillText(angle.toString(), 0, 0);
                this.context.restore();
            }
        }
    }
    private drawConcentricArcs(): void {
        const values = [50, 100, 150, 200, 250, 300];
        const maxDataValue = 330;
        const leftBoundaryAngle_label = -15;
        const rightBoundaryAngle_label = 195;
        const startAngleRad_canvas = (leftBoundaryAngle_label + 180) * Math.PI / 180;
        const endAngleRad_canvas = (rightBoundaryAngle_label + 180) * Math.PI / 180;
        values.forEach(value => {
            const arcRadius = (value / maxDataValue) * this.radius;
            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.strokeStyle = '#495057';
            this.context.setLineDash([4, 4]);
            this.context.arc(this.centerX, this.centerY, arcRadius, startAngleRad_canvas, endAngleRad_canvas, false);
            this.context.stroke();
            const labelAngleRad = 90 * Math.PI / 180;
            const labelX = this.centerX - arcRadius * Math.cos(labelAngleRad);
            const labelY = this.centerY - arcRadius * Math.sin(labelAngleRad) - 8;
            this.context.font = '14px sans-serif';
            this.context.fillStyle = '#868e96';
            this.context.textAlign = 'center';
            this.context.textBaseline = 'alphabetic';
            this.context.fillText(value.toString(), labelX, labelY);
        });
        this.context.setLineDash([]);
    }
    // 绘制可交互的点（现在只有一个绿色的点）
    private drawInteractivePoint(): void {
        // 绘制绿色 "当前点"
        const currentCanvasPos = this.logicalToCanvas(this.displayPos);
        this.context.beginPath();
        this.context.fillStyle = '#088107';
        this.context.strokeStyle = '#FFFFFF'; // 添加白色描边，使其更清晰
        this.context.lineWidth = 1;
        this.context.arc(currentCanvasPos.x, currentCanvasPos.y, 8, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // --- 顶部的坐标轴UI保持不变 ---
            Stack.create({ alignContent: Alignment.Start });
            // --- 顶部的坐标轴UI保持不变 ---
            Stack.width('100%');
            // --- 顶部的坐标轴UI保持不变 ---
            Stack.height(80);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Path.create();
            Path.width(60);
            Path.height(60);
            Path.commands('M 5 5 L 5 55 L 55 55');
            Path.stroke(Color.White);
            Path.strokeWidth(2);
        }, Path);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('X /mm');
            Text.fontSize(12);
            Text.fontColor(Color.White);
            Text.position({ x: 0, y: -5 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Y /mm');
            Text.fontSize(12);
            Text.fontColor(Color.White);
            Text.position({ x: 45, y: 40 });
        }, Text);
        Text.pop();
        // --- 顶部的坐标轴UI保持不变 ---
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.width('900vp');
            Canvas.height('290vp');
            Canvas.onReady(() => {
                this.redraw();
            });
            Canvas.onClick((event: ClickEvent) => {
                // 计算点击点相对于画布中心点的【物理】逻辑坐标
                const clickedPhysicalX = this.centerY - event.y;
                const clickedPhysicalY = event.x - this.centerX;
                // --- 边界值检查 (这部分逻辑保持不变) ---
                const distance = Math.sqrt(clickedPhysicalX ** 2 + clickedPhysicalY ** 2);
                const angleRad = Math.atan2(clickedPhysicalX, clickedPhysicalY);
                let angleDeg = angleRad * 180 / Math.PI;
                if (angleDeg < 0) {
                    angleDeg += 360;
                }
                const lowerBound = 345; // 相当于 -15°
                const upperBound = 195;
                // 检查点击是否在有效的扇形区域内
                if (distance <= this.radius && (angleDeg >= lowerBound || angleDeg <= upperBound)) {
                    // 1. 将点击的【物理坐标】换算回【数据坐标】，用于更新数据模型
                    const maxDataValue = 330;
                    const scaledForDataX = clickedPhysicalX * (maxDataValue / this.radius);
                    const scaledForDataY = clickedPhysicalY * (maxDataValue / this.radius);
                    // 2. 更新数据模型
                    this.data.currentPos = {
                        x: parseFloat(scaledForDataX.toFixed(2)),
                        y: parseFloat(scaledForDataY.toFixed(2))
                    };
                    this.onTargetSelected();
                    // 3. 触发UI动画：直接将用于显示的 @State 变量更新为点击的【物理坐标】
                    Context.animateTo({
                        duration: 400,
                        curve: Curve.EaseInOut // 动画曲线
                    }, () => {
                        // 动画的目标是新的物理坐标
                        this.displayPos = { x: clickedPhysicalX, y: clickedPhysicalY };
                    });
                }
                else {
                    // 如果点击超出有效范围，则不执行任何操作
                }
            });
        }, Canvas);
        Canvas.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 修正下方坐标显示，只显示当前点的信息
            Row.create({ space: 15 });
            // 修正下方坐标显示，只显示当前点的信息
            Row.margin({ top: 20 });
            // 修正下方坐标显示，只显示当前点的信息
            Row.width('100%');
            // 修正下方坐标显示，只显示当前点的信息
            Row.borderRadius(8);
            // 修正下方坐标显示，只显示当前点的信息
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 5 });
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create({ width: 13, height: 13 });
            Circle.fill('#088107');
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('当前坐标:');
            Text.fontSize(12);
            Text.fontColor('#E9ECEF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 直接从 this.data.currentPos 读取并显示
            Text.create(`(x: ${this.data.currentPos.x.toFixed(2)}, y: ${this.data.currentPos.y.toFixed(2)})`);
            // 直接从 this.data.currentPos 读取并显示
            Text.fontSize(12);
            // 直接从 this.data.currentPos 读取并显示
            Text.fontWeight(FontWeight.Bold);
            // 直接从 this.data.currentPos 读取并显示
            Text.fontColor('#F8F9FA');
        }, Text);
        // 直接从 this.data.currentPos 读取并显示
        Text.pop();
        Row.pop();
        // 修正下方坐标显示，只显示当前点的信息
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
