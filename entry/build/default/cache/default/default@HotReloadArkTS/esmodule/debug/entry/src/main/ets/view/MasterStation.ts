if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MasterStation_Params {
    cardData?: CardInfo[];
}
interface InfoCard_Params {
    title?: string;
    description?: string;
    isPressed?: boolean;
}
//定义卡片的数据模型
interface CardInfo {
    id: string;
    title: string;
    description: string;
}
class InfoCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.title = '';
        this.description = '';
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: InfoCard_Params) {
        if (params.title !== undefined) {
            this.title = params.title;
        }
        if (params.description !== undefined) {
            this.description = params.description;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
    }
    updateStateVars(params: InfoCard_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isPressed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private title: string;
    private description: string;
    private __isPressed: ObservedPropertySimplePU<boolean>;
    get isPressed() {
        return this.__isPressed.get();
    }
    set isPressed(newValue: boolean) {
        this.__isPressed.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 1. 将根组件从 Column 改为 Row，以实现水平布局
            Row.create();
            Context.animation({
                duration: 200,
                curve: Curve.EaseInOut
            });
            // 1. 将根组件从 Column 改为 Row，以实现水平布局
            Row.padding(20);
            // 1. 将根组件从 Column 改为 Row，以实现水平布局
            Row.width('100%');
            // 1. 将根组件从 Column 改为 Row，以实现水平布局
            Row.backdropBlur(12);
            // 1. 将根组件从 Column 改为 Row，以实现水平布局
            Row.backgroundColor('rgba(10, 10, 15, 0.3)');
            // 1. 将根组件从 Column 改为 Row，以实现水平布局
            Row.borderRadius(16);
            // 1. 将根组件从 Column 改为 Row，以实现水平布局
            Row.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.15)'
            });
            // 1. 将根组件从 Column 改为 Row，以实现水平布局
            Row.shadow({
                radius: 30,
                color: 'rgba(173, 216, 230, 0.2)',
                offsetX: 0,
                offsetY: 0
            });
            // 1. 将根组件从 Column 改为 Row，以实现水平布局
            Row.scale({ x: this.isPressed ? 0.96 : 1.0, y: this.isPressed ? 0.96 : 1.0 });
            Context.animation(null);
            // 1. 将根组件从 Column 改为 Row，以实现水平布局
            Row.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.isPressed = true;
                }
                if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.isPressed = false;
                }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 2. 左侧的文本区域
            Column.create();
            // 2. 左侧的文本区域
            Column.alignItems(HorizontalAlign.Start);
            // 2. 左侧的文本区域
            Column.layoutWeight(1);
            // 2. 左侧的文本区域
            Column.margin({ right: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.description);
            Text.fontSize(14);
            Text.fontColor('rgba(255, 255, 255, 0.75)');
            Text.lineHeight(20);
        }, Text);
        Text.pop();
        // 2. 左侧的文本区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 3. 右侧的箭头图标。我们用 Text 组件来模拟，方便调整样式
            Text.create('＞');
            // 3. 右侧的箭头图标。我们用 Text 组件来模拟，方便调整样式
            Text.fontSize(30);
            // 3. 右侧的箭头图标。我们用 Text 组件来模拟，方便调整样式
            Text.fontColor('rgba(255, 255, 255, 0.75)');
        }, Text);
        // 3. 右侧的箭头图标。我们用 Text 组件来模拟，方便调整样式
        Text.pop();
        // 1. 将根组件从 Column 改为 Row，以实现水平布局
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class MasterStation extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.cardData = [
            { id: '1', title: 'VOC传感器', description: '动态获取VOC浓度、甲醛浓度、二氧化碳浓度、温度、湿度这些和环境有关的数据信息并实时展示。' },
            { id: '2', title: '噪声传感器', description: '一次开发，多端部署。鸿蒙的分布式技术让应用无缝流转于手机、平板、手表和智慧屏之间。' },
            { id: '3', title: '红外传感器', description: '无需安装，即点即用。通过服务卡片，用户可以直接在桌面获取核心服务信息和快捷入口。' },
            { id: '4', title: '震动传感器', description: '结合背景模糊、半透明材质和柔和光影，创造出层次分明、通透精致的视觉效果。' },
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MasterStation_Params) {
        if (params.cardData !== undefined) {
            this.cardData = params.cardData;
        }
    }
    updateStateVars(params: MasterStation_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 创建一个包含多个卡片信息的数组作为数据源
    private cardData: CardInfo[];
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('传感器动态数据集');
            Text.fontSize(34);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.padding({ top: 50, left: 20, right: 20, bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.layoutWeight(1);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: 16 });
            List.width('100%');
            List.height('100%');
            List.padding({ left: 16, right: 16, top: 20, bottom: 20 });
            List.edgeEffect(EdgeEffect.Spring);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ForEach 循环和 ListItem 放在这里
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        itemCreation2(elmtId, isInitialRender);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new InfoCard(this, {
                                        title: item.title,
                                        description: item.description
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/MasterStation.ets", line: 95, col: 15 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            title: item.title,
                                            description: item.description
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                                }
                            }, { name: "InfoCard" });
                        }
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.cardData, forEachItemGenFunction, (item: CardInfo) => item.id, false, false);
        }, ForEach);
        // ForEach 循环和 ListItem 放在这里
        ForEach.pop();
        List.pop();
        Stack.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
