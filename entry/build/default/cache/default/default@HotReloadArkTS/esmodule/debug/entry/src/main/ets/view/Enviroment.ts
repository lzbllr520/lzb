if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Environment_Params {
    currentIndex?: number;
    servers?: Server[];
    controller?: TabsController;
}
import { ServerInfoView } from "@normalized:N&&&entry/src/main/ets/components/ServerInfoView&";
import type { Server } from '../model/ServerState';
export class Environment extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__servers = new SynchedPropertyObjectOneWayPU(params.servers, this, "servers");
        this.controller = new TabsController();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Environment_Params) {
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.servers === undefined) {
            this.__servers.set([]);
        }
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
    }
    updateStateVars(params: Environment_Params) {
        this.__servers.reset(params.servers);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__servers.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__servers.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __servers: SynchedPropertySimpleOneWayPU<Server[]>;
    get servers() {
        return this.__servers.get();
    }
    set servers(newValue: Server[]) {
        this.__servers.set(newValue);
    }
    private controller: TabsController;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.servers || this.servers.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无服务器');
                        Text.fontColor(Color.White);
                        Text.fontWeight(FontWeight.Bolder);
                        Text.fontSize(30);
                        Text.opacity(0.8);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.layoutWeight(1);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Tabs.create({
                            controller: this.controller,
                            barPosition: BarPosition.Start,
                            index: this.currentIndex
                        });
                        Tabs.margin({ left: 10 });
                        Tabs.vertical(true);
                        Tabs.barMode(BarMode.Fixed);
                        Tabs.barWidth(60);
                        Tabs.animationDuration(300);
                        Tabs.onChange((index: number) => {
                            this.currentIndex = index;
                        });
                        Tabs.layoutWeight(1);
                    }, Tabs);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const server = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                TabContent.create(() => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.width('100%');
                                        Column.height('100%');
                                    }, Column);
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new ServerInfoView(this, {
                                                    server: server,
                                                    isActive: this.currentIndex === index
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/Enviroment.ets", line: 37, col: 23 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        server: server,
                                                        isActive: this.currentIndex === index
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    server: server,
                                                    isActive: this.currentIndex === index
                                                });
                                            }
                                        }, { name: "ServerInfoView" });
                                    }
                                    Column.pop();
                                });
                                TabContent.tabBar({ builder: () => {
                                        this.buildTabBar.call(this, { "id": 16777280, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, index);
                                    } });
                            }, TabContent);
                            TabContent.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.servers, forEachItemGenFunction, (server: Server) => server.id, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Tabs.pop();
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    private buildTabBar(icon: Resource, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation({ duration: 200, curve: Curve.EaseInOut });
            Column.width('90%');
            Column.aspectRatio(1);
            Column.justifyContent(FlexAlign.Center);
            Column.backgroundColor(this.currentIndex === index ? 'rgba(255, 255, 255, 0.25)' : Color.Transparent);
            Column.scale(this.currentIndex === index ? { x: 1.1, y: 1.1 } : { x: 1.0, y: 1.0 });
            Column.borderRadius(12);
            Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(icon);
            Image.width(18);
            Image.height(18);
            Image.fillColor(Color.White);
            Image.objectFit(ImageFit.Contain);
        }, Image);
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
