if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Sm2EncryptionPage_Params {
    message?: string;
    encryptedResult?: string;
    pubKeyHex?: string;
}
import cryptoFramework from "@ohos:security.cryptoFramework";
import buffer from "@ohos:buffer";
import promptAction from "@ohos:promptAction";
class Sm2EncryptionPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new ObservedPropertySimplePU('', this, "message");
        this.__encryptedResult = new ObservedPropertySimplePU('加密结果将显示在这里', this, "encryptedResult");
        this.pubKeyHex = '0467c5dd4de7e975469e8145dda8fd6c50dba0f738e0130fcc43e97ab761b838f1f87f90ababf473802e580cb5df506edf232ad09995afd174333b77e24c643b07';
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Sm2EncryptionPage_Params) {
        if (params.message !== undefined) {
            this.message = params.message;
        }
        if (params.encryptedResult !== undefined) {
            this.encryptedResult = params.encryptedResult;
        }
        if (params.pubKeyHex !== undefined) {
            this.pubKeyHex = params.pubKeyHex;
        }
    }
    updateStateVars(params: Sm2EncryptionPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__encryptedResult.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        this.__encryptedResult.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __message: ObservedPropertySimplePU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    private __encryptedResult: ObservedPropertySimplePU<string>;
    get encryptedResult() {
        return this.__encryptedResult.get();
    }
    set encryptedResult(newValue: string) {
        this.__encryptedResult.set(newValue);
    }
    // 您的十六进制公钥
    private readonly pubKeyHex: string;
    /**
     * 将十六进制字符串公钥转换为符合X.509 SubjectPublicKeyInfo DER编码的Uint8Array
     * 这是 cryptoFramework.createAsyKeyGenerator('SM2_256').convertKey 所需的格式
     */
    private constructDERSm2PublicKey(hexKey: string): Uint8Array {
        // 1. SM2算法和曲线的OID (Object Identifier)
        const oidSm2 = [0x2A, 0x81, 0x8C, 0xE7, 0x57, 0x01, 0x82, 0x2D]; // 1.2.156.10197.1.301
        const oidParameters = [0x06, 0x08, ...oidSm2]; // OID for sm2p256v1
        const algorithmIdentifier = [
            0x30,
            0x13,
            0x06,
            0x07,
            0x2A, 0x86, 0x48, 0xCE, 0x3D, 0x02, 0x01,
            ...oidParameters
        ];
        // 2. 将十六进制公钥字符串转换为字节数组
        const keyBytes = this.hexStringToUint8Array(hexKey);
        // 3. 构建BIT STRING部分
        const bitString = [
            0x03,
            keyBytes.length + 1,
            0x00,
            ...keyBytes
        ];
        // 4. 组合成 SubjectPublicKeyInfo
        const subjectPublicKeyInfo = [
            0x30,
            algorithmIdentifier.length + bitString.length,
            ...algorithmIdentifier,
            ...bitString
        ];
        return new Uint8Array(subjectPublicKeyInfo);
    }
    /**
     * 辅助函数：将十六进制字符串转换为Uint8Array
     */
    private hexStringToUint8Array(hexString: string): Uint8Array {
        if (hexString.length % 2 !== 0) {
            throw new Error("Invalid hex string");
        }
        let arr: number[] = [];
        for (let i = 0; i < hexString.length; i += 2) {
            arr.push(parseInt(hexString.substr(i, 2), 16));
        }
        return new Uint8Array(arr);
    }
    /**
     * 辅助函数：将ArrayBuffer转换为十六进制字符串
     */
    private arrayBufferToHexString(buffer: ArrayBuffer): string {
        const byteArray = new Uint8Array(buffer);
        const hexParts: string[] = [];
        for (const byte of byteArray) {
            // 将每个字节转换为两位十六进制数
            const hex = byte.toString(16).padStart(2, '0');
            hexParts.push(hex);
        }
        return hexParts.join('');
    }
    // 使用SM2公钥进行加密
    async encrypt() {
        if (this.message.trim() === '') {
            promptAction.showToast({ message: '请输入需要加密的内容' });
            return;
        }
        try {
            // 1. 构造符合规范的公钥
            const pkData: Uint8Array = this.constructDERSm2PublicKey(this.pubKeyHex);
            const pubKeyBlob: cryptoFramework.DataBlob = { data: pkData };
            // 2. 将公钥数据转换为框架可用的PubKey对象
            // 注意：这里我们只有公钥，所以私钥部分传null
            const sm2Generator = cryptoFramework.createAsyKeyGenerator('SM2_256');
            const keyPair = await sm2Generator.convertKey(pubKeyBlob, null);
            const publicKey = keyPair.pubKey;
            // 3. 准备明文
            const plainTextBlob: cryptoFramework.DataBlob = {
                data: new Uint8Array(buffer.from(this.message, 'utf-8').buffer)
            };
            // 4. 执行加密
            const cipher = cryptoFramework.createCipher('SM2_256|SM3');
            await cipher.init(cryptoFramework.CryptoMode.ENCRYPT_MODE, publicKey, null);
            const encryptDataBlob = await cipher.doFinal(plainTextBlob);
            if (encryptDataBlob && encryptDataBlob.data) {
                // 5. 显示结果
                this.encryptedResult = this.arrayBufferToHexString(encryptDataBlob.data);
                promptAction.showToast({ message: '加密成功！' });
            }
            else {
                this.encryptedResult = '加密失败：返回结果为空';
                promptAction.showToast({ message: '加密失败' });
            }
        }
        catch (error) {
            this.encryptedResult = `加密出错: ${error.message}`;
            console.error(`SM2 Encryption failed: ${JSON.stringify(error)}`);
            promptAction.showToast({ message: '加密出错' });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Test.ets(129:5)", "entry");
            Row.width('100%');
            Row.height('100%');
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Test.ets(130:7)", "entry");
            Column.width('90%');
            Column.height('100%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('SM2 加密示例');
            Text.debugLine("entry/src/main/ets/pages/Test.ets(131:9)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入要加密的字符串' });
            TextInput.debugLine("entry/src/main/ets/pages/Test.ets(136:9)", "entry");
            TextInput.onChange((value: string) => {
                this.message = value;
            });
            TextInput.height(50);
            TextInput.fontSize(16);
            TextInput.margin({ bottom: 20 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('使用SM2公钥加密');
            Button.debugLine("entry/src/main/ets/pages/Test.ets(144:9)", "entry");
            Button.onClick(() => {
                this.encrypt();
            });
            Button.width('100%');
            Button.height(45);
            Button.fontSize(18);
            Button.margin({ bottom: 30 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('加密结果 (Hex):');
            Text.debugLine("entry/src/main/ets/pages/Test.ets(153:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/Test.ets(158:9)", "entry");
            Scroll.layoutWeight(1);
            Scroll.padding(10);
            Scroll.backgroundColor(0xEEEEEE);
            Scroll.borderRadius(8);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.encryptedResult);
            Text.debugLine("entry/src/main/ets/pages/Test.ets(159:11)", "entry");
            Text.fontSize(16);
            Text.width('100%');
            Text.margin({ top: 10 });
        }, Text);
        Text.pop();
        Scroll.pop();
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Sm2EncryptionPage";
    }
}
registerNamedRoute(() => new Sm2EncryptionPage(undefined, {}), "", { bundleName: "com.my.myapplication", moduleName: "entry", pagePath: "pages/Test", pageFullPath: "entry/src/main/ets/pages/Test", integratedHsp: "false", moduleType: "followWithHap" });
