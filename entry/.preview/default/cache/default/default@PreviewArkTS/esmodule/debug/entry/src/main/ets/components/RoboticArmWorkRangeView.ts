if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RoboticArmWorkRangeView_Params {
    context?: CanvasRenderingContext2D;
    centerX?: number;
    centerY?: number;
    radius?: number;
    currentPos?: Point;
    targetPos?: Point;
    displayCurrentPos?: Point;
    displayTargetPos?: Point;
}
// 定义一个坐标点类型
interface Point {
    x: number;
    y: number;
}
export class RoboticArmWorkRangeView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.context = new CanvasRenderingContext2D();
        this.centerX = 450;
        this.centerY = 300;
        this.radius = 180;
        this.__currentPos = new ObservedPropertyObjectPU({ x: 0, y: 0 }, this, "currentPos");
        this.__targetPos = new ObservedPropertyObjectPU({ x: 0, y: 0 }, this, "targetPos");
        this.__displayCurrentPos = new ObservedPropertyObjectPU({ x: 0, y: 0 }, this, "displayCurrentPos");
        this.__displayTargetPos = new ObservedPropertyObjectPU({ x: 0, y: 0 }, this, "displayTargetPos");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("displayCurrentPos", this.redraw);
        this.declareWatch("displayTargetPos", this.redraw);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RoboticArmWorkRangeView_Params) {
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
        if (params.currentPos !== undefined) {
            this.currentPos = params.currentPos;
        }
        if (params.targetPos !== undefined) {
            this.targetPos = params.targetPos;
        }
        if (params.displayCurrentPos !== undefined) {
            this.displayCurrentPos = params.displayCurrentPos;
        }
        if (params.displayTargetPos !== undefined) {
            this.displayTargetPos = params.displayTargetPos;
        }
    }
    updateStateVars(params: RoboticArmWorkRangeView_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentPos.purgeDependencyOnElmtId(rmElmtId);
        this.__targetPos.purgeDependencyOnElmtId(rmElmtId);
        this.__displayCurrentPos.purgeDependencyOnElmtId(rmElmtId);
        this.__displayTargetPos.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentPos.aboutToBeDeleted();
        this.__targetPos.aboutToBeDeleted();
        this.__displayCurrentPos.aboutToBeDeleted();
        this.__displayTargetPos.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 使用 CanvasRenderingContext2D 进行2D图形绘制
    private context: CanvasRenderingContext2D;
    // 画布中心点坐标 (单位: vp)
    private readonly centerX: number;
    private readonly centerY: number;
    // 量角器主半径 (单位: vp)
    private readonly radius: number;
    //最终目标位置状态：这些变量存储点的最终位置，在点击时立即更新。
    private __currentPos: ObservedPropertyObjectPU<Point>;
    get currentPos() {
        return this.__currentPos.get();
    }
    set currentPos(newValue: Point) {
        this.__currentPos.set(newValue);
    }
    private __targetPos: ObservedPropertyObjectPU<Point>;
    get targetPos() {
        return this.__targetPos.get();
    }
    set targetPos(newValue: Point) {
        this.__targetPos.set(newValue);
    }
    //动画显示位置状态：这些变量用于在动画过程中实时更新并绘制在画布上。
    // @Watch 会监控它们的变化，并在每一帧触发 redraw。
    private __displayCurrentPos: ObservedPropertyObjectPU<Point>;
    get displayCurrentPos() {
        return this.__displayCurrentPos.get();
    }
    set displayCurrentPos(newValue: Point) {
        this.__displayCurrentPos.set(newValue);
    }
    private __displayTargetPos: ObservedPropertyObjectPU<Point>;
    get displayTargetPos() {
        return this.__displayTargetPos.get();
    }
    set displayTargetPos(newValue: Point) {
        this.__displayTargetPos.set(newValue);
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
        const leftBoundaryAngle_label = -15; // 左边界是 -15 度
        const rightBoundaryAngle_label = 195; // 右边界是 195 度
        //将标签角度转换为 Canvas arc 函数所需的角度
        // 转换公式: canvas_angle = label_angle + 180
        const startAngleRad_canvas = (leftBoundaryAngle_label + 180) * Math.PI / 180; // 165度
        const endAngleRad_canvas = (rightBoundaryAngle_label + 180) * Math.PI / 180; // 375度
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
            }
            else if (angle % 5 === 0) {
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
    // 组件UI构建与交互
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/RoboticArmWorkRangeView.ets(197:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.debugLine("entry/src/main/ets/components/RoboticArmWorkRangeView.ets(198:7)", "entry");
            Canvas.width('900vp');
            Canvas.height('600vp');
            Canvas.onReady(() => {
                this.redraw();
            });
            Canvas.onClick((event: ClickEvent) => {
                // 将点击的画布坐标转换为逻辑坐标
                const clickedLogicalX = this.centerY - event.y;
                const clickedLogicalY = event.x - this.centerX;
                //确定并立即更新最终的目标位置
                //    - 新的 "当前点" 应该是旧的 "目标点"
                //    - 新的 "目标点" 应该是刚点击的位置
                this.currentPos = this.targetPos;
                this.targetPos = { x: clickedLogicalX, y: clickedLogicalY };
                //使用 animateTo 驱动 "显示位置" 的变化，产生动画
                Context.animateTo({
                    duration: 400,
                    curve: Curve.EaseInOut
                }, () => {
                    // 让 display...Pos 从当前值过渡到新的最终值
                    this.displayCurrentPos = this.currentPos;
                    this.displayTargetPos = this.targetPos;
                });
            });
        }, Canvas);
        Canvas.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
