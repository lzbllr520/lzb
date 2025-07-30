if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { LV_MD_CONTENT_TYPE, LV_MD_DATA_TYPE } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/constant/index&2.0.15';
import { WebControl } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/webControl/index&2.0.15';
import { ImgControl } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/imgControl/index&2.0.15';
import { determineTitle } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/determine/detTitle&2.0.15';
import { determineImg } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/determine/detImg&2.0.15';
import { determineQuote } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/determine/detQuote&2.0.15';
import { determineLine } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/determine/detLine&2.0.15';
import { determineTable } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/determine/detTable&2.0.15';
import { determineCode } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/determine/detCode&2.0.15';
import { determineCheckbox } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/determine/detCheckbox&2.0.15';
import { determineTabulate } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/determine/detTabulate&2.0.15';
import { determineHTMLIMG, determineHTMLFONT } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/determine/detHTMLEL&2.0.15';
import { lvTitleComponent } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvTitleComponent&2.0.15';
import { lvCompositeComponent } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvCompositeComponent&2.0.15';
import { lvTableComponent } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvTableComponent&2.0.15';
import { lvCodeComponent } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvCodeComponent&2.0.15';
import { lvImgComponent } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvImgComponent&2.0.15';
import lvLineBuilder from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvLineBuilder&2.0.15';
import { lvQuoteComponent } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvQuoteComponent&2.0.15';
import { lvCheckboxComponent } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvCheckboxComponent&2.0.15';
import { lvTabulateComponent } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvTabulateComponent&2.0.15';
import { lvHTMLImgComponent } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvHTMLImgComponent&2.0.15';
import { lvHTMLFontComponent } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvHTMLFontComponent&2.0.15';
import buffer from "@ohos:buffer";
import fs from "@ohos:file.fs";
import { lvFootnoteView } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvFootnoteComponent&2.0.15';
import { LvFootnoteController } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/controller/lvFootnoteController&2.0.15';
import { html2md } from '@normalized:N&&&@luvi/html2md/Index&1.0.3';
export default class lvMarkdownIn extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.o = new SynchedPropertySimpleOneWayPU(params.text, this, "text");
        this.t = new SynchedPropertySimpleOneWayPU(params.loadMode, this, "loadMode");
        this.u = new SynchedPropertySimpleOneWayPU(params.rawfilePath, this, "rawfilePath");
        this.a1 = new SynchedPropertySimpleOneWayPU(params.sandboxPath, this, "sandboxPath");
        this.b1 = new ObservedPropertyObjectPU(null, this, "context");
        this.loadCallBack = {
            success(msg) {
            },
            fail(msg) {
            }
        };
        this.c1 = new ObservedPropertySimplePU(new Date().getTime(), this, "cge");
        this.d1 = new ObservedPropertyObjectPU([], this, "resultData");
        this.e1 = new ObservedPropertyObjectPU(new LvFootnoteController(), this, "footnoteController");
        this.startTime = new Date().getTime();
        this.dialogController = new CustomDialogController({
            builder: () => {
                let jsDialog = new WebControl(this, {}, undefined, -1, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 78, f1: 14 });
                jsDialog.setController(this.dialogController);
                ViewPU.create(jsDialog);
                let paramsLambda = () => {
                    return {};
                };
                jsDialog.paramsGenerator_ = paramsLambda;
            },
            alignment: DialogAlignment.Bottom,
            customStyle: true
        }, this);
        this.imgController = new CustomDialogController({
            builder: () => {
                let jsDialog = new ImgControl(this, {}, undefined, -1, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 83, f1: 14 });
                jsDialog.setController(this.imgController);
                ViewPU.create(jsDialog);
                let paramsLambda = () => {
                    return {};
                };
                jsDialog.paramsGenerator_ = paramsLambda;
            },
            customStyle: true
        }, this);
        this.setInitiallyProvidedValue(params);
        this.declareWatch("text", this.textChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params) {
        if (params.loadMode === undefined) {
            this.t.set("text");
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.loadCallBack !== undefined) {
            this.loadCallBack = params.loadCallBack;
        }
        if (params.cge !== undefined) {
            this.cge = params.cge;
        }
        if (params.resultData !== undefined) {
            this.resultData = params.resultData;
        }
        if (params.footnoteController !== undefined) {
            this.footnoteController = params.footnoteController;
        }
        if (params.startTime !== undefined) {
            this.startTime = params.startTime;
        }
        if (params.dialogController !== undefined) {
            this.dialogController = params.dialogController;
        }
        if (params.imgController !== undefined) {
            this.imgController = params.imgController;
        }
    }
    updateStateVars(params) {
        this.o.reset(params.text);
        this.t.reset(params.loadMode);
        this.u.reset(params.rawfilePath);
        this.a1.reset(params.sandboxPath);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.o.purgeDependencyOnElmtId(rmElmtId);
        this.t.purgeDependencyOnElmtId(rmElmtId);
        this.u.purgeDependencyOnElmtId(rmElmtId);
        this.a1.purgeDependencyOnElmtId(rmElmtId);
        this.b1.purgeDependencyOnElmtId(rmElmtId);
        this.c1.purgeDependencyOnElmtId(rmElmtId);
        this.d1.purgeDependencyOnElmtId(rmElmtId);
        this.e1.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.o.aboutToBeDeleted();
        this.t.aboutToBeDeleted();
        this.u.aboutToBeDeleted();
        this.a1.aboutToBeDeleted();
        this.b1.aboutToBeDeleted();
        this.c1.aboutToBeDeleted();
        this.d1.aboutToBeDeleted();
        this.e1.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get text() {
        return this.o.get();
    }
    set text(newValue) {
        this.o.set(newValue);
    }
    get loadMode() {
        return this.t.get();
    }
    set loadMode(newValue) {
        this.t.set(newValue);
    }
    get rawfilePath() {
        return this.u.get();
    }
    set rawfilePath(newValue) {
        this.u.set(newValue);
    }
    get sandboxPath() {
        return this.a1.get();
    }
    set sandboxPath(newValue) {
        this.a1.set(newValue);
    }
    get context() {
        return this.b1.get();
    }
    set context(newValue) {
        this.b1.set(newValue);
    }
    get cge() {
        return this.c1.get();
    }
    set cge(newValue) {
        this.c1.set(newValue);
    }
    get resultData() {
        return this.d1.get();
    }
    set resultData(newValue) {
        this.d1.set(newValue);
    }
    get footnoteController() {
        return this.e1.get();
    }
    set footnoteController(newValue) {
        this.e1.set(newValue);
    }
    textChange() {
        if (this.loadMode == "text") {
            this._readText();
        }
    }
    cBack(type, code, message) {
        if (type == "success") {
            if (this.loadCallBack.success) {
                this.loadCallBack?.success({ code: code, message: message });
            }
        }
        if (type == "fail") {
            if (this.loadCallBack.fail) {
                this.loadCallBack?.fail({ code: code, message: message });
            }
        }
    }
    aboutToAppear() {
        this.startTime = new Date().getTime();
        if (this.loadMode == "text") {
            this._readText();
        }
        if (this.loadMode == "rawfile") {
            this._loadRawfile();
        }
        if (this.loadMode == "sandbox") {
            this._loadSandbox();
        }
    }
    _loadRawfile() {
        if (!this.rawfilePath && this.loadCallBack.fail) {
            this.cBack("fail", "50011", "The rawfile resource file is incorrect.");
            return;
        }
        if (!this.context) {
            this.cBack("fail", "50030", "The context is incorrect.");
            return;
        }
        try {
            let q1 = this.context?.resourceManager.getRawFileContentSync(this.rawfilePath);
            let s1 = buffer.from(q1).buffer;
            let t1 = new buffer.Blob([s1]);
            let u1 = t1.text();
            u1.then((str) => {
                this._readText(str);
            });
        }
        catch (error) {
            this.cBack("fail", "50012", "The resourceManager getRawFileContentSync is error, " +
                JSON.stringify(error));
        }
    }
    _loadSandbox() {
        if (!this.sandboxPath) {
            this.cBack("fail", "50021", "The sandbox file is incorrect.");
            return;
        }
        try {
            let p1 = {
                offset: 0,
                length: 0,
                encoding: 'utf-8'
            };
            let stat = fs.statSync(this.sandboxPath);
            p1.length = stat.size;
            let str = fs.readTextSync(this.sandboxPath, p1);
            this._readText(str);
        }
        catch (error) {
            this.cBack("fail", "50022", "The fileIo readText is error, " +
                JSON.stringify(error));
        }
    }
    _readText(text = this.text) {
        const i1 = html2md(text);
        console.log("luvi > " + i1);
        let j1 = -1;
        let k1 = i1.split('\n').map((item) => {
            if (j1 < 0) {
                if (determineCode(item)) {
                    ++j1;
                    return LV_MD_CONTENT_TYPE.CODE;
                }
                if (determineTable(item)) {
                    return LV_MD_CONTENT_TYPE.TABLE;
                }
                return LV_MD_CONTENT_TYPE.TEXT;
            }
            else {
                if (determineCode(item)) {
                    j1 = -1;
                    return LV_MD_CONTENT_TYPE.TEXT;
                }
                else {
                    return LV_MD_CONTENT_TYPE.CODE;
                }
            }
        });
        let l1 = [];
        let m1 = "";
        let n1 = "";
        i1.split('\n').forEach((item, o1) => {
            if (k1[o1] == LV_MD_CONTENT_TYPE.TEXT) {
                if (m1 != "") {
                    m1 += item + '\n';
                    l1.push([LV_MD_CONTENT_TYPE.CODE, m1]);
                    m1 = "";
                }
                else if (n1 != "") {
                    n1 += item + '\n';
                    l1.push([LV_MD_CONTENT_TYPE.TABLE, n1]);
                    n1 = "";
                }
                else {
                    if (determineTitle(item)) {
                        return l1.push([LV_MD_CONTENT_TYPE.TITLE, item.trim()]);
                    }
                    else if (determineImg(item)) {
                        return l1.push([LV_MD_CONTENT_TYPE.IMG, item.trim()]);
                    }
                    else if (determineQuote(item)) {
                        return l1.push([LV_MD_CONTENT_TYPE.QUOTE, item.trim()]);
                    }
                    else if (determineLine(item)) {
                        return l1.push([LV_MD_CONTENT_TYPE.LINE, item.trim()]);
                    }
                    else if (determineCheckbox(item)) {
                        return l1.push([LV_MD_CONTENT_TYPE.CHECKBOX, item.trim()]);
                    }
                    else if (o1 > 0 && determineTabulate(item, i1.split('\n')[o1 - 1], i1.split('\n')[o1 + 1])) {
                        return l1.push([LV_MD_CONTENT_TYPE.TABULATE, item]);
                    }
                    else if (determineHTMLIMG(item)) {
                        return l1.push([LV_MD_CONTENT_TYPE.HTMLIMG, item]);
                    }
                    else if (determineHTMLFONT(item)) {
                        return l1.push([LV_MD_CONTENT_TYPE.HTMLFONT, item]);
                    }
                    else {
                        return l1.push([LV_MD_CONTENT_TYPE.TEXT, item.trim()]);
                    }
                }
            }
            else if (k1[o1] == LV_MD_CONTENT_TYPE.TABLE) {
                n1 += item + '\n';
            }
            else {
                m1 += item + '\n';
            }
            return item;
        });
        this.resultData = l1;
        this.cBack("success", "20000", "Component Load Success.");
        const endTime = new Date().getTime();
        const elapsedTime = endTime - this.startTime;
        console.log(`lv-markdown-in execution time is: ${elapsedTime} ms`);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create();
            List.edgeEffect(EdgeEffect.None);
            List.scrollBar(BarState.Off);
        }, List);
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
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.alignItems(HorizontalAlign.Start);
                    Column.width('100%');
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    ForEach.create();
                    const forEachItemGenFunction = _item => {
                        const item = _item;
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.margin({ top: !item[1] ? 10 : 5 });
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item[LV_MD_DATA_TYPE.FLAG] === LV_MD_CONTENT_TYPE.TEXT) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new lvCompositeComponent(this, {
                                                    text: item[LV_MD_DATA_TYPE.MSG],
                                                    dialogController: this.dialogController,
                                                    footnoteController: this.footnoteController
                                                }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 245, f1: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        text: item[LV_MD_DATA_TYPE.MSG],
                                                        dialogController: this.dialogController,
                                                        footnoteController: this.footnoteController
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    footnoteController: this.footnoteController
                                                });
                                            }
                                        }, { name: "lvCompositeComponent" });
                                    }
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item[LV_MD_DATA_TYPE.FLAG] === LV_MD_CONTENT_TYPE.TITLE) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new lvTitleComponent(this, { text: item[LV_MD_DATA_TYPE.MSG], dialogController: this.dialogController }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 252, f1: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        text: item[LV_MD_DATA_TYPE.MSG],
                                                        dialogController: this.dialogController
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                                            }
                                        }, { name: "lvTitleComponent" });
                                    }
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item[LV_MD_DATA_TYPE.FLAG] === LV_MD_CONTENT_TYPE.CODE) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new lvCodeComponent(this, { text: item[LV_MD_DATA_TYPE.MSG] }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 255, f1: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        text: item[LV_MD_DATA_TYPE.MSG]
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                                            }
                                        }, { name: "lvCodeComponent" });
                                    }
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item[LV_MD_DATA_TYPE.FLAG] === LV_MD_CONTENT_TYPE.IMG) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new lvImgComponent(this, { text: item[LV_MD_DATA_TYPE.MSG], dialogController: this.imgController }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 258, f1: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        text: item[LV_MD_DATA_TYPE.MSG],
                                                        dialogController: this.imgController
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                                            }
                                        }, { name: "lvImgComponent" });
                                    }
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item[LV_MD_DATA_TYPE.FLAG] === LV_MD_CONTENT_TYPE.HTMLIMG) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new lvHTMLImgComponent(this, { text: item[LV_MD_DATA_TYPE.MSG], dialogController: this.imgController }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 261, f1: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        text: item[LV_MD_DATA_TYPE.MSG],
                                                        dialogController: this.imgController
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                                            }
                                        }, { name: "lvHTMLImgComponent" });
                                    }
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item[LV_MD_DATA_TYPE.FLAG] === LV_MD_CONTENT_TYPE.HTMLFONT) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new lvHTMLFontComponent(this, { text: item[LV_MD_DATA_TYPE.MSG] }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 264, f1: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        text: item[LV_MD_DATA_TYPE.MSG]
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                                            }
                                        }, { name: "lvHTMLFontComponent" });
                                    }
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item[LV_MD_DATA_TYPE.FLAG] === LV_MD_CONTENT_TYPE.QUOTE) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new lvQuoteComponent(this, {
                                                    text: item[LV_MD_DATA_TYPE.MSG],
                                                    dialogController: this.dialogController,
                                                }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 267, f1: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        text: item[LV_MD_DATA_TYPE.MSG],
                                                        dialogController: this.dialogController
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                                            }
                                        }, { name: "lvQuoteComponent" });
                                    }
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item[LV_MD_DATA_TYPE.FLAG] === LV_MD_CONTENT_TYPE.LINE) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    lvLineBuilder.bind(this)();
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item[LV_MD_DATA_TYPE.FLAG] === LV_MD_CONTENT_TYPE.TABLE) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new lvTableComponent(this, {
                                                    text: item[LV_MD_DATA_TYPE.MSG],
                                                    dialogController: this.dialogController,
                                                }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 276, f1: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        text: item[LV_MD_DATA_TYPE.MSG],
                                                        dialogController: this.dialogController
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                                            }
                                        }, { name: "lvTableComponent" });
                                    }
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item[LV_MD_DATA_TYPE.FLAG] === LV_MD_CONTENT_TYPE.CHECKBOX) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new lvCheckboxComponent(this, {
                                                    text: item[LV_MD_DATA_TYPE.MSG],
                                                    dialogController: this.dialogController,
                                                }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 282, f1: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        text: item[LV_MD_DATA_TYPE.MSG],
                                                        dialogController: this.dialogController
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                                            }
                                        }, { name: "lvCheckboxComponent" });
                                    }
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (item[LV_MD_DATA_TYPE.FLAG] === LV_MD_CONTENT_TYPE.TABULATE) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new lvTabulateComponent(this, {
                                                    text: item[LV_MD_DATA_TYPE.MSG],
                                                    dialogController: this.dialogController,
                                                }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 288, f1: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        text: item[LV_MD_DATA_TYPE.MSG],
                                                        dialogController: this.dialogController
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                                            }
                                        }, { name: "lvTabulateComponent" });
                                    }
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        Row.pop();
                    };
                    this.forEachUpdateFunction(elmtId, this.resultData, forEachItemGenFunction);
                }, ForEach);
                ForEach.pop();
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new lvFootnoteView(this, { dialogController: this.dialogController }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/Index.ets", line: 296, f1: 13 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    dialogController: this.dialogController
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "lvFootnoteView" });
                }
                Column.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        List.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
