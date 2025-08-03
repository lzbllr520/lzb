if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SensorInfoShark_Params {
    sensorData?: CardData[];
    bgOpacity?: number;
    routeParams?;
    timer?: number;
    sensorNodeId1?: string;
    sensorNodeId2?: string;
    sensorNodeId3?: string;
}
interface ValueCard_Params {
    title?: string;
    value?: string;
    unit?: string;
}
import router from "@ohos:router";
import type { Node } from '../model/ServerState';
import { getNodeOther, getNodeShark1, getNodeShark2, getNodeShark3 } from "@normalized:N&&&entry/src/main/ets/service/Request&";
interface CardData {
    title: string;
    value: string;
    unit: string;
}
class ValueCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.title = '标题';
        this.value = '0.0';
        this.unit = '单位';
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ValueCard_Params) {
        if (params.title !== undefined) {
            this.title = params.title;
        }
        if (params.value !== undefined) {
            this.value = params.value;
        }
        if (params.unit !== undefined) {
            this.unit = params.unit;
        }
    }
    updateStateVars(params: ValueCard_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private title: string;
    private value: string;
    private unit: string;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.width('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.height(150);
            Column.padding(15);
            Column.backdropBlur(15);
            Column.backgroundColor('rgba(25, 29, 40, 0.5)');
            Column.borderRadius(24);
            Column.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.15)'
            });
            Column.shadow({
                radius: 20,
                color: 'rgba(0, 0, 0, 0.2)',
                offsetX: 0,
                offsetY: 10
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('rgba(255, 255, 255, 0.8)');
            Text.width('100%');
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.value);
            Text.fontSize(38);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.unit);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('rgba(255, 255, 255, 0.85)');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
interface MasterStationInfo {
    title: string;
    id: string;
    node_id: string;
}
class SensorInfoShark extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__sensorData = new ObservedPropertyObjectPU([
            { title: '震动状态', value: 'null', unit: '' },
            { title: '震动次数', value: 'null', unit: '次' },
            { title: '脉冲总数', value: 'null', unit: '次' }
        ], this, "sensorData");
        this.__bgOpacity = new ObservedPropertySimplePU(0, this, "bgOpacity");
        this.routeParams = router.getParams() as MasterStationInfo;
        this.timer = -1;
        this.sensorNodeId1 = '';
        this.sensorNodeId2 = '';
        this.sensorNodeId3 = '';
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SensorInfoShark_Params) {
        if (params.sensorData !== undefined) {
            this.sensorData = params.sensorData;
        }
        if (params.bgOpacity !== undefined) {
            this.bgOpacity = params.bgOpacity;
        }
        if (params.routeParams !== undefined) {
            this.routeParams = params.routeParams;
        }
        if (params.timer !== undefined) {
            this.timer = params.timer;
        }
        if (params.sensorNodeId1 !== undefined) {
            this.sensorNodeId1 = params.sensorNodeId1;
        }
        if (params.sensorNodeId2 !== undefined) {
            this.sensorNodeId2 = params.sensorNodeId2;
        }
        if (params.sensorNodeId3 !== undefined) {
            this.sensorNodeId3 = params.sensorNodeId3;
        }
    }
    updateStateVars(params: SensorInfoShark_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__sensorData.purgeDependencyOnElmtId(rmElmtId);
        this.__bgOpacity.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__sensorData.aboutToBeDeleted();
        this.__bgOpacity.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __sensorData: ObservedPropertyObjectPU<CardData[]>;
    get sensorData() {
        return this.__sensorData.get();
    }
    set sensorData(newValue: CardData[]) {
        this.__sensorData.set(newValue);
    }
    private __bgOpacity: ObservedPropertySimplePU<number>;
    get bgOpacity() {
        return this.__bgOpacity.get();
    }
    set bgOpacity(newValue: number) {
        this.__bgOpacity.set(newValue);
    }
    private routeParams;
    private timer: number;
    private sensorNodeId1: string;
    private sensorNodeId2: string;
    private sensorNodeId3: string;
    // 定义一个可重用的数据获取和更新函数
    async fetchAndUpdateData() {
        // 确保已经获取到了传感器的node_id
        if (!this.sensorNodeId1 || !this.sensorNodeId2 || !this.sensorNodeId3) {
            const nodes1: Node[] | null = await getNodeOther(this.routeParams.id, this.routeParams.node_id);
            if (nodes1 && nodes1.length > 0) {
                const nodes2: Node[] | null = await getNodeOther(this.routeParams.id, nodes1[1].node_id);
                if (nodes2 && nodes2.length > 0) {
                    this.sensorNodeId1 = nodes2[1].node_id;
                    this.sensorNodeId2 = nodes2[2].node_id;
                    this.sensorNodeId3 = nodes2[3].node_id;
                }
            }
            else {
                return;
            }
        }
        const data1: boolean | null = await getNodeShark1(this.routeParams.id, this.sensorNodeId1);
        const data2: number | null = await getNodeShark2(this.routeParams.id, this.sensorNodeId2);
        const data3: number | null = await getNodeShark3(this.routeParams.id, this.sensorNodeId3);
        if (data1 !== null && data2 !== null && data3 !== null) {
            const newSensorData: CardData[] = [
                {
                    title: '震动状态',
                    value: data1 ? '有震动' : '无震动',
                    unit: ''
                },
                {
                    title: '震动次数',
                    value: data2 + '',
                    unit: '次'
                },
                {
                    title: '脉冲总数',
                    value: data3.toString(),
                    unit: '次'
                }
            ];
            this.sensorData = newSensorData;
            console.error("获取震动传感器数据成功");
        }
        else {
            console.error("获取震动传感器数据失败");
        }
    }
    async aboutToAppear() {
        // 背景缓慢显示动画控制代码
        Context.animateTo({ duration: 3000, curve: Curve.EaseInOut }, () => {
            this.bgOpacity = 1;
        });
        if (this.routeParams.id && this.routeParams.node_id) {
            //页面出现时，立即执行一次数据获取
            await this.fetchAndUpdateData();
            //启动一个定时器，每隔1000毫秒（1秒）调用一次数据获取函数
            this.timer = setInterval(() => {
                this.fetchAndUpdateData();
            }, 1000); // 时间单位是毫秒
        }
    }
    // 当用户离开这个页面时，这个函数会被调用
    aboutToDisappear() {
        // 5. 清除定时器，防止页面销毁后定时器仍在后台运行，导致内存泄漏和不必要的网络请求
        if (this.timer !== -1) {
            clearInterval(this.timer);
            this.timer = -1; // 重置timer ID
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.backgroundColor('#0A0A0F');
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777274, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width('100%');
            Image.height('100%');
            Image.objectFit(ImageFit.Cover);
            Image.opacity(this.bgOpacity);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 20, right: 20 });
            Row.margin({ top: 40 });
            Row.justifyContent(FlexAlign.Start);
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777250, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width(28);
            Image.height(28);
            Image.fillColor(Color.White);
            Image.onClick(() => {
                router.back();
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 4. 将页面大标题也放入这个Row中
            Text.create(this.routeParams.title);
            // 4. 将页面大标题也放入这个Row中
            Text.fontSize(28);
            // 4. 将页面大标题也放入这个Row中
            Text.fontWeight(FontWeight.Bold);
            // 4. 将页面大标题也放入这个Row中
            Text.fontColor(Color.White);
            // 4. 将页面大标题也放入这个Row中
            Text.margin({ left: 16 });
        }, Text);
        // 4. 将页面大标题也放入这个Row中
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 1. 使用 Scroll 组件包裹整个网格，使其可以滚动
            Scroll.create();
            // 1. 使用 Scroll 组件包裹整个网格，使其可以滚动
            Scroll.width('100%');
            // 1. 使用 Scroll 组件包裹整个网格，使其可以滚动
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 2. 使用 Grid 组件进行网格布局
            Grid.create();
            // 2. 使用 Grid 组件进行网格布局
            Grid.columnsTemplate('1fr 1fr 1fr 1fr');
            // 2. 使用 Grid 组件进行网格布局
            Grid.columnsGap(16);
            // 2. 使用 Grid 组件进行网格布局
            Grid.rowsGap(16);
            // 2. 使用 Grid 组件进行网格布局
            Grid.padding({ left: 16, right: 16, bottom: 50 });
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 3. 遍历数据数组，为每个数据对象创建一个卡片
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new ValueCard(this, {
                                        title: item.title,
                                        value: item.value,
                                        unit: item.unit
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SensorInfoShark.ets", line: 198, col: 17 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            title: item.title,
                                            value: item.value,
                                            unit: item.unit
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                                }
                            }, { name: "ValueCard" });
                        }
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.sensorData, forEachItemGenFunction, (item: CardData) => JSON.stringify(item), false, false);
        }, ForEach);
        // 3. 遍历数据数组，为每个数据对象创建一个卡片
        ForEach.pop();
        // 2. 使用 Grid 组件进行网格布局
        Grid.pop();
        // 1. 使用 Scroll 组件包裹整个网格，使其可以滚动
        Scroll.pop();
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "SensorInfoShark";
    }
}
registerNamedRoute(() => new SensorInfoShark(undefined, {}), "", { bundleName: "com.my.myapplication", moduleName: "entry", pagePath: "pages/SensorInfoShark", pageFullPath: "entry/src/main/ets/pages/SensorInfoShark", integratedHsp: "false", moduleType: "followWithHap" });
