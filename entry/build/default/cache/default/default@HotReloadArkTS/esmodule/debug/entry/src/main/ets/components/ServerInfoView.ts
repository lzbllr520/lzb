if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ServerInfoView_Params {
    cardData?: CardInfo[];
    server?: Server | null;
    hasLoaded?: boolean;
    node_id_voc?: string;
    node_id_voice?: string;
    node_id_red?: string;
    node_id_shark?: string;
    node_id_read?: string;
}
interface InfoCard_Params {
    title?: string;
    description?: string;
    isPressed?: boolean;
}
import router from "@ohos:router";
import type { Server, Node } from '../model/ServerState';
import { getNodeStart, getNodeOther } from "@normalized:N&&&entry/src/main/ets/service/Request&";
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
            Row.create();
            Context.animation({
                duration: 200,
                curve: Curve.EaseInOut
            });
            Row.padding(20);
            Row.width('100%');
            Row.backdropBlur(12);
            Row.backgroundColor('rgba(10, 10, 15, 0.3)');
            Row.borderRadius(16);
            Row.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.15)'
            });
            Row.shadow({
                radius: 30,
                color: 'rgba(173, 216, 230, 0.2)',
                offsetX: 0,
                offsetY: 0
            });
            Row.scale({ x: this.isPressed ? 0.96 : 1.0, y: this.isPressed ? 0.96 : 1.0 });
            Context.animation(null);
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
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
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
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('＞');
            Text.fontSize(30);
            Text.fontColor('rgba(255, 255, 255, 0.75)');
        }, Text);
        Text.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class ServerInfoView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.cardData = [
            { id: '1', title: 'VOC传感器', description: '动态获取VOC浓度、甲醛浓度、二氧化碳浓度、温度、湿度这些和环境有关的数据信息并实时展示。' },
            { id: '2', title: '噪声传感器', description: '动态获取并展示当前噪声值。' },
            { id: '3', title: '红外传感器', description: '动态获取并展示红外检测状态、检测次数信息。' },
            { id: '4', title: '震动传感器', description: '动态获取并展示震动状态、震动次数、脉冲总数信息。' },
            { id: '5', title: 'RFID读卡器', description: '动态获取并展示' }
        ];
        this.__server = new SynchedPropertyObjectOneWayPU(params.server, this, "server");
        this.__hasLoaded = new ObservedPropertySimplePU(false, this, "hasLoaded");
        this.__node_id_voc = new ObservedPropertySimplePU('', this, "node_id_voc");
        this.__node_id_voice = new ObservedPropertySimplePU('', this, "node_id_voice");
        this.__node_id_red = new ObservedPropertySimplePU('', this, "node_id_red");
        this.__node_id_shark = new ObservedPropertySimplePU('', this, "node_id_shark");
        this.__node_id_read = new ObservedPropertySimplePU('', this, "node_id_read");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("server", this.onServersChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ServerInfoView_Params) {
        if (params.cardData !== undefined) {
            this.cardData = params.cardData;
        }
        if (params.hasLoaded !== undefined) {
            this.hasLoaded = params.hasLoaded;
        }
        if (params.node_id_voc !== undefined) {
            this.node_id_voc = params.node_id_voc;
        }
        if (params.node_id_voice !== undefined) {
            this.node_id_voice = params.node_id_voice;
        }
        if (params.node_id_red !== undefined) {
            this.node_id_red = params.node_id_red;
        }
        if (params.node_id_shark !== undefined) {
            this.node_id_shark = params.node_id_shark;
        }
        if (params.node_id_read !== undefined) {
            this.node_id_read = params.node_id_read;
        }
    }
    updateStateVars(params: ServerInfoView_Params) {
        this.__server.reset(params.server);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__server.purgeDependencyOnElmtId(rmElmtId);
        this.__hasLoaded.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_voc.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_voice.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_red.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_shark.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_read.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__server.aboutToBeDeleted();
        this.__hasLoaded.aboutToBeDeleted();
        this.__node_id_voc.aboutToBeDeleted();
        this.__node_id_voice.aboutToBeDeleted();
        this.__node_id_red.aboutToBeDeleted();
        this.__node_id_shark.aboutToBeDeleted();
        this.__node_id_read.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 创建一个包含多个卡片信息的数组作为数据源
    private cardData: CardInfo[];
    private __server: SynchedPropertySimpleOneWayPU<Server | null
    //标志位，表示只加载一次
    >;
    get server() {
        return this.__server.get();
    }
    set server(newValue: Server | null) {
        this.__server.set(newValue);
    }
    //标志位，表示只加载一次
    private __hasLoaded: ObservedPropertySimplePU<boolean>;
    get hasLoaded() {
        return this.__hasLoaded.get();
    }
    set hasLoaded(newValue: boolean) {
        this.__hasLoaded.set(newValue);
    }
    private __node_id_voc: ObservedPropertySimplePU<string>;
    get node_id_voc() {
        return this.__node_id_voc.get();
    }
    set node_id_voc(newValue: string) {
        this.__node_id_voc.set(newValue);
    }
    private __node_id_voice: ObservedPropertySimplePU<string>;
    get node_id_voice() {
        return this.__node_id_voice.get();
    }
    set node_id_voice(newValue: string) {
        this.__node_id_voice.set(newValue);
    }
    private __node_id_red: ObservedPropertySimplePU<string>;
    get node_id_red() {
        return this.__node_id_red.get();
    }
    set node_id_red(newValue: string) {
        this.__node_id_red.set(newValue);
    }
    private __node_id_shark: ObservedPropertySimplePU<string>;
    get node_id_shark() {
        return this.__node_id_shark.get();
    }
    set node_id_shark(newValue: string) {
        this.__node_id_shark.set(newValue);
    }
    private __node_id_read: ObservedPropertySimplePU<string>;
    get node_id_read() {
        return this.__node_id_read.get();
    }
    set node_id_read(newValue: string) {
        this.__node_id_read.set(newValue);
    }
    aboutToAppear() {
        this.onServersChange();
    }
    async onServersChange(): Promise<void> {
        if (this.server && !this.hasLoaded) {
            // 调用数据加载函数
            const nodes1: Node[] | null = await getNodeStart(this.server.id);
            if (nodes1 && nodes1.length > 0) {
                const nodes2: Node[] | null = await getNodeOther(this.server.id, nodes1[3].node_id);
                if (nodes2 && nodes2.length > 0) {
                    this.node_id_read = nodes2[4].node_id;
                    const nodes3: Node[] | null = await getNodeOther(this.server.id, nodes2[1].node_id);
                    if (nodes3 && nodes3.length > 0) {
                        this.node_id_voc = nodes3[1].node_id;
                        this.node_id_voice = nodes3[2].node_id;
                        this.node_id_red = nodes3[3].node_id;
                        this.node_id_shark = nodes3[4].node_id;
                    }
                }
            }
            // 将标志位置为 true，防止重复加载
            this.hasLoaded = true;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create((this.server ? this.server.id : 'null') + '——传感器动态数据集');
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
            List.scrollBar(BarState.On);
            List.scrollBarColor('#888888');
            List.scrollBarWidth(8);
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
                        ListItem.onClick(() => {
                            if (item.title === 'VOC传感器') {
                                router.pushUrl({
                                    url: 'pages/SensorInfoVOC',
                                    params: { title: item.title, id: this.server ? this.server.id : '', node_id: this.node_id_voc }
                                });
                            }
                            else if (item.title === '噪声传感器') {
                                router.pushUrl({
                                    url: 'pages/SensorInfoVoice',
                                    params: { title: item.title, id: this.server ? this.server.id : '', node_id: this.node_id_voice }
                                });
                            }
                            else if (item.title === '红外传感器') {
                                router.pushUrl({
                                    url: 'pages/SensorInfoRed',
                                    params: { title: item.title, id: this.server ? this.server.id : '', node_id: this.node_id_red }
                                });
                            }
                            else if (item.title === '震动传感器') {
                                router.pushUrl({
                                    url: 'pages/SensorInfoShark',
                                    params: { title: item.title, id: this.server ? this.server.id : '', node_id: this.node_id_shark }
                                });
                            }
                            else if (item.title === 'RFID读卡器') {
                                router.pushUrl({
                                    url: 'pages/RFIDReadCard',
                                    params: { title: item.title, id: this.server ? this.server.id : '', node_id: this.node_id_read }
                                });
                            }
                        });
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new InfoCard(this, {
                                        title: item.title,
                                        description: item.description
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/ServerInfoView.ets", line: 134, col: 15 });
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
