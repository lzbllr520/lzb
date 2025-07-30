if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WebViewComponent_Params {
    //控制器对象
    controller?: WebviewController;
}
import webview from "@ohos:web.webview";
export class WebViewComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.controller = new webview.WebviewController();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WebViewComponent_Params) {
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
    }
    updateStateVars(params: WebViewComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    //控制器对象
    private controller: WebviewController;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //加载网络页面
            Web.create({ src: { "id": 0, "type": 30000, params: ['CloudOfPoints.html'], "bundleName": "com.my.myapplication", "moduleName": "entry" }, controller: this.controller });
        }, Web);
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "WebViewComponent";
    }
}
registerNamedRoute(() => new WebViewComponent(undefined, {}), "", { bundleName: "com.my.myapplication", moduleName: "entry", pagePath: "pages/Test", pageFullPath: "entry/src/main/ets/pages/Test", integratedHsp: "false", moduleType: "followWithHap" });
