if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ExcalidrawShapeViewer_Params {
    settings?: RenderingContextSettings;
    context?: CanvasRenderingContext2D;
    canvasWidth?: number;
    canvasHeight?: number;
    shapePoints?: number[][];
}
class ExcalidrawShapeViewer extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.settings = new RenderingContextSettings(true);
        this.context = new CanvasRenderingContext2D(this.settings);
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.shapePoints = [
            [0, 0], [2.15, 2.15], [7.52, 8.6], [17.2, 19.89], [32.79, 37.09],
            [51.07, 58.06], [72.04, 80.1], [95.69, 102.68], [122.58, 124.73],
            [150.53, 146.77], [182.25, 167.74], [215.59, 187.09], [250, 204.83],
            [287.09, 219.35], [323.65, 231.18], [356.98, 239.24], [388.7, 243.54],
            [415.05, 245.69], [436.55, 245.69], [452.15, 245.16], [463.44, 243.54],
            [471.5, 241.93], [476.88, 239.24], [481.18, 236.55], [483.87, 232.79],
            [486.02, 227.41], [488.7, 219.89], [491.39, 206.45], [491.93, 191.93],
            [491.93, 178.49], [490.86, 165.05], [487.63, 151.61], [481.72, 138.17],
            [472.58, 124.73], [460.21, 111.29], [443.01, 97.31], [421.5, 84.4],
            [395.16, 72.04], [361.29, 61.82], [320.96, 54.83], [275.8, 51.07],
            [228.49, 51.61], [180.64, 59.13], [133.33, 72.58], [91.39, 92.47],
            [53.22, 117.2], [20.96, 144.62], [-6.45, 175.8], [-26.88, 206.45],
            [-40.32, 236.02], [-48.92, 260.75], [-51.61, 280.1], [-51.61, 295.69],
            [-48.92, 307.52], [-44.08, 319.35], [-37.63, 329.56], [-29.56, 339.78],
            [-19.89, 347.84], [-5.91, 355.91], [9.67, 361.29], [30.64, 365.59],
            [56.45, 366.66], [87.63, 366.12], [123.11, 361.29], [162.36, 352.68],
            [203.76, 339.78], [245.69, 322.58], [286.02, 302.68], [322.04, 282.25],
            [352.68, 261.29], [376.34, 241.93], [392.47, 225.8], [403.76, 211.82],
            [411.82, 197.84], [417.2, 185.48], [420.43, 173.11], [422.04, 160.21],
            [420.96, 148.38], [416.66, 134.4], [409.67, 120.96], [400, 109.67],
            [388.17, 98.92], [373.11, 88.7], [356.98, 80.64], [338.7, 75.8],
            [317.2, 75.8], [291.93, 79.56], [263.44, 91.93], [233.33, 111.82],
            [201.61, 140.86], [170.96, 177.95], [142.47, 219.35], [118.81, 258.6],
            [101.07, 294.62], [90.86, 322.58], [86.02, 341.93], [86.02, 354.3],
            [87.63, 365.05], [94.08, 375.26], [103.76, 387.09], [117.74, 398.38],
            [136.02, 409.13], [159.67, 419.89], [186.02, 429.03], [213.44, 435.48],
            [241.39, 439.78], [269.35, 441.93], [297.31, 443.01], [323.65, 442.47],
            [348.92, 439.24], [373.11, 432.79], [394.08, 422.58], [410.75, 410.75],
            [423.65, 399.46], [432.25, 388.17], [438.7, 379.03], [441.39, 372.04],
            [441.39, 372.04]
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ExcalidrawShapeViewer_Params) {
        if (params.settings !== undefined) {
            this.settings = params.settings;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.canvasWidth !== undefined) {
            this.canvasWidth = params.canvasWidth;
        }
        if (params.canvasHeight !== undefined) {
            this.canvasHeight = params.canvasHeight;
        }
        if (params.shapePoints !== undefined) {
            this.shapePoints = params.shapePoints;
        }
    }
    updateStateVars(params: ExcalidrawShapeViewer_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private settings: RenderingContextSettings;
    private context: CanvasRenderingContext2D;
    private canvasWidth: number;
    private canvasHeight: number;
    // 1. 从你的 .excalidraw 文件中提取的坐标数据
    private [cite_start]; // 数据来源：你上传的文件中的 elements[0].points 数组 [cite: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
    // 1. 从你的 .excalidraw 文件中提取的坐标数据
    [cite_start]; // 数据来源：你上传的文件中的 elements[0].points 数组 [cite: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
    private readonly shapePoints: number[][];
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center });
            Flex.debugLine("entry/src/main/ets/pages/RoboticArmWorkRangeView.ets(47:5)", "entry");
            Flex.width('100%');
            Flex.height('100%');
            Flex.padding(20);
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.debugLine("entry/src/main/ets/pages/RoboticArmWorkRangeView.ets(48:7)", "entry");
            Canvas.width('90%');
            Canvas.aspectRatio(1);
            Canvas.onAreaChange((oldValue, newValue) => {
                // 确保在Canvas布局完成后再进行绘制
                this.canvasWidth = Number(newValue.width);
                this.canvasHeight = Number(newValue.height);
                this.draw();
            });
            Canvas.backgroundColor('#F5F5F5');
            Canvas.border({ width: 1, color: '#CCCCCC' });
        }, Canvas);
        Canvas.pop();
        Flex.pop();
    }
    draw() {
        // 确保 Canvas 已经准备好
        if (this.canvasWidth === 0 || this.canvasHeight === 0 || !this.context) {
            return;
        }
        // 清空画布
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawExcalidrawShape();
    }
    drawExcalidrawShape() {
        const ctx = this.context;
        if (this.shapePoints.length < 2) {
            return;
        }
        // --- 2. 计算图形的边界和尺寸 ---
        let minX = this.shapePoints[0][0];
        let minY = this.shapePoints[0][1];
        let maxX = this.shapePoints[0][0];
        let maxY = this.shapePoints[0][1];
        for (let i = 1; i < this.shapePoints.length; i++) {
            const [x, y] = this.shapePoints[i];
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }
        const shapeWidth = maxX - minX;
        const shapeHeight = maxY - minY;
        if (shapeWidth === 0 || shapeHeight === 0) {
            return;
        }
        // --- 3. 计算缩放比例和偏移量，以适应画布 ---
        const padding = 40; // 在画布周围留出一些边距
        const canvasDrawableWidth = this.canvasWidth - padding * 2;
        const canvasDrawableHeight = this.canvasHeight - padding * 2;
        const scale = Math.min(canvasDrawableWidth / shapeWidth, canvasDrawableHeight / shapeHeight);
        // 计算图形在画布中居中所需的左上角偏移量
        const offsetX = (this.canvasWidth - shapeWidth * scale) / 2;
        const offsetY = (this.canvasHeight - shapeHeight * scale) / 2;
        // --- 4. 开始绘制 ---
        ctx.save();
        [cite_start]; // 设置线条样式 (来自excalidraw文件) [cite: 1]
        ctx.strokeStyle = '#1e1e1e';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round'; // 让线条端点更圆润
        ctx.lineJoin = 'round'; // 让线条连接处更平滑
        ctx.beginPath();
        // 遍历所有点进行绘制
        this.shapePoints.forEach((point, index) => {
            // 将原始坐标根据缩放和偏移转换到画布坐标
            const canvasX = (point[0] - minX) * scale + offsetX;
            const canvasY = (point[1] - minY) * scale + offsetY;
            if (index === 0) {
                ctx.moveTo(canvasX, canvasY);
            }
            else {
                ctx.lineTo(canvasX, canvasY);
            }
        });
        // 将路径描边
        ctx.stroke();
        ctx.restore();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ExcalidrawShapeViewer";
    }
}
registerNamedRoute(() => new ExcalidrawShapeViewer(undefined, {}), "", { bundleName: "com.my.myapplication", moduleName: "entry", pagePath: "pages/RoboticArmWorkRangeView", pageFullPath: "entry/src/main/ets/pages/RoboticArmWorkRangeView", integratedHsp: "false", moduleType: "followWithHap" });
