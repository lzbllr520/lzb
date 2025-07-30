if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DataStatics_Params {
    knowledgeItems?: KnowledgeInfo[];
    selectedItem?: KnowledgeInfo | null;
    dialogController?: CustomDialogController;
}
interface KnowledgeDetailDialog_Params {
    item?: KnowledgeInfo | null;
    controller?: CustomDialogController;
}
interface KnowledgeCard_Params {
    info?: KnowledgeInfo;
    onCardClick?: (info: KnowledgeInfo) => void;
    isPressed?: boolean;
}
import { LvMarkdownIn, lvText, lvTitle, lvLink, lvCode, lvQuote } from "@normalized:N&&&@luvi/lv-markdown-in/Index&2.0.15";
interface KnowledgeInfo {
    id: number;
    image: Resource;
    title: string;
    description: string;
    fullDescription: string;
}
class KnowledgeCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__info = new SynchedPropertyObjectOneWayPU(params.info, this, "info");
        this.onCardClick = () => { };
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: KnowledgeCard_Params) {
        if (params.onCardClick !== undefined) {
            this.onCardClick = params.onCardClick;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
    }
    updateStateVars(params: KnowledgeCard_Params) {
        this.__info.reset(params.info);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__info.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__info.aboutToBeDeleted();
        this.__isPressed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 让父组件可以传入数据
    private __info: SynchedPropertySimpleOneWayPU<KnowledgeInfo>;
    get info() {
        return this.__info.get();
    }
    set info(newValue: KnowledgeInfo) {
        this.__info.set(newValue);
    }
    private onCardClick: (info: KnowledgeInfo) => void;
    private __isPressed: ObservedPropertySimplePU<boolean>;
    get isPressed() {
        return this.__isPressed.get();
    }
    set isPressed(newValue: boolean) {
        this.__isPressed.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.debugLine("entry/src/main/ets/view/DataStatics.ets(21:5)", "entry");
            Context.animation({ duration: 150, curve: Curve.EaseInOut });
            Column.padding(20);
            Column.width('100%');
            Column.height(160);
            Column.alignItems(HorizontalAlign.Start);
            Column.justifyContent(FlexAlign.Start);
            Column.borderRadius(16);
            Column.backgroundColor('rgba(10, 10, 15, 0.3)');
            Column.backdropBlur(12);
            Column.backgroundColor('rgba(10, 10, 15, 0.3)');
            Column.borderRadius(16);
            Column.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.15)'
            });
            Column.shadow({
                radius: 30,
                color: 'rgba(173, 216, 230, 0.2)',
                offsetX: 0,
                offsetY: 0
            });
            Column.clip(true);
            Column.scale({ x: this.isPressed ? 0.97 : 1.0, y: this.isPressed ? 0.97 : 1.0 });
            Context.animation(null);
            Column.onClick(() => {
                this.onCardClick(ObservedObject.GetRawObject(this.info));
            });
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
            Text.create(this.info.title);
            Text.debugLine("entry/src/main/ets/view/DataStatics.ets(22:7)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.maxLines(2);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.info.description);
            Text.debugLine("entry/src/main/ets/view/DataStatics.ets(31:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('rgba(255, 255, 255, 0.75)');
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.maxLines(3);
            Text.lineHeight(20);
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class KnowledgeDetailDialog extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__item = new SynchedPropertyObjectTwoWayPU(params.item, this, "item");
        this.controller = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: KnowledgeDetailDialog_Params) {
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
    }
    updateStateVars(params: KnowledgeDetailDialog_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__item.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__item.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __item: SynchedPropertySimpleOneWayPU<KnowledgeInfo | null>;
    get item() {
        return this.__item.get();
    }
    set item(newValue: KnowledgeInfo | null) {
        this.__item.set(newValue);
    }
    private controller: CustomDialogController;
    setController(ctr: CustomDialogController) {
        this.controller = ctr;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.debugLine("entry/src/main/ets/view/DataStatics.ets(81:5)", "entry");
            Column.padding(24);
            Column.width('80%');
            Column.height('70%');
            Column.borderRadius(24);
            Column.backgroundColor('rgba(30, 30, 40, 1.00)');
            Column.backdropBlur(20);
            Column.border({ width: 1.5, color: 'rgba(255, 255, 255, 0.2)' });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.item?.title);
            Text.debugLine("entry/src/main/ets/view/DataStatics.ets(82:7)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/view/DataStatics.ets(87:7)", "entry");
            Divider.color('rgba(255, 255, 255, 0.2)');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/view/DataStatics.ets(89:7)", "entry");
            Scroll.scrollBar(BarState.Auto);
            Scroll.layoutWeight(1);
        }, Scroll);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new LvMarkdownIn(this, { text: this.item?.fullDescription ?? '' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DataStatics.ets", line: 90, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            text: this.item?.fullDescription ?? ''
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        text: this.item?.fullDescription ?? ''
                    });
                }
            }, { name: "LvMarkdownIn" });
        }
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('关闭');
            Button.debugLine("entry/src/main/ets/view/DataStatics.ets(95:7)", "entry");
            Button.width('100%');
            Button.height(45);
            Button.type(ButtonType.Capsule);
            Button.backgroundColor('rgba(255, 255, 255, 0.2)');
            Button.onClick(() => {
                this.controller.close();
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class DataStatics extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__knowledgeItems = new ObservedPropertyObjectPU([
            {
                id: 1,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '能效标签等级详解',
                description: '了解不同能效等级的含义、信息区内容以及它们如何影响产品分类。',
                fullDescription: '能效标签，又称能源效率标识，是附在耗能产品或其最小包装物上的一种信息标签，用于表示产品能源效率等级等性能指标。我国的能效标识将能效分为1、2、3、4、5共五个等级。\n\n- **等级1**：表示产品达到国际先进水平，最节电，即耗能最低。\n- **等级2**：表示比较节电。\n- **等级3**：表示产品的能源效率为我国市场的平均水平。\n- **等级4**：表示产品能源效率低于市场平均水平。\n- **等级5**：是市场准入指标，低于该等级要求的产品不允许生产和销售。'
            },
            {
                id: 2,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '产线安全操作规程',
                description: '查看机械臂、传送带的标准操作流程和紧急情况处理预案，确保人员与设备安全。',
                fullDescription: '1. **开机前检查**：确认所有安全门已关闭，急停按钮处于复位状态，机械臂工作范围内无杂物和人员。\n2. **运行中监控**：严禁在设备运行时将手或身体任何部分伸入工作区域。如遇异常，立即按下最近的急停按钮。\n3. **紧急处理**：发生紧急情况（如卡料、碰撞）时，必须先切断主电源，再进行处理。\n4. **关机流程**：待所有任务完成后，将机械臂复位到原点（Home），然后关闭控制器电源，最后关闭主电源。'
            },
            {
                id: 3,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '常见故障排查指南',
                description: '学习如何快速诊断和处理标签识别失败、机械臂抓取异常等常见问题。',
                fullDescription: '当产线出现问题时，请参照以下步骤排查：\n\n- **故障现象：标签无法识别**\n  - **可能原因1**：摄像头脏污或位置偏移。\n  - **排查方法**：清洁摄像头镜头，检查并重新校准摄像头位置。\n\n- **故障现象：机械臂抓取失败**\n  - **可能原因1**：抓取坐标偏移。\n  - **排查方法**：进入系统设置，重新校准机械臂的抓取点位。\n  - **可能原因2**：手爪气压不足或故障。\n  - **排查方法**：检查气源压力，检查手爪电磁阀是否正常工作。'
            },
            {
                id: 4,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '机械臂日常维护与保养',
                description: '定期对机械臂进行检查、清洁和润滑，是延长其使用寿命和保证精度的关键。',
                fullDescription: '为确保机械臂长期稳定运行，请遵循以下保养周期：\n\n- **每日检查**：\n  - 检查各轴运动是否平稳，有无异常噪音。\n  - 确认手爪（末端执行器）状态是否正常。\n\n- **每周检查**：\n  - 清洁机械臂本体及控制柜的灰尘。\n  - 检查所有外部电缆有无磨损或损坏。\n  - 检查并紧固所有可见的螺丝。\n\n- **每季度检查**：\n  - 检查各关节的润滑情况，按需添加指定型号的润滑脂。\n  - 检查电池（如有）并按需更换。'
            },
            {
                id: 5,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '视觉系统校准方法',
                description: '当识别精度下降时，需要重新校准摄像头。本文介绍详细的校准步骤。',
                fullDescription: '在以下情况发生时，建议重新校准视觉系统：\n1. 更换或移动过摄像头。\n2. 产线出现连续、规律性的识别错误。\n3. 更换了新的照明光源。\n\n**校准流程**：\n1. 从工具箱中取出专用的校准板。\n2. 将产线暂停，并将校准板放置在传送带的指定校准区域。\n3. 在中控平台的“系统设置” -> “摄像头设置”中，点击“开始校准”按钮。\n4. 系统会自动拍摄校准板图像并计算新的映射关系。请勿移动校准板直至系统提示“校准成功”。\n5. 移走校准板，恢复产线运行并观察识别效果。'
            },
            {
                id: 6,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '传送带速度与识别率关系',
                description: '探讨传送带速度对能效标签识别成功率的影响，找到生产效率与准确率的最佳平衡点。',
                fullDescription: '传送带速度是影响产线效率和识别准确率的关键参数。两者关系如下：\n\n- **速度过快**：\n  - **优点**：单位时间内处理量大，产线效率高。\n  - **缺点**：可能导致图像运动模糊，降低识别成功率；对机械臂的反应速度要求更高。\n\n- **速度过慢**：\n  - **优点**：图像清晰，识别准确率高，机械臂抓取更稳定。\n  - **缺点**：产线整体效率降低。\n\n**建议**：在“系统设置”中，通常建议将速度维持在系统推荐值（例如 0.5m/s）。只有在处理表面反光严重或标签印刷质量较差的产品时，可适当降低速度以保证准确率。'
            },
            {
                id: 7,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '新产品型号录入流程',
                description: '介绍如何将新的家电型号添加到识别和分拣系统中，确保系统能正确处理。',
                fullDescription: '当需要处理新的家电产品时，请按以下步骤将其信息录入系统：\n1. 在中控平台主菜单进入“系统设置” -> “产品管理”。\n2. 点击“添加新型号”按钮。\n3. 在弹出的窗口中输入新产品的名称、型号、尺寸等基本信息。\n4. 将新产品放置在传送带的起始位置，点击“标签学习”。摄像头会自动定位并分析能效标签的特征和位置。\n5. 在“分拣规则”中，为该新型号或其能效等级指定一个分拣目标（例如，1号机械臂）。\n6. 保存设置。建议先让少量新产品通过产线进行测试，确认无误后再进行大规模生产。'
            },
            {
                id: 8,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '日志系统使用指南',
                description: '学习如何查看、筛选和导出操作日志与异常日志，用于追溯问题和分析产线效率。',
                fullDescription: '本系统提供两种核心日志，均可在“任务日志”页面访问：\n\n- **操作日志**：记录每一次成功的分拣操作，包括时间、产品型号、识别出的能效等级以及由哪台机械臂处理。可用于生产统计和追溯。\n\n- **异常日志**：记录所有失败或异常的事件，例如“无法识别标签”、“机械臂抓取失败”、“设备离线”等。这是排查故障最重要的依据。\n\n**使用技巧**：\n- 使用顶部的日期和关键词筛选器可以快速定位特定时间的日志。\n- 对于重要或频繁出现的异常，建议定期“导出日志”，以便进行离线分析。'
            },
            {
                id: 9,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '备件更换周期表',
                description: '关键备件的建议更换周期和库存管理指南，避免因备件短缺导致产线停机。',
                fullDescription: '为保证产线高可用性，建议根据以下周期准备和更换关键备件：\n\n- **机械臂手爪吸盘/夹爪垫**：\n  - 建议更换周期：每6个月或20万次抓取后。\n  - 建议库存：2套。\n\n- **传送带**：\n  - 建议更换周期：每2年或出现明显磨损、裂痕时。\n  - 建议库存：1条。\n\n- **摄像头LED光源**：\n  - 建议更换周期：约20000小时使用寿命后或亮度明显衰减时。\n  - 建议库存：1套。\n\n- **各设备保险丝**：\n  - 建议更换周期：熔断后立即更换。\n  - 建议库存：每种规格5个。'
            },
            {
                id: 10,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '网络连接故障排查',
                description: '当中控平台显示设备离线时，如何系统地检查和解决网络连接问题。',
                fullDescription: '如果“设备管理”页面显示某个设备（如机械臂、摄像头）处于离线状态，请按以下顺序排查：\n1. **物理连接检查**：检查该设备的网线是否牢固地插入设备端和网络交换机端口。\n2. **电源检查**：确认该设备的电源已开启，状态指示灯正常。\n3. **网络交换机检查**：查看交换机上对应端口的指示灯是否在闪烁，表示有数据通信。\n4. **IP地址检查**：在中控平台的设备设置中，确认该设备的IP地址未发生改变，且与中控平台处于同一网段。\n5. **重启设备**：尝试重启离线的硬件设备，等待2分钟后再查看其状态。\n6. **重启中控平台**：如果以上步骤均无效，尝试重启中控台平板。'
            },
            {
                id: 11,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '固件版本更新说明',
                description: '中控系统及各设备固件版本更新日志，了解新功能和已修复的问题。',
                fullDescription: '**中控平台 V1.2.0 (2025-07-15)**\n\n- **【新功能】** 新增对二维码式能效标签的识别支持。\n- **【优化】** 优化了机械臂运动路径算法，平均分拣周期缩短5%。\n- **【修复】** 修复了在处理高反光标签时，偶发性识别错误的问题。\n- **【修复】** 解决了当网络轻微抖动时，设备状态可能错误地显示为“离线”的问题。\n\n*更新建议：请在产线空闲时进行更新操作，更新过程大约需要5分钟。*'
            },
            {
                id: 12,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '能耗数据分析入门',
                description: '学习如何解读中控台记录的能耗数据，发现节能潜力，优化生产策略。',
                fullDescription: '本系统会记录产线的整体用电情况，数据可在“数据统计”页面查看。您可以关注以下几点：\n\n- **峰值功耗**：观察一天中哪个时间段的用电量最高，是否与生产高峰匹配。\n- **待机功耗**：在产线停止但未断电时，记录待机功耗。如果待机功耗过高，可以考虑在长时间不使用时关闭主电源。\n- **单位产品能耗**：通过（总能耗 / 总产量）计算出生产单件产品所需的电量。通过优化流程（如调整传送带速度）来观察该指标的变化，是实现节能降本的有效途径。'
            },
            // --- [新增] 以下是针对小车、机械臂、传送带的专属知识 ---
            {
                id: 13,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '【小车】电池保养与充电规范',
                description: '智能小车（AGV）的电池是其核心部件，正确的保养和充电能显著延长其寿命。',
                fullDescription: '为保障智能小车（AGV）的续航和安全，请遵循以下电池使用规范：\n\n1. **日常充电**：当小车电量低于20%时，系统会自动提示或派其返回充电桩。请确保充电桩电源稳定，接口无异物。\n2. **避免过放**：严禁将电池电量耗尽再充电，这会对锂电池造成永久性损伤。\n3. **定期深循环**：建议每三个月进行一次完整的“用尽-充满”循环（在安全电量下限之上），以校准电量计，保持电池活性。\n4. **清洁与检查**：每月清洁电池充电触点，检查有无腐蚀或松动。'
            },
            {
                id: 14,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '【小车】路径受阻与脱困方法',
                description: '当小车在运输途中被障碍物阻挡或偏离轨道时，应如何安全地进行人工干预。',
                fullDescription: '小车配备了激光雷达和碰撞传感器以实现避障，但仍可能遇到意外情况。\n\n- **情况一：临时障碍物**\n  - **现象**：小车在障碍物前停止并鸣笛告警。\n  - **处理**：移除障碍物后，小车通常会自动恢复任务。如果未自动恢复，可在中控台点击“继续任务”。\n\n- **情况二：小车脱轨或被困**\n  - **处理**：\n    1. 在中控台将该小车状态设为“维护模式”，暂停其所有任务。\n    2. 手动将小车推离受困区域，并放回主路径的任意位置。\n    3. 在中控台点击“重新定位”，小车会自动扫描环境并恢复其在地图上的位置。\n    4. 确认定位无误后，改回“自动模式”即可。'
            },
            {
                id: 15,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '【机械臂】急停（E-Stop）恢复流程',
                description: '在按下紧急停止按钮后，如何安全、正确地使机械臂从急停状态中恢复。',
                fullDescription: '紧急停止（E-Stop）会立即切断机械臂所有伺服电机的电源。恢复操作必须谨慎：\n1. **确认安全**：首先，必须确认触发急停的危险情况已经完全排除。\n2. **复位急停按钮**：将物理的急停按钮旋转或拉出，使其复位。\n3. **清除告警**：在中控台的“设备管理”页面，找到对应的机械臂，点击“清除告警”或“复位”按钮。\n4. **重新上电**：系统会提示为机械臂伺服系统重新上电，点击确认。\n5. **回原点（Homing）**：上电成功后，机械臂处于非确定位置。必须执行“回原点”操作，让机械臂的所有关节回到预设的零点位置。\n6. **恢复任务**：回原点操作完成后，机械臂状态变为“待命中”，此时才可以重新启动自动运行任务。'
            },
            {
                id: 16,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '【机械臂】末端执行器更换与TCP校准',
                description: '当需要处理不同尺寸或材质的家电时，可能需要更换手爪，并必须重新校准工具中心点(TCP)。',
                fullDescription: '工具中心点（Tool Center Point, TCP）是机械臂手爪的精确工作点。更换手爪后，此点会改变，必须校准。\n\n**更换流程**：\n1. 将机械臂移动到安全、方便操作的位置。\n2. 关闭机械臂电源和气源。\n3. 按照手册指引，拆下旧的手爪（末端执行器），安装新的手爪。\n4. 恢复电源和气源。\n\n**TCP校准（四点法）**：\n1. 在“系统设置” -> “机械臂设置”中，选择“TCP校准”。\n2. 手动控制机械臂，让新安装的手爪尖端从四个**不同**的姿态（角度）去精确触碰空间中的同一个固定点（例如一个固定的顶针）。\n3. 每触碰一次，点击一次“记录该点”。\n4. 记录四次后，点击“计算TCP”。系统会自动计算出新的工具中心点坐标并保存。'
            },
            {
                id: 17,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '【传送带】跑偏与张力调整',
                description: '传送带跑偏是常见问题，学会如何正确调整张紧装置，确保传送带居中稳定运行。',
                fullDescription: '传送带长时间运行后，可能会出现向一侧偏移（跑偏）的现象，影响产品定位。\n\n**判断与调整**：\n- **判断原则**：带子往哪边偏，就张紧哪一边的调节螺栓；或者放松另一边的调节螺栓。这个原则被称为“紧后不紧前”。\n- **调整步骤**：\n  1. 暂停产线，但保持传送带低速运行以便观察。\n  2. 找到传送带两端的张紧调节螺栓。\n  3. 每次只微调螺栓（例如旋转1/4圈），然后观察传送带在运行几圈后的变化。\n  4. 重复微调，直到传送带稳定在滚筒中心位置运行。\n\n**注意**：过度张紧会增加电机负荷和传送带磨损，调整时应以能驱动负载而不打滑的最小张力为宜。'
            },
            {
                id: 18,
                image: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                title: '【传送带】光电传感器维护',
                description: '用于检测产品位置的光电传感器是实现自动触发拍照的关键，必须保持其清洁与功能正常。',
                fullDescription: '传送带上用于定位产品的光电传感器（通常安装在侧面）需要定期维护：\n\n1. **清洁**：每班次应用干净的软布或棉签，擦拭传感器的发射端和接收端镜头，去除灰尘和油污。\n2. **对准检查**：对于对射式传感器，要确保发射器和接收器严格对准。可以观察传感器上的状态指示灯，在没有物体遮挡时，指示灯应处于稳定点亮（或熄灭）状态。\n3. **灵敏度调节**：部分传感器配有灵敏度调节旋钮。当出现误触发或不触发的情况时，可在有/无产品遮挡时，微调该旋钮，直到触发稳定可靠。非专业人员请勿随意大幅调整。'
            }
        ], this, "knowledgeItems");
        this.__selectedItem = new ObservedPropertyObjectPU(null, this, "selectedItem");
        this.dialogController = new CustomDialogController({
            builder: () => {
                let jsDialog = new KnowledgeDetailDialog(this, {
                    item: this.__selectedItem, // 使用 $ 符号传递 @Link 变量
                }, undefined, -1, () => { }, { page: "entry/src/main/ets/view/DataStatics.ets", line: 251, col: 14 });
                jsDialog.setController(this.dialogController);
                ViewPU.create(jsDialog);
                let paramsLambda = () => {
                    return {
                        item: this.__selectedItem
                    };
                };
                jsDialog.paramsGenerator_ = paramsLambda;
            },
            autoCancel: true,
            alignment: DialogAlignment.Center,
            customStyle: true
        }, this);
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DataStatics_Params) {
        if (params.knowledgeItems !== undefined) {
            this.knowledgeItems = params.knowledgeItems;
        }
        if (params.selectedItem !== undefined) {
            this.selectedItem = params.selectedItem;
        }
        if (params.dialogController !== undefined) {
            this.dialogController = params.dialogController;
        }
    }
    updateStateVars(params: DataStatics_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__knowledgeItems.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedItem.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__knowledgeItems.aboutToBeDeleted();
        this.__selectedItem.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __knowledgeItems: ObservedPropertyObjectPU<KnowledgeInfo[]>;
    get knowledgeItems() {
        return this.__knowledgeItems.get();
    }
    set knowledgeItems(newValue: KnowledgeInfo[]) {
        this.__knowledgeItems.set(newValue);
    }
    private __selectedItem: ObservedPropertyObjectPU<KnowledgeInfo | null>;
    get selectedItem() {
        return this.__selectedItem.get();
    }
    set selectedItem(newValue: KnowledgeInfo | null) {
        this.__selectedItem.set(newValue);
    }
    // [修改] 弹窗控制器初始化方式，通过 $selectedItem 传递绑定
    private dialogController: CustomDialogController;
    aboutToAppear() {
        // 配置样式以匹配深色主题
        // 1. 配置普通文本样式
        lvText.setTextColor('rgba(255, 255, 255, 0.9)'); // 设置文本为近乎白色
        lvText.setTextLineHeight('24'); // 设置合适的行高
        // 2. 配置标题样式
        lvTitle.setLevelTitleColor('#ffffff'); // 所有级别的标题都为白色
        // 3. 配置链接样式
        lvLink.setTextColor('#5cdbd3'); // 设置链接为亮眼的青色
        lvLink.setTextUnderline(true); // 为链接添加下划线，更易识别
        // 4. 配置代码块样式
        lvCode.setTheme("dark"); // 使用暗色主题，与背景协调
        lvCode.setIndexState(true); // 显示行号
        // 5. 配置引用块样式
        lvQuote.setBackgroundColor('rgba(255, 255, 255, 0.1)'); // 设置为半透明的背景
        lvQuote.setBorderColor('#69c0ff'); // 设置左边框为蓝色
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/view/DataStatics.ets(282:5)", "entry");
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.scrollable(ScrollDirection.Vertical);
            Scroll.scrollBar(BarState.On);
            Scroll.scrollBarColor('#888888');
            Scroll.scrollBarWidth(8);
            Scroll.edgeEffect(EdgeEffect.Spring);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/view/DataStatics.ets(283:7)", "entry");
            Column.padding(24);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Grid.create();
            Grid.debugLine("entry/src/main/ets/view/DataStatics.ets(284:9)", "entry");
            Grid.columnsTemplate('1fr 1fr 1fr');
            Grid.columnsGap(20);
            Grid.rowsGap(20);
            Grid.width('100%');
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                        GridItem.debugLine("entry/src/main/ets/view/DataStatics.ets(288:15)", "entry");
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new KnowledgeCard(this, {
                                        info: item,
                                        onCardClick: (clickedInfo) => {
                                            // [修改] 交互逻辑更简单，只需更新状态，弹窗会自动获取最新数据
                                            this.selectedItem = clickedInfo;
                                            this.dialogController.open();
                                        }
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DataStatics.ets", line: 289, col: 17 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            info: item,
                                            onCardClick: (clickedInfo) => {
                                                // [修改] 交互逻辑更简单，只需更新状态，弹窗会自动获取最新数据
                                                this.selectedItem = clickedInfo;
                                                this.dialogController.open();
                                            }
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                        info: item
                                    });
                                }
                            }, { name: "KnowledgeCard" });
                        }
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.knowledgeItems, forEachItemGenFunction, (item: KnowledgeInfo) => item.id.toString(), false, false);
        }, ForEach);
        ForEach.pop();
        Grid.pop();
        Column.pop();
        Scroll.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
