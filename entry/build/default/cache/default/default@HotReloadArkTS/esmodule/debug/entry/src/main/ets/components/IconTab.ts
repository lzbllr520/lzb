if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface IconTab_Params {
    icon?: Resource;
    isSelected?: boolean;
    isPressed?: boolean;
}
export class IconTab extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__icon = new SynchedPropertyObjectOneWayPU(params.icon, this, "icon");
        this.__isSelected = new SynchedPropertySimpleOneWayPU(params.isSelected, this, "isSelected");
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: IconTab_Params) {
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
    }
    updateStateVars(params: IconTab_Params) {
        this.__icon.reset(params.icon);
        this.__isSelected.reset(params.isSelected);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__icon.purgeDependencyOnElmtId(rmElmtId);
        this.__isSelected.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__icon.aboutToBeDeleted();
        this.__isSelected.aboutToBeDeleted();
        this.__isPressed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 接收父组件传入的图标资源
    private __icon: SynchedPropertySimpleOneWayPU<Resource>;
    get icon() {
        return this.__icon.get();
    }
    set icon(newValue: Resource) {
        this.__icon.set(newValue);
    }
    // 接收父组件传入的是否为“当前选中”的状态
    private __isSelected: SynchedPropertySimpleOneWayPU<boolean>;
    get isSelected() {
        return this.__isSelected.get();
    }
    set isSelected(newValue: boolean) {
        this.__isSelected.set(newValue);
    }
    // 组件内部状态，用于追踪是否被按下
    private __isPressed: ObservedPropertySimplePU<boolean>;
    get isPressed() {
        return this.__isPressed.get();
    }
    set isPressed(newValue: boolean) {
        this.__isPressed.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation({ duration: 200, curve: Curve.EaseInOut });
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.backgroundColor(this.isSelected ? 'rgba(255, 255, 255, 0.15)' : Color.Transparent);
            Column.borderRadius(12);
            Context.animation(null);
            Column.scale({ x: this.isPressed ? 0.9 : 1.0, y: this.isPressed ? 0.9 : 1.0 });
            Column.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.isPressed = true;
                }
                if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.isPressed = false;
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 显示图标
            Image.create(this.icon);
            // 显示图标
            Image.width(28);
            // 显示图标
            Image.height(28);
            // 显示图标
            Image.fillColor(this.isSelected ? Color.White : 'rgba(255, 255, 255, 0.6)');
        }, Image);
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
