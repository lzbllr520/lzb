if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TaskLog_Params {
    allLogItems?: LogEntry[];
    displayedLogs?: LogEntry[];
    searchQuery?: string;
    //接收从父组件传来的 clearAllLogs 函数，清除日志
    clearAllLogs?: () => void;
}
interface LevelStyle {
    icon: Resource;
    color: Color;
}
interface LogEntry {
    id: number;
    level: 'info' | 'warning' | 'error';
    timestamp: string;
    message: string;
}
export class TaskLog extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__allLogItems = new SynchedPropertyObjectOneWayPU(params.allLogItems, this, "allLogItems");
        this.__displayedLogs = new ObservedPropertyObjectPU([], this, "displayedLogs");
        this.__searchQuery = new ObservedPropertySimplePU('', this, "searchQuery");
        this.clearAllLogs = () => { };
        this.setInitiallyProvidedValue(params);
        this.declareWatch("allLogItems", this.onAllLogsUpdated);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TaskLog_Params) {
        if (params.displayedLogs !== undefined) {
            this.displayedLogs = params.displayedLogs;
        }
        if (params.searchQuery !== undefined) {
            this.searchQuery = params.searchQuery;
        }
        if (params.clearAllLogs !== undefined) {
            this.clearAllLogs = params.clearAllLogs;
        }
    }
    updateStateVars(params: TaskLog_Params) {
        this.__allLogItems.reset(params.allLogItems);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__allLogItems.purgeDependencyOnElmtId(rmElmtId);
        this.__displayedLogs.purgeDependencyOnElmtId(rmElmtId);
        this.__searchQuery.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__allLogItems.aboutToBeDeleted();
        this.__displayedLogs.aboutToBeDeleted();
        this.__searchQuery.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __allLogItems: SynchedPropertySimpleOneWayPU<LogEntry[]>;
    get allLogItems() {
        return this.__allLogItems.get();
    }
    set allLogItems(newValue: LogEntry[]) {
        this.__allLogItems.set(newValue);
    }
    private __displayedLogs: ObservedPropertyObjectPU<LogEntry[]>;
    get displayedLogs() {
        return this.__displayedLogs.get();
    }
    set displayedLogs(newValue: LogEntry[]) {
        this.__displayedLogs.set(newValue);
    }
    private __searchQuery: ObservedPropertySimplePU<string>;
    get searchQuery() {
        return this.__searchQuery.get();
    }
    set searchQuery(newValue: string) {
        this.__searchQuery.set(newValue);
    }
    //接收从父组件传来的 clearAllLogs 函数，清除日志
    private clearAllLogs: () => void;
    onAllLogsUpdated() {
        console.info('TaskLog:检测到父组件日志更新，同步刷新界面。');
        // 当父组件的数据源改变时（例如清空后），同步更新子组件的显示数据
        // 同时清空搜索框，确保显示的是最新的完整列表
        this.searchQuery = '';
        this.displayedLogs = this.allLogItems;
    }
    aboutToAppear() {
        this.displayedLogs = this.allLogItems;
    }
    performSearch() {
        if (!this.searchQuery.trim()) {
            this.displayedLogs = this.allLogItems;
            return;
        }
        const query = this.searchQuery.toLowerCase();
        const filtered = this.allLogItems.filter(item => item.level.toLowerCase().includes(query) ||
            item.timestamp.toLowerCase().includes(query) ||
            item.message.toLowerCase().includes(query));
        this.displayedLogs = filtered;
    }
    private getLevelStyle(level: 'info' | 'warning' | 'error'): LevelStyle {
        switch (level) {
            case 'info':
                return { icon: { "id": 16777253, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, color: Color.White };
            case 'warning':
                return { icon: { "id": 16777254, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, color: Color.Yellow };
            case 'error':
                return { icon: { "id": 16777252, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, color: Color.Red };
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.padding(24);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.width('100%');
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.layoutWeight(1);
            Row.height(50);
            Row.borderRadius(15);
            Row.backgroundColor('rgba(255, 255, 255, 0.15)');
            Row.border({ width: 1.5, color: 'rgba(255, 255, 255, 0.2)' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777264, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width(20);
            Image.height(20);
            Image.fillColor(Color.Gray);
            Image.margin({ left: 15 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '搜索等级/时间/内容...' });
            TextInput.placeholderColor('rgba(255, 255, 255, 0.6)');
            TextInput.fontColor(Color.White);
            TextInput.fontSize(16);
            TextInput.layoutWeight(1);
            TextInput.backgroundColor(Color.Transparent);
            TextInput.onChange((value: string) => { this.searchQuery = value; });
            TextInput.onSubmit(() => { this.performSearch(); });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('搜索');
            Button.height(50);
            Button.width(80);
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Bold);
            Button.type(ButtonType.Capsule);
            Button.backgroundColor('#1890ff');
            Button.onClick(() => { this.performSearch(); });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('清除');
            Button.height(50);
            Button.width(80);
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Bold);
            Button.type(ButtonType.Capsule);
            Button.backgroundColor('rgba(255, 80, 80, 0.76)');
            Button.onClick(() => { this.clearAllLogs(); });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.layoutWeight(1);
            Scroll.scrollable(ScrollDirection.Vertical);
            Scroll.scrollBar(BarState.On);
            Scroll.scrollBarColor('#888888');
            Scroll.scrollBarWidth(8);
            Scroll.edgeEffect(EdgeEffect.Spring);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.justifyContent(FlexAlign.Start);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 确保 Row 组件内包含用于显示内容的子组件
                    Row.create({ space: 15 });
                    // 确保 Row 组件内包含用于显示内容的子组件
                    Row.width('100%');
                    // 确保 Row 组件内包含用于显示内容的子组件
                    Row.padding(15);
                    // 确保 Row 组件内包含用于显示内容的子组件
                    Row.backgroundColor('rgba(10, 10, 15, 0.3)');
                    // 确保 Row 组件内包含用于显示内容的子组件
                    Row.borderRadius(12);
                    // 确保 Row 组件内包含用于显示内容的子组件
                    Row.backdropBlur(12);
                    // 确保 Row 组件内包含用于显示内容的子组件
                    Row.backgroundColor('rgba(10, 10, 15, 0.3)');
                    // 确保 Row 组件内包含用于显示内容的子组件
                    Row.borderRadius(16);
                    // 确保 Row 组件内包含用于显示内容的子组件
                    Row.border({
                        width: 1.5,
                        color: 'rgba(255, 255, 255, 0.15)'
                    });
                    // 确保 Row 组件内包含用于显示内容的子组件
                    Row.shadow({
                        radius: 30,
                        color: 'rgba(173, 216, 230, 0.2)',
                        offsetX: 0,
                        offsetY: 0
                    });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 等级图标
                    Image.create(this.getLevelStyle(item.level).icon);
                    // 等级图标
                    Image.width(24);
                    // 等级图标
                    Image.height(24);
                    // 等级图标
                    Image.fillColor(this.getLevelStyle(item.level).color);
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 时间戳和消息
                    Column.create({ space: 5 });
                    // 时间戳和消息
                    Column.alignItems(HorizontalAlign.Start);
                    // 时间戳和消息
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.message);
                    Text.fontSize(16);
                    Text.fontColor(Color.White);
                    Text.width('100%');
                    Text.textAlign(TextAlign.Start);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.timestamp);
                    Text.fontSize(12);
                    Text.fontColor(Color.Gray);
                    Text.width('100%');
                    Text.textAlign(TextAlign.Start);
                }, Text);
                Text.pop();
                // 时间戳和消息
                Column.pop();
                // 确保 Row 组件内包含用于显示内容的子组件
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.displayedLogs, forEachItemGenFunction, (item: LogEntry) => item.id.toString(), false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
