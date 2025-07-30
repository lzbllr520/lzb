if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { lvLink } from '../domain/LvLink';
import { mdRegister } from './common';
export class lvHyperlinkComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.o = new SynchedPropertySimpleOneWayPU(params.text, this, "text");
        this.w1 = new SynchedPropertySimpleOneWayPU(params.uri, this, "uri");
        this.t1 = new SynchedPropertyObjectOneWayPU(params.nLink, this, "nLink");
        this.u1 = new SynchedPropertySimpleOneWayPU(params.fontSize, this, "fontSize");
        this.o1 = new SynchedPropertySimpleOneWayPU(params.fontWeight, this, "fontWeight");
        this.h1 = new SynchedPropertyObjectOneWayPU(params.dialogController, this, "dialogController");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params) {
        if (params.text === undefined) {
            this.o.set("");
        }
        if (params.uri === undefined) {
            this.w1.set("");
        }
        if (params.nLink === undefined) {
            this.t1.set(lvLink);
        }
        if (params.fontSize === undefined) {
            this.u1.set("");
        }
        if (params.fontWeight === undefined) {
            this.o1.set(FontWeight.Normal);
        }
        if (params.dialogController === undefined) {
            this.h1.set(null);
        }
    }
    updateStateVars(params) {
        this.o.reset(params.text);
        this.w1.reset(params.uri);
        this.t1.reset(params.nLink);
        this.u1.reset(params.fontSize);
        this.o1.reset(params.fontWeight);
        this.h1.reset(params.dialogController);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.o.purgeDependencyOnElmtId(rmElmtId);
        this.w1.purgeDependencyOnElmtId(rmElmtId);
        this.t1.purgeDependencyOnElmtId(rmElmtId);
        this.u1.purgeDependencyOnElmtId(rmElmtId);
        this.o1.purgeDependencyOnElmtId(rmElmtId);
        this.h1.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.o.aboutToBeDeleted();
        this.w1.aboutToBeDeleted();
        this.t1.aboutToBeDeleted();
        this.u1.aboutToBeDeleted();
        this.o1.aboutToBeDeleted();
        this.h1.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get text() {
        return this.o.get();
    }
    set text(newValue) {
        this.o.set(newValue);
    }
    get uri() {
        return this.w1.get();
    }
    set uri(newValue) {
        this.w1.set(newValue);
    }
    get nLink() {
        return this.t1.get();
    }
    set nLink(newValue) {
        this.t1.set(newValue);
    }
    get fontSize() {
        return this.u1.get();
    }
    set fontSize(newValue) {
        this.u1.set(newValue);
    }
    get fontWeight() {
        return this.o1.get();
    }
    set fontWeight(newValue) {
        this.o1.set(newValue);
    }
    get dialogController() {
        return this.h1.get();
    }
    set dialogController(newValue) {
        this.h1.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Span.create(this.text || this.uri);
            Span.fontColor(this.nLink.getTextColor());
            Span.fontSize(this.fontSize || this.nLink.getTextSize());
            Span.fontWeight(this.fontWeight);
            Span.onClick(() => {
                if (mdRegister.HandleHyperlink(this.uri)) {
                    this.nLink.setLinkUrl(this.uri);
                    this.dialogController?.open();
                }
            });
        }, Span);
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export default function lvHyperlinkBuilder(text, uri, w3, fontSize, fontWeight, x3, parent = null) {
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Span.create(text || uri);
        Span.fontColor(w3.getTextColor());
        Span.fontSize(fontSize || w3.getTextSize());
        Span.fontWeight(fontWeight);
        Span.onClick(() => {
            if (mdRegister.HandleHyperlink(uri)) {
                console.log("luvi > // 超链接加载的地址 " + uri);
                w3.setLinkUrl(uri);
                x3?.open();
            }
        });
    }, Span);
}
