if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MasterStation_Params {
    cardData?: CardInfo[];
    servers?: Server[];
    hasLoaded?: boolean;
    node_id_voc?: string;
    node_id_voice?: string;
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
export class MasterStation extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.cardData = [
            { id: '1', title: 'VOC传感器', description: '动态获取VOC浓度、甲醛浓度、二氧化碳浓度、温度、湿度这些和环境有关的数据信息并实时展示。' },
            { id: '2', title: '噪声传感器', description: '动态获取并展示当前噪声值。' },
            { id: '3', title: '红外传感器', description: '待描述。' },
            { id: '4', title: '震动传感器', description: '待描述。' },
        ];
        this.__servers = new SynchedPropertyObjectOneWayPU(params.servers, this, "servers");
        this.__hasLoaded = new ObservedPropertySimplePU(false, this, "hasLoaded");
        this.__node_id_voc = new ObservedPropertySimplePU('', this, "node_id_voc");
        this.__node_id_voice = new ObservedPropertySimplePU('', this, "node_id_voice");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("servers", this.onServersChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MasterStation_Params) {
        if (params.cardData !== undefined) {
            this.cardData = params.cardData;
        }
        if (params.servers === undefined) {
            this.__servers.set([]
            //标志位，表示只加载一次
            );
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
    }
    updateStateVars(params: MasterStation_Params) {
        this.__servers.reset(params.servers);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__servers.purgeDependencyOnElmtId(rmElmtId);
        this.__hasLoaded.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_voc.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_voice.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__servers.aboutToBeDeleted();
        this.__hasLoaded.aboutToBeDeleted();
        this.__node_id_voc.aboutToBeDeleted();
        this.__node_id_voice.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 创建一个包含多个卡片信息的数组作为数据源
    private cardData: CardInfo[];
    private __servers: SynchedPropertySimpleOneWayPU<Server[]>;
    get servers() {
        return this.__servers.get();
    }
    set servers(newValue: Server[]) {
        this.__servers.set(newValue);
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
    async onServersChange(): Promise<void> {
        if (this.servers && this.servers.length > 0 && !this.hasLoaded) {
            // 调用数据加载函数
            const nodes1: Node[] | null = await getNodeStart(this.servers[0].id);
            if (nodes1 && nodes1.length > 0) {
                const nodes2: Node[] | null = await getNodeOther(this.servers[0].id, nodes1[3].node_id);
                if (nodes2 && nodes2.length > 0) {
                    const nodes3: Node[] | null = await getNodeOther(this.servers[0].id, nodes2[1].node_id);
                    if (nodes3 && nodes3.length > 0) {
                        this.node_id_voc = nodes3[1].node_id;
                        this.node_id_voice = nodes3[2].node_id;
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
            Text.create((this.servers && this.servers.length > 0 ? this.servers[0].name : 'null') + '——传感器动态数据集');
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
                        ListItem.onClick(() => {
                            if (item.title === 'VOC传感器') {
                                router.pushUrl({
                                    url: 'pages/SensorInfoVOC',
                                    params: { title: item.title, id: this.servers[0].id, node_id: this.node_id_voc } // 将卡片标题作为参数传递
                                });
                            }
                            else if (item.title === '噪声传感器') {
                                router.pushUrl({
                                    url: 'pages/SensorInfoVoice',
                                    params: { title: item.title, id: this.servers[0].id, node_id: this.node_id_voice } // 将卡片标题作为参数传递
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
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/MasterStation.ets", line: 123, col: 15 });
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
