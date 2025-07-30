if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { lvFootnoteController } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/controller/lvFootnoteController&2.0.15';
import handleTableText from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/handle/handleTableText&2.0.15';
import { lvCompositeComponent } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/lvCompositeComponent&2.0.15';
import promptAction from "@ohos:promptAction";
export class lvTableComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.o = new ObservedPropertySimplePU("", this, "text");
        this.h1 = new ObservedPropertyObjectPU(null, this, "dialogController");
        this.c2 = new ObservedPropertyObjectPU([], this, "cellWidthArrayIndexed");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params) {
        if (params.text !== undefined) {
            this.text = params.text;
        }
        if (params.dialogController !== undefined) {
            this.dialogController = params.dialogController;
        }
        if (params.cellWidthArrayIndexed !== undefined) {
            this.cellWidthArrayIndexed = params.cellWidthArrayIndexed;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.o.purgeDependencyOnElmtId(rmElmtId);
        this.h1.purgeDependencyOnElmtId(rmElmtId);
        this.c2.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.o.aboutToBeDeleted();
        this.h1.aboutToBeDeleted();
        this.c2.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get text() {
        return this.o.get();
    }
    set text(newValue) {
        this.o.set(newValue);
    }
    get dialogController() {
        return this.h1.get();
    }
    set dialogController(newValue) {
        this.h1.set(newValue);
    }
    get cellWidthArrayIndexed() {
        return this.c2.get();
    }
    set cellWidthArrayIndexed(newValue) {
        this.c2.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width("100%");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create();
            List.listDirection(Axis.Horizontal);
            List.margin({ bottom: 5 });
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
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    ForEach.create();
                    const forEachItemGenFunction = (_item, c4) => {
                        const item = _item;
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.alignItems(HorizontalAlign.Start);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (handleTableText(this.text)[1].split('-').length - 1 < 2) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item);
                                        Text.fontSize(15);
                                    }, Text);
                                    Text.pop();
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (c4 === 0) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.lvTableHeadBuilder.bind(this)(item, ObservedObject.GetRawObject(this.dialogController));
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
                                        if (c4 > 1 && c4 < handleTableText(this.text).length - 2) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.lvTableRowBuilder.bind(this)(item, c4, ObservedObject.GetRawObject(this.dialogController));
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                });
                            }
                        }, If);
                        If.pop();
                        Column.pop();
                    };
                    this.forEachUpdateFunction(elmtId, handleTableText(this.text), forEachItemGenFunction, undefined, true, false);
                }, ForEach);
                ForEach.pop();
                Column.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        List.pop();
        Row.pop();
    }
    lvTableHeadBuilder(text, b4, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.backgroundColor("#F5F7FA");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    __Common__.create();
                    __Common__.align(Alignment.Center);
                    __Common__.padding({
                        top: 8,
                        bottom: 8,
                        left: 3,
                        right: 3
                    });
                    __Common__.width(this.cellWidthArrayIndexed[index] ? this.cellWidthArrayIndexed[index] : 120);
                    __Common__.onClick(() => {
                        promptAction.showToast({ message: item.trim() });
                    });
                }, __Common__);
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new lvCompositeComponent(this, {
                                footnoteController: lvFootnoteController,
                                text: item.trim(),
                                fontWeight: FontWeight.Bold,
                                textOverflow: TextOverflow.MARQUEE,
                                maxLines: 1,
                                dialogController: b4
                            }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/utils/lvTableComponent.ets", line: 44, f1: 9 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    footnoteController: lvFootnoteController,
                                    text: item.trim(),
                                    fontWeight: FontWeight.Bold,
                                    textOverflow: TextOverflow.MARQUEE,
                                    maxLines: 1,
                                    dialogController: b4
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                footnoteController: lvFootnoteController
                            });
                        }
                    }, { name: "lvCompositeComponent" });
                }
                __Common__.pop();
            };
            this.forEachUpdateFunction(elmtId, text.split('|')
                .filter((item) => item.trim()), forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    lvTableRowBuilder(text, z3, a4, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.backgroundColor(z3 % 2 === 0 ? "#fff" : "#fafafa");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    __Common__.create();
                    __Common__.padding({
                        top: 8,
                        bottom: 8,
                        left: 3,
                        right: 3
                    });
                    __Common__.constraintSize({
                        minWidth: this.cellWidthArrayIndexed[index] ? this.cellWidthArrayIndexed[index] : 120,
                        maxWidth: 250
                    });
                    __Common__.onAreaChange((oldValue, newValue) => {
                        if (oldValue.width != newValue.width) {
                            if (!this.cellWidthArrayIndexed[index] || newValue.width > this.cellWidthArrayIndexed[index]) {
                                this.cellWidthArrayIndexed[index] = newValue.width;
                            }
                        }
                    });
                    __Common__.onClick(() => {
                        promptAction.showToast({ message: item.trim() });
                    });
                }, __Common__);
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new lvCompositeComponent(this, {
                                footnoteController: lvFootnoteController,
                                text: item.trim(),
                                textOverflow: TextOverflow.Ellipsis,
                                maxLines: 5,
                                dialogController: a4
                            }, undefined, elmtId, () => { }, { page: "lvMarkdownIn/src/main/ets/lv-markdown-in/lib/utils/lvTableComponent.ets", line: 72, f1: 9 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    footnoteController: lvFootnoteController,
                                    text: item.trim(),
                                    textOverflow: TextOverflow.Ellipsis,
                                    maxLines: 5,
                                    dialogController: a4
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                footnoteController: lvFootnoteController
                            });
                        }
                    }, { name: "lvCompositeComponent" });
                }
                __Common__.pop();
            };
            this.forEachUpdateFunction(elmtId, text.split('|').filter((item) => item.trim()), forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
