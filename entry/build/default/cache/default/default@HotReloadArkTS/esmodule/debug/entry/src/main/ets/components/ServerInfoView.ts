if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ServerInfoView_Params {
    server?: Server | null;
    isCurrentlyVisible?: boolean;
    hasLoaded?: boolean;
    timer?: number;
    vocSensorData?: CardData[];
    node_id_voc?: string;
    voiceSensorData?: CardData[];
    node_id_voice?: string;
    redSensorData?: CardData[];
    node_id_red_1?: string;
    node_id_red_2?: string;
    sharkSensorData?: CardData[];
    node_id_shark_1?: string;
    node_id_shark_2?: string;
    node_id_shark_3?: string;
    rfidSensorData?: CardData[];
    node_id_rfid_1?: string;
    node_id_rfid_2?: string;
    node_id_rfid_3?: string;
    node_id_rfid_4?: string;
    node_id_rfid_5?: string;
}
import type { Server, Node } from '../model/ServerState';
import { getNodeStart, getNodeOther, getNodeEn, getNodeVoice, getNodeShark1, getNodeShark2, getNodeShark3, getNodeRed1, getNodeRed2, getNodeRFID1, getNodeRFID2, getNodeRFID3, getNodeRFID4, getNodeRFID5 } from "@normalized:N&&&entry/src/main/ets/service/Request&";
import { ValueCard } from "@normalized:N&&&entry/src/main/ets/components/ValueCard&";
// 定义卡片的数据模型
interface CardData {
    icon: Resource;
    title: string;
    value: string;
    unit: string;
}
export class ServerInfoView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__server = new SynchedPropertyObjectOneWayPU(params.server, this, "server");
        this.__isCurrentlyVisible = new ObservedPropertySimplePU(false
        // 标志位，表示只加载一次
        , this, "isCurrentlyVisible");
        this.__hasLoaded = new ObservedPropertySimplePU(false, this, "hasLoaded");
        this.timer = -1;
        this.__vocSensorData = new ObservedPropertyObjectPU([
            { icon: { "id": 16777283, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '当前温度', value: '', unit: '°C' },
            { icon: { "id": 16777282, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '当前湿度', value: '', unit: '%' },
            { icon: { "id": 16777281, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: 'VOC 浓度', value: '', unit: 'ppm' },
            { icon: { "id": 16777281, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '甲醛浓度', value: '', unit: 'mg/m³' },
            { icon: { "id": 16777281, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '二氧化碳浓度', value: '', unit: 'ppm' }
        ], this, "vocSensorData");
        this.node_id_voc = '';
        this.__voiceSensorData = new ObservedPropertyObjectPU([
            { icon: { "id": 16777284, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '当前噪声', value: '', unit: 'dB' }
        ], this, "voiceSensorData");
        this.node_id_voice = '';
        this.__redSensorData = new ObservedPropertyObjectPU([
            { icon: { "id": 16777287, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '检测状态', value: '', unit: '' },
            { icon: { "id": 16777286, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '检测次数', value: '', unit: '次' }
        ], this, "redSensorData");
        this.node_id_red_1 = '';
        this.node_id_red_2 = '';
        this.__sharkSensorData = new ObservedPropertyObjectPU([
            { icon: { "id": 16777287, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '震动状态', value: '', unit: '' },
            { icon: { "id": 16777286, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '震动次数', value: '', unit: '次' },
            { icon: { "id": 16777286, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '脉冲总数', value: '', unit: '次' }
        ], this, "sharkSensorData");
        this.node_id_shark_1 = '';
        this.node_id_shark_2 = '';
        this.node_id_shark_3 = '';
        this.__rfidSensorData = new ObservedPropertyObjectPU([
            { icon: { "id": 16777285, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '卡片UID', value: '', unit: '' },
            { icon: { "id": 16777287, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '卡片是否存在', value: '', unit: '' },
            { icon: { "id": 16777286, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '数据块内容', value: '', unit: '' },
            { icon: { "id": 16777286, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '读取次数', value: '', unit: '次' },
            { icon: { "id": 16777288, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '最后读取时间', value: '', unit: '' }
        ], this, "rfidSensorData");
        this.node_id_rfid_1 = '';
        this.node_id_rfid_2 = '';
        this.node_id_rfid_3 = '';
        this.node_id_rfid_4 = '';
        this.node_id_rfid_5 = '';
        this.setInitiallyProvidedValue(params);
        this.declareWatch("server", this.onServersChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ServerInfoView_Params) {
        if (params.isCurrentlyVisible !== undefined) {
            this.isCurrentlyVisible = params.isCurrentlyVisible;
        }
        if (params.hasLoaded !== undefined) {
            this.hasLoaded = params.hasLoaded;
        }
        if (params.timer !== undefined) {
            this.timer = params.timer;
        }
        if (params.vocSensorData !== undefined) {
            this.vocSensorData = params.vocSensorData;
        }
        if (params.node_id_voc !== undefined) {
            this.node_id_voc = params.node_id_voc;
        }
        if (params.voiceSensorData !== undefined) {
            this.voiceSensorData = params.voiceSensorData;
        }
        if (params.node_id_voice !== undefined) {
            this.node_id_voice = params.node_id_voice;
        }
        if (params.redSensorData !== undefined) {
            this.redSensorData = params.redSensorData;
        }
        if (params.node_id_red_1 !== undefined) {
            this.node_id_red_1 = params.node_id_red_1;
        }
        if (params.node_id_red_2 !== undefined) {
            this.node_id_red_2 = params.node_id_red_2;
        }
        if (params.sharkSensorData !== undefined) {
            this.sharkSensorData = params.sharkSensorData;
        }
        if (params.node_id_shark_1 !== undefined) {
            this.node_id_shark_1 = params.node_id_shark_1;
        }
        if (params.node_id_shark_2 !== undefined) {
            this.node_id_shark_2 = params.node_id_shark_2;
        }
        if (params.node_id_shark_3 !== undefined) {
            this.node_id_shark_3 = params.node_id_shark_3;
        }
        if (params.rfidSensorData !== undefined) {
            this.rfidSensorData = params.rfidSensorData;
        }
        if (params.node_id_rfid_1 !== undefined) {
            this.node_id_rfid_1 = params.node_id_rfid_1;
        }
        if (params.node_id_rfid_2 !== undefined) {
            this.node_id_rfid_2 = params.node_id_rfid_2;
        }
        if (params.node_id_rfid_3 !== undefined) {
            this.node_id_rfid_3 = params.node_id_rfid_3;
        }
        if (params.node_id_rfid_4 !== undefined) {
            this.node_id_rfid_4 = params.node_id_rfid_4;
        }
        if (params.node_id_rfid_5 !== undefined) {
            this.node_id_rfid_5 = params.node_id_rfid_5;
        }
    }
    updateStateVars(params: ServerInfoView_Params) {
        this.__server.reset(params.server);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__server.purgeDependencyOnElmtId(rmElmtId);
        this.__isCurrentlyVisible.purgeDependencyOnElmtId(rmElmtId);
        this.__hasLoaded.purgeDependencyOnElmtId(rmElmtId);
        this.__vocSensorData.purgeDependencyOnElmtId(rmElmtId);
        this.__voiceSensorData.purgeDependencyOnElmtId(rmElmtId);
        this.__redSensorData.purgeDependencyOnElmtId(rmElmtId);
        this.__sharkSensorData.purgeDependencyOnElmtId(rmElmtId);
        this.__rfidSensorData.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__server.aboutToBeDeleted();
        this.__isCurrentlyVisible.aboutToBeDeleted();
        this.__hasLoaded.aboutToBeDeleted();
        this.__vocSensorData.aboutToBeDeleted();
        this.__voiceSensorData.aboutToBeDeleted();
        this.__redSensorData.aboutToBeDeleted();
        this.__sharkSensorData.aboutToBeDeleted();
        this.__rfidSensorData.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __server: SynchedPropertySimpleOneWayPU<Server | null>;
    get server() {
        return this.__server.get();
    }
    set server(newValue: Server | null) {
        this.__server.set(newValue);
    }
    private __isCurrentlyVisible: ObservedPropertySimplePU<boolean>;
    get isCurrentlyVisible() {
        return this.__isCurrentlyVisible.get();
    }
    set isCurrentlyVisible(newValue: boolean) {
        this.__isCurrentlyVisible.set(newValue);
    }
    // 标志位，表示只加载一次
    private __hasLoaded: ObservedPropertySimplePU<boolean>;
    get hasLoaded() {
        return this.__hasLoaded.get();
    }
    set hasLoaded(newValue: boolean) {
        this.__hasLoaded.set(newValue);
    }
    private timer: number;
    // VOC 传感器数据
    private __vocSensorData: ObservedPropertyObjectPU<CardData[]>;
    get vocSensorData() {
        return this.__vocSensorData.get();
    }
    set vocSensorData(newValue: CardData[]) {
        this.__vocSensorData.set(newValue);
    }
    private node_id_voc: string;
    // 噪声传感器数据
    private __voiceSensorData: ObservedPropertyObjectPU<CardData[]>;
    get voiceSensorData() {
        return this.__voiceSensorData.get();
    }
    set voiceSensorData(newValue: CardData[]) {
        this.__voiceSensorData.set(newValue);
    }
    private node_id_voice: string;
    // 红外传感器数据
    private __redSensorData: ObservedPropertyObjectPU<CardData[]>;
    get redSensorData() {
        return this.__redSensorData.get();
    }
    set redSensorData(newValue: CardData[]) {
        this.__redSensorData.set(newValue);
    }
    private node_id_red_1: string;
    private node_id_red_2: string;
    // 震动传感器数据
    private __sharkSensorData: ObservedPropertyObjectPU<CardData[]>;
    get sharkSensorData() {
        return this.__sharkSensorData.get();
    }
    set sharkSensorData(newValue: CardData[]) {
        this.__sharkSensorData.set(newValue);
    }
    private node_id_shark_1: string;
    private node_id_shark_2: string;
    private node_id_shark_3: string;
    // RFID 读卡器数据
    private __rfidSensorData: ObservedPropertyObjectPU<CardData[]>;
    get rfidSensorData() {
        return this.__rfidSensorData.get();
    }
    set rfidSensorData(newValue: CardData[]) {
        this.__rfidSensorData.set(newValue);
    }
    private node_id_rfid_1: string;
    private node_id_rfid_2: string;
    private node_id_rfid_3: string;
    private node_id_rfid_4: string;
    private node_id_rfid_5: string;
    async startDataFetching() {
        await this.onServersChange(); // 确保NodeID已加载
        if (this.server) {
            await this.fetchAndUpdateData(); // 立即获取一次
            if (this.timer === -1) { // 防止重复创建
                this.timer = setInterval(async () => {
                    await this.fetchAndUpdateData();
                }, 5000);
            }
        }
    }
    // 这是一个新的方法，封装了停止数据获取的逻辑
    stopDataFetching() {
        if (this.timer !== -1) {
            clearInterval(this.timer);
            this.timer = -1;
        }
    }
    aboutToDisappear() {
        this.stopDataFetching();
    }
    async onServersChange(): Promise<void> {
        if (this.server && !this.hasLoaded) {
            const nodes1: Node[] | null = await getNodeStart(this.server.id);
            if (nodes1 && nodes1.length > 0) {
                const nodes2: Node[] | null = await getNodeOther(this.server.id, nodes1[3].node_id);
                if (nodes2 && nodes2.length > 0) {
                    // RFID读卡器
                    const rfidNodes: Node[] | null = await getNodeOther(this.server.id, nodes2[4].node_id);
                    if (rfidNodes && rfidNodes.length > 0) {
                        this.node_id_rfid_1 = rfidNodes[1].node_id;
                        this.node_id_rfid_2 = rfidNodes[2].node_id;
                        this.node_id_rfid_3 = rfidNodes[3].node_id;
                        this.node_id_rfid_4 = rfidNodes[4].node_id;
                        this.node_id_rfid_5 = rfidNodes[5].node_id;
                    }
                    //所有传感器node_id
                    const nodes3: Node[] | null = await getNodeOther(this.server.id, nodes2[1].node_id);
                    if (nodes3 && nodes3.length > 0) {
                        // VOC传感器数据node_id
                        const vocNodes: Node[] | null = await getNodeOther(this.server.id, nodes3[1].node_id);
                        if (vocNodes && vocNodes.length > 0) {
                            this.node_id_voc = vocNodes[2].node_id;
                        }
                        // 噪声传感器数据的node_id
                        const noiseNodes: Node[] | null = await getNodeOther(this.server.id, nodes3[2].node_id);
                        if (noiseNodes && noiseNodes.length > 0) {
                            this.node_id_voice = noiseNodes[1].node_id;
                        }
                        // 红外传感器数据的node_id
                        const redNodes1: Node[] | null = await getNodeOther(this.server.id, nodes3[3].node_id);
                        if (redNodes1 && redNodes1.length > 0) {
                            const redNodes2: Node[] | null = await getNodeOther(this.server.id, redNodes1[1].node_id);
                            if (redNodes2 && redNodes2.length > 0) {
                                this.node_id_red_1 = redNodes2[1].node_id;
                                this.node_id_red_2 = redNodes2[2].node_id;
                            }
                        }
                        // 震动传感器数据的node_id
                        const sharkNodes1: Node[] | null = await getNodeOther(this.server.id, nodes3[4].node_id);
                        if (sharkNodes1 && sharkNodes1.length > 0) {
                            const sharkNodes2: Node[] | null = await getNodeOther(this.server.id, sharkNodes1[1].node_id);
                            if (sharkNodes2 && sharkNodes2.length > 0) {
                                this.node_id_shark_1 = sharkNodes2[1].node_id;
                                this.node_id_shark_2 = sharkNodes2[2].node_id;
                                this.node_id_shark_3 = sharkNodes2[3].node_id;
                            }
                        }
                    }
                }
            }
            this.hasLoaded = true;
        }
    }
    async fetchAndUpdateData() {
        if (!this.server)
            return;
        //获取VOC传感器数据
        if (this.node_id_voc) {
            const data: number[] | null = await getNodeEn(this.server.id, this.node_id_voc);
            if (data && data.length > 0) {
                this.vocSensorData = this.vocSensorData.map((item: CardData, index: number) => {
                    const newItem: CardData = {
                        icon: item.icon,
                        title: item.title,
                        unit: item.unit,
                        value: data[index] + ''
                    };
                    return newItem;
                });
            }
        }
        //获取噪声传感器数据
        if (this.node_id_voice) {
            const data: number | null = await getNodeVoice(this.server.id, this.node_id_voice);
            if (data !== null) {
                this.voiceSensorData = [{
                        icon: { "id": 16777284, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        title: '当前噪声',
                        unit: 'dB',
                        value: data.toFixed(2) + ''
                    }];
            }
        }
        //获取红外传感器数据
        if (this.node_id_red_1 && this.node_id_red_2) {
            const data1: boolean | null = await getNodeRed1(this.server.id, this.node_id_red_1);
            const data2: number | null = await getNodeRed2(this.server.id, this.node_id_red_2);
            if (data1 !== null && data2 !== null) {
                this.redSensorData = [
                    { icon: { "id": 16777287, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '检测状态', value: data1 ? '有目标' : '无目标', unit: '' },
                    { icon: { "id": 16777286, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '检测次数', value: data2.toString(), unit: '次' }
                ];
            }
        }
        //获取震动传感器数据
        if (this.node_id_shark_1 && this.node_id_shark_2 && this.node_id_shark_3) {
            const data1: boolean | null = await getNodeShark1(this.server.id, this.node_id_shark_1);
            const data2: number | null = await getNodeShark2(this.server.id, this.node_id_shark_2);
            const data3: number | null = await getNodeShark3(this.server.id, this.node_id_shark_3);
            if (data1 !== null && data2 !== null && data3 !== null) {
                this.sharkSensorData = [
                    { icon: { "id": 16777287, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '震动状态', value: data1 ? '有震动' : '无震动', unit: '' },
                    { icon: { "id": 16777286, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '震动次数', value: data2 + '', unit: '次' },
                    { icon: { "id": 16777286, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '脉冲总数', value: data3.toString(), unit: '次' }
                ];
            }
        }
        //获取RFID读卡器数据
        if (this.node_id_rfid_1 && this.node_id_rfid_2 && this.node_id_rfid_3 && this.node_id_rfid_4 && this.node_id_rfid_5) {
            const data1: string | null = await getNodeRFID1(this.server.id, this.node_id_rfid_1);
            const data2: string | null = await getNodeRFID2(this.server.id, this.node_id_rfid_2);
            const data3: string | null = await getNodeRFID3(this.server.id, this.node_id_rfid_3);
            const data4: string | null = await getNodeRFID4(this.server.id, this.node_id_rfid_4);
            const data5: string | null = await getNodeRFID5(this.server.id, this.node_id_rfid_5);
            this.rfidSensorData = [
                { icon: { "id": 16777285, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '卡片UID', value: data1 ? data1 : '无UID信息' + '', unit: '' },
                { icon: { "id": 16777287, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '卡片是否存在', value: data2 ? '存在' : '不存在' + '', unit: '' },
                { icon: { "id": 16777286, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '数据块内容', value: data3 + '', unit: '' },
                { icon: { "id": 16777286, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '读取次数', value: data4 + '', unit: '次' },
                { icon: { "id": 16777288, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, title: '最后读取时间', value: data5 ? data5 : '无时间信息' + '', unit: '' }
            ];
        }
    }
    SectionTitle(title: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.padding({ top: 10, bottom: 10, left: 20 });
        }, Text);
        Text.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#0A0A0F');
            Column.onVisibleAreaChange([0.0, 1.0], (isVisible: boolean, currentRatio: number) => {
                // 当组件刚变得可见时
                if (currentRatio > 0 && !this.isCurrentlyVisible) {
                    this.isCurrentlyVisible = true;
                    this.startDataFetching(); // 调用启动逻辑
                }
                // 当组件刚变得完全不可见时
                else if (currentRatio <= 0 && this.isCurrentlyVisible) {
                    this.isCurrentlyVisible = false;
                    this.stopDataFetching(); // 调用停止逻辑
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create((this.server ? this.server.id : 'null') + '——传感器动态数据集');
            Text.fontSize(30);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.padding({ top: 50, left: 20, right: 20, bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollBar(BarState.On);
            Scroll.scrollBarColor('#888888');
            Scroll.scrollBarWidth(8);
            Scroll.edgeEffect(EdgeEffect.Spring);
            Scroll.width('100%');
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.padding({ left: 16, right: 16, top: 20, bottom: 20 });
        }, Column);
        // VOC传感器
        this.SectionTitle.bind(this)('VOC传感器');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Grid.create();
            Grid.columnsTemplate('1fr 1fr');
            Grid.columnsGap(16);
            Grid.rowsGap(16);
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
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
                                    let componentCall = new ValueCard(this, { icon: item.icon, title: item.title, value: item.value, unit: item.unit }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/ServerInfoView.ets", line: 270, col: 28 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            icon: item.icon,
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
            this.forEachUpdateFunction(elmtId, this.vocSensorData, forEachItemGenFunction, (item: CardData) => JSON.stringify(item), false, false);
        }, ForEach);
        ForEach.pop();
        Grid.pop();
        // 噪声传感器
        this.SectionTitle.bind(this)('噪声传感器');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Grid.create();
            Grid.columnsTemplate('1fr 1fr');
            Grid.columnsGap(16);
            Grid.rowsGap(16);
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
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
                                    let componentCall = new ValueCard(this, { icon: item.icon, title: item.title, value: item.value, unit: item.unit }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/ServerInfoView.ets", line: 281, col: 28 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            icon: item.icon,
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
            this.forEachUpdateFunction(elmtId, this.voiceSensorData, forEachItemGenFunction, (item: CardData) => JSON.stringify(item), false, false);
        }, ForEach);
        ForEach.pop();
        Grid.pop();
        // 红外传感器
        this.SectionTitle.bind(this)('红外传感器');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Grid.create();
            Grid.columnsTemplate('1fr 1fr');
            Grid.columnsGap(16);
            Grid.rowsGap(16);
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
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
                                    let componentCall = new ValueCard(this, { icon: item.icon, title: item.title, value: item.value, unit: item.unit }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/ServerInfoView.ets", line: 292, col: 28 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            icon: item.icon,
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
            this.forEachUpdateFunction(elmtId, this.redSensorData, forEachItemGenFunction, (item: CardData) => JSON.stringify(item), false, false);
        }, ForEach);
        ForEach.pop();
        Grid.pop();
        // 震动传感器
        this.SectionTitle.bind(this)('震动传感器');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Grid.create();
            Grid.columnsTemplate('1fr 1fr');
            Grid.columnsGap(16);
            Grid.rowsGap(16);
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
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
                                    let componentCall = new ValueCard(this, { title: item.title, value: item.value, unit: item.unit }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/ServerInfoView.ets", line: 303, col: 28 });
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
            this.forEachUpdateFunction(elmtId, this.sharkSensorData, forEachItemGenFunction, (item: CardData) => JSON.stringify(item), false, false);
        }, ForEach);
        ForEach.pop();
        Grid.pop();
        // RFID读卡器
        this.SectionTitle.bind(this)('RFID读卡器');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Grid.create();
            Grid.columnsTemplate('1fr');
            Grid.columnsGap(16);
            Grid.rowsGap(16);
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
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
                                    let componentCall = new ValueCard(this, { icon: item.icon, title: item.title, value: item.value, unit: item.unit }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/ServerInfoView.ets", line: 314, col: 28 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            icon: item.icon,
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
            this.forEachUpdateFunction(elmtId, this.rfidSensorData, forEachItemGenFunction, (item: CardData) => JSON.stringify(item), false, false);
        }, ForEach);
        ForEach.pop();
        Grid.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
