if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RoboticArmWorkRangeView_Params {
    context?: CanvasRenderingContext2D;
    canvasWidth?: number;
    canvasHeight?: number;
    currentPos?: Point;
    targetPos?: Point;
    displayCurrentPos?: Point;
    displayTargetPos?: Point;
}
// ProtractorView.ets
// 定义一个坐标点类型，方便管理
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
        this.__canvasWidth = new ObservedPropertySimplePU(1, this, "canvasWidth");
        this.__canvasHeight = new ObservedPropertySimplePU(1, this, "canvasHeight");
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
        if (params.canvasWidth !== undefined) {
            this.canvasWidth = params.canvasWidth;
        }
        if (params.canvasHeight !== undefined) {
            this.canvasHeight = params.canvasHeight;
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
        this.__canvasWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__canvasHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__currentPos.purgeDependencyOnElmtId(rmElmtId);
        this.__targetPos.purgeDependencyOnElmtId(rmElmtId);
        this.__displayCurrentPos.purgeDependencyOnElmtId(rmElmtId);
        this.__displayTargetPos.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__canvasWidth.aboutToBeDeleted();
        this.__canvasHeight.aboutToBeDeleted();
        this.__currentPos.aboutToBeDeleted();
        this.__targetPos.aboutToBeDeleted();
        this.__displayCurrentPos.aboutToBeDeleted();
        this.__displayTargetPos.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 使用 CanvasRenderingContext2D 进行2D图形绘制
    private context: CanvasRenderingContext2D;
    // ===================================================================
    // 状态管理与常量定义
    // ===================================================================
    // --- 新增：动态尺寸管理 ---
    private __canvasWidth: ObservedPropertySimplePU<number>; // 画布宽度 (初始值不重要)
    get canvasWidth() {
        return this.__canvasWidth.get();
    }
    set canvasWidth(newValue: number) {
        this.__canvasWidth.set(newValue);
    }
    private __canvasHeight: ObservedPropertySimplePU<number>; // 画布高度 (初始值不重要)
    get canvasHeight() {
        return this.__canvasHeight.get();
    }
    set canvasHeight(newValue: number) {
        this.__canvasHeight.set(newValue);
    }
    // --- 状态变量分离 (保持不变) ---
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
    /**
     * 将逻辑坐标 (中心为0,0) 转换为画布坐标
     * @param logicalCoords - {x, y} 格式的逻辑坐标
     * @returns {Point} {x, y} 格式的画布坐标
     */
    private logicalToCanvas(logicalCoords: Point): Point {
        return {
            x: this.centerX + logicalCoords.y,
            y: this.centerY - logicalCoords.x
        };
    }
    /**
     * 主绘制函数，它会调用所有子绘制函数
     */
    private redraw(): void {
        if (!this.context) {
            return;
        }
        // 使用动态尺寸清空画布
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawBase();
        this.drawTicksAndLabels();
        this.drawConcentricArcs();
        this.drawInteractivePoints();
    }
    // ===================================================================
    // 图形绘制函数 (保持大部分逻辑，但使用动态计算属性)
    // ===================================================================
    private drawBase(): void {
        const startAngleRad = 195 * Math.PI / 180;
        const endAngleRad = -15 * Math.PI / 180;
        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#495057';
        this.context.arc(this.centerX, this.centerY, this.radius, startAngleRad, endAngleRad, true);
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineTo(this.centerX + this.radius * Math.cos(startAngleRad), this.centerY + this.radius * Math.sin(startAngleRad));
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineTo(this.centerX + this.radius * Math.cos(endAngleRad), this.centerY + this.radius * Math.sin(endAngleRad));
        this.context.stroke();
        this.context.beginPath();
        this.context.fillStyle = '#495057';
        this.context.arc(this.centerX, this.centerY, 5, 0, 2 * Math.PI);
        this.context.fill();
    }
    private drawTicksAndLabels(): void {
        // 标签和刻度线的长度也相对于半径进行缩放
        const labelRadius = this.radius + (this.radius * 0.06);
        this.context.beginPath();
        this.context.lineWidth = 0.75;
        this.context.strokeStyle = '#adb5bd';
        this.context.setLineDash([3, 5]);
        for (let angle = -10; angle <= 190; angle += 10) {
            const angleRad = angle * Math.PI / 180;
            this.context.moveTo(this.centerX, this.centerY);
            this.context.lineTo(this.centerX + this.radius * Math.cos(angleRad), this.centerY + this.radius * Math.sin(angleRad));
        }
        this.context.stroke();
        this.context.setLineDash([]);
        for (let angle = -15; angle <= 195; angle++) {
            const angleRad = angle * Math.PI / 180;
            const startX = this.centerX + this.radius * Math.cos(angleRad);
            const startY = this.centerY + this.radius * Math.sin(angleRad);
            let tickLength = this.radius * 0.03; // 短刻度
            let tickWidth = 1;
            if (angle % 10 === 0 || angle === -15 || angle === 195) {
                tickLength = this.radius * 0.06; // 长刻度
                tickWidth = 2.5;
            }
            else if (angle % 5 === 0) {
                tickLength = this.radius * 0.045; // 中刻度
                tickWidth = 1.5;
            }
            const endX = this.centerX + (this.radius - tickLength) * Math.cos(angleRad);
            const endY = this.centerY + (this.radius - tickLength) * Math.sin(angleRad);
            this.context.beginPath();
            this.context.lineWidth = tickWidth;
            this.context.strokeStyle = '#495057';
            this.context.moveTo(startX, startY);
            this.context.lineTo(endX, endY);
            this.context.stroke();
            if (angle % 10 === 0 || angle === -15 || angle === 195) {
                const labelX = this.centerX + labelRadius * Math.cos(angleRad);
                const labelY = this.centerY + labelRadius * Math.sin(angleRad);
                this.context.save();
                this.context.translate(labelX, labelY);
                this.context.rotate(angleRad + Math.PI / 2);
                this.context.font = `bold ${this.radius * 0.04}px sans-serif`; // 字体大小也自适应
                this.context.fillStyle = '#212529';
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
        const startAngleRad = 195 * Math.PI / 180;
        const endAngleRad = -15 * Math.PI / 180;
        values.forEach(value => {
            const arcRadius = (value / maxDataValue) * this.radius;
            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.strokeStyle = '#868e96';
            this.context.setLineDash([4, 4]);
            this.context.arc(this.centerX, this.centerY, arcRadius, startAngleRad, endAngleRad, true);
            this.context.stroke();
            const labelAngleRad = 90 * Math.PI / 180;
            const labelX = this.centerX + arcRadius * Math.cos(labelAngleRad);
            const labelY = this.centerY + arcRadius * Math.sin(labelAngleRad) - 8;
            this.context.font = `${this.radius * 0.035}px sans-serif`;
            this.context.fillStyle = '#343a40';
            this.context.textAlign = 'center';
            this.context.textBaseline = 'alphabetic';
            this.context.fillText(value.toString(), labelX, labelY);
        });
        this.context.setLineDash([]);
    }
    private drawInteractivePoints(): void {
        const currentCanvasPos = this.logicalToCanvas(this.displayCurrentPos);
        this.context.beginPath();
        this.context.fillStyle = '#088107';
        this.context.strokeStyle = '#FFFFFF';
        this.context.lineWidth = 2;
        // 点的大小也自适应
        this.context.arc(currentCanvasPos.x, currentCanvasPos.y, this.radius * 0.02, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
        const targetCanvasPos = this.logicalToCanvas(this.displayTargetPos);
        this.context.beginPath();
        this.context.fillStyle = '#7F007F';
        this.context.strokeStyle = '#FFFFFF';
        this.context.lineWidth = 2;
        this.context.arc(targetCanvasPos.x, targetCanvasPos.y, this.radius * 0.02, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
    }
    // ===================================================================
    // 组件UI构建与交互
    // ===================================================================
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.backgroundColor('#e9ecef');
            Column.onAreaChange((oldValue, newValue) => {
                this.canvasWidth = newValue.width as number;
                this.canvasHeight = newValue.height as number;
                // 尺寸变化后，触发重绘
                this.redraw();
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.width('100%');
            Canvas.height('100%');
            Canvas.backgroundColor('#e9ecef');
            Canvas.onReady(() => {
                this.redraw();
            });
            Canvas.onClick((event: ClickEvent) => {
                // 逻辑坐标转换需要使用动态的中心点
                const clickedLogicalX = this.centerY - event.y;
                const clickedLogicalY = event.x - this.centerX;
                this.currentPos = this.targetPos;
                this.targetPos = { x: clickedLogicalX, y: clickedLogicalY };
                Context.animateTo({
                    duration: 400,
                    curve: Curve.EaseInOut
                }, () => {
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
