if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { lvLink } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/domain/LvLink&2.0.15';
import { lvText } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/domain/LvText&2.0.15';
import { mdRegister } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/common/index&2.0.15';
import { SP_TYPE } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/constant/index&2.0.15';
import { lvFootnoteController } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/controller/lvFootnoteController&2.0.15';
import handleTextType from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/handle/handleTextType&2.0.15';
import lvHyperlinkBuilder from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvHyperlinkComponent&2.0.15';
function v2(text) {
    const q3 = /^\*[^\*]+\*|^\_[^\_]+\_/;
    return q3.test(text);
}
function w2(text) {
    const p3 = /^\*\*[^\*\*]+\*\*|^\_\_[^\_\_]+\_\_/;
    return p3.test(text);
}
function z2(text) {
    const n3 = /^\*\*\*[^\*\*\*]+\*\*\*|^\_\_\_[^\_\_\_]+\_\_\_/;
    return n3.test(text);
}
function a3(text) {
    const m3 = /^\=\=.*\=\=$/;
    return m3.test(text);
}
function b3(text) {
    const l3 = /^\~\~.*\~\~$/;
    return l3.test(text);
}
function c3(text) {
    const k3 = /^\`.*\`$/;
    return k3.test(text);
}
function d3(text) {
    let flag = (text.trim().slice(0, 2) == '[^' && text.trim().indexOf('](') !== -1 &&
        text.trim().indexOf(')') !== -1);
    return flag;
}
function e3(text) {
    let flag = (text.trim().slice(0, 1) == '[' && text.trim().slice(0, 2) !== '[^' && text.trim().indexOf('](') !== -1 &&
        text.trim().indexOf(')') !== -1);
    return flag;
}
function f3(item) {
    const g3 = /\[([^\]]+)\]\(([^)]+)\)/;
    const match = item.match(g3) || [];
    let content = "";
    let h3 = "";
    let i3 = "";
    if (match.length > 0) {
        content = match[1].slice(1);
        if ((match[2].indexOf('"') !== -1) || (match[2].indexOf(`'`) !== -1)) {
            h3 = match[2].slice(0, match[2].indexOf('"') || match[2].indexOf(`'`));
        }
        else {
            h3 = match[2];
        }
        const j3 = match[2].match(/"([^"]+)"/) || [];
        if (j3.length > 0) {
            i3 = j3[1];
        }
    }
    return { content: content, m1: h3, n1: i3 };
}
export class lvCompositeComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.o = new ObservedPropertySimplePU("", this, "text");
        this.g1 = new ObservedPropertyObjectPU(lvText, this, "nText");
        this.o1 = new ObservedPropertySimplePU(FontWeight.Normal, this, "fontWeight");
        this.q1 = new ObservedPropertyObjectPU(null, this, "maxLines");
        this.s1 = new ObservedPropertySimplePU(TextOverflow.None, this, "textOverflow");
        this.t1 = new ObservedPropertyObjectPU(lvLink, this, "nLink");
        this.h1 = new ObservedPropertyObjectPU(null, this, "dialogController");
        this.e1 = new SynchedPropertyNesedObjectPU(params.footnoteController, this, "footnoteController");
        this.u1 = new ObservedPropertySimplePU("", this, "fontSize");
        this.v1 = new ObservedPropertySimplePU("", this, "fontColor");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params) {
        if (params.text !== undefined) {
            this.text = params.text;
        }
        if (params.nText !== undefined) {
            this.nText = params.nText;
        }
        if (params.fontWeight !== undefined) {
            this.fontWeight = params.fontWeight;
        }
        if (params.maxLines !== undefined) {
            this.maxLines = params.maxLines;
        }
        if (params.textOverflow !== undefined) {
            this.textOverflow = params.textOverflow;
        }
        if (params.nLink !== undefined) {
            this.nLink = params.nLink;
        }
        if (params.dialogController !== undefined) {
            this.dialogController = params.dialogController;
        }
        this.e1.set(params.footnoteController);
        if (params.fontSize !== undefined) {
            this.fontSize = params.fontSize;
        }
        if (params.fontColor !== undefined) {
            this.fontColor = params.fontColor;
        }
    }
    updateStateVars(params) {
        this.e1.set(params.footnoteController);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.o.purgeDependencyOnElmtId(rmElmtId);
        this.g1.purgeDependencyOnElmtId(rmElmtId);
        this.o1.purgeDependencyOnElmtId(rmElmtId);
        this.q1.purgeDependencyOnElmtId(rmElmtId);
        this.s1.purgeDependencyOnElmtId(rmElmtId);
        this.t1.purgeDependencyOnElmtId(rmElmtId);
        this.h1.purgeDependencyOnElmtId(rmElmtId);
        this.e1.purgeDependencyOnElmtId(rmElmtId);
        this.u1.purgeDependencyOnElmtId(rmElmtId);
        this.v1.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.o.aboutToBeDeleted();
        this.g1.aboutToBeDeleted();
        this.o1.aboutToBeDeleted();
        this.q1.aboutToBeDeleted();
        this.s1.aboutToBeDeleted();
        this.t1.aboutToBeDeleted();
        this.h1.aboutToBeDeleted();
        this.e1.aboutToBeDeleted();
        this.u1.aboutToBeDeleted();
        this.v1.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get text() {
        return this.o.get();
    }
    set text(newValue) {
        this.o.set(newValue);
    }
    get nText() {
        return this.g1.get();
    }
    set nText(newValue) {
        this.g1.set(newValue);
    }
    get fontWeight() {
        return this.o1.get();
    }
    set fontWeight(newValue) {
        this.o1.set(newValue);
    }
    get maxLines() {
        return this.q1.get();
    }
    set maxLines(newValue) {
        this.q1.set(newValue);
    }
    get textOverflow() {
        return this.s1.get();
    }
    set textOverflow(newValue) {
        this.s1.set(newValue);
    }
    get nLink() {
        return this.t1.get();
    }
    set nLink(newValue) {
        this.t1.set(newValue);
    }
    get dialogController() {
        return this.h1.get();
    }
    set dialogController(newValue) {
        this.h1.set(newValue);
    }
    get footnoteController() {
        return this.e1.get();
    }
    get fontSize() {
        return this.u1.get();
    }
    set fontSize(newValue) {
        this.u1.set(newValue);
    }
    get fontColor() {
        return this.v1.get();
    }
    set fontColor(newValue) {
        this.v1.set(newValue);
    }
    openUrl(uri) {
        if (mdRegister.HandleHyperlink(uri)) {
            this.nLink.setLinkUrl(uri);
            this.dialogController?.open();
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create();
            Text.textOverflow({ overflow: this.textOverflow });
            Text.maxLines(ObservedObject.GetRawObject(this.maxLines));
        }, Text);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (z2(item)) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Span.create(item.slice(3, -3));
                                Span.fontStyle(FontStyle.Italic);
                                Span.fontSize(this.fontSize || this.nText.getTextSize());
                                Span.fontColor(this.fontColor || this.nText.getTextColor());
                                Span.lineHeight(this.nText.getTextLineHeight());
                                Span.fontWeight(FontWeight.Bold);
                            }, Span);
                        });
                    }
                    else if (w2(item)) {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Span.create(item.slice(2, -2));
                                Span.fontWeight(FontWeight.Bold);
                                Span.fontSize(this.fontSize || this.nText.getTextSize());
                                Span.fontColor(this.fontColor || this.nText.getTextColor());
                                Span.lineHeight(this.nText.getTextLineHeight());
                            }, Span);
                        });
                    }
                    else if (v2(item)) {
                        this.ifElseBranchUpdateFunction(2, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Span.create(item.slice(1, -1));
                                Span.fontStyle(FontStyle.Italic);
                                Span.fontSize(this.fontSize || this.nText.getTextSize());
                                Span.fontColor(this.fontColor || this.nText.getTextColor());
                                Span.lineHeight(this.nText.getTextLineHeight());
                                Span.fontWeight(this.fontWeight);
                            }, Span);
                        });
                    }
                    else if (a3(item)) {
                        this.ifElseBranchUpdateFunction(3, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Span.create(item.slice(2, -2));
                                Span.backgroundColor(this.nText.getTextMarkBackground());
                                Span.borderRadius(3);
                                Span.padding({ left: 3, right: 3, top: 1 });
                                Span.fontSize(this.fontSize || this.nText.getTextSize());
                                Span.fontColor("#E6A23C");
                                Span.lineHeight(this.nText.getTextLineHeight());
                                Span.fontWeight(this.fontWeight);
                            }, Span);
                        });
                    }
                    else if (b3(item)) {
                        this.ifElseBranchUpdateFunction(4, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Span.create(item.slice(2, -2));
                                Span.decoration({ type: TextDecorationType.LineThrough });
                                Span.fontSize(this.fontSize || this.nText.getTextSize());
                                Span.fontColor(this.fontColor || this.nText.getTextColor());
                                Span.lineHeight(this.nText.getTextLineHeight());
                                Span.fontWeight(this.fontWeight);
                            }, Span);
                        });
                    }
                    else if (c3(item)) {
                        this.ifElseBranchUpdateFunction(5, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Span.create(item.slice(1, -1));
                                Span.fontSize(this.fontSize || this.nText.getTextSize());
                                Span.fontColor("#ff5722");
                                Span.lineHeight(this.nText.getTextLineHeight());
                                Span.fontWeight(this.fontWeight);
                            }, Span);
                        });
                    }
                    else if (d3(item)) {
                        this.ifElseBranchUpdateFunction(6, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Span.create(f3(item).content);
                                Span.fontColor("#F56C6C");
                                Span.fontWeight(FontWeight.Bold);
                                Span.lineHeight(this.nText.getTextLineHeight());
                                Span.onClick(() => {
                                    if (f3(item).m1.trim().slice(0, 4) == "http") {
                                        this.openUrl(f3(item).m1.trim());
                                    }
                                });
                            }, Span);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Span.create(` [${lvFootnoteController.footnoteList.split(SP_TYPE.SPK).indexOf(item) + 1}] `);
                                Span.fontColor("#F56C6C");
                                Span.fontSize(this.fontSize || 10);
                                Span.lineHeight(this.nText.getTextLineHeight());
                                Span.onClick(() => {
                                    if (f3(item).m1.trim().slice(0, 4) == "http") {
                                        this.openUrl(f3(item).m1.trim());
                                    }
                                });
                            }, Span);
                        });
                    }
                    else if (e3(item)) {
                        this.ifElseBranchUpdateFunction(7, () => {
                            lvHyperlinkBuilder.bind(this)(String(item.split('](')[0]).split('[')[1], String(item.split('](')[1]).split(')')[0], this.nLink, this.fontSize || this.nText.getTextSize(), this.fontWeight, this.dialogController);
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(8, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Span.create(item);
                                Span.fontSize(this.fontSize || this.nText.getTextSize());
                                Span.fontColor(this.fontColor || this.nText.getTextColor());
                                Span.lineHeight(this.nText.getTextLineHeight());
                                Span.fontWeight(this.fontWeight);
                            }, Span);
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, handleTextType(this.text), forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Text.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
