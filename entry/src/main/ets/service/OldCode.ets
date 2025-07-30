import hilog from '@ohos.hilog';
import { cryptoFramework } from '@kit.CryptoArchitectureKit';
import { buffer } from '@kit.ArkTS';

// 定义操作结果的数据结构
interface CryptoResult {
  type: '加密' | '解密';
  original: string;
  result: string;
}

/**
 * 辅助函数：将16进制字符串转换为 Uint8Array
 */
function hexToUint8Array(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }
  return bytes;
}

@Entry
@Component
struct Sm2EncryptDecryptTool {
  // --- UI State Variables ---
  @State plainText: string = ''; // 明文输入
  @State cipherText: string = ''; // 密文输入
  @State results: CryptoResult[] = [];
  @State isLoading: boolean = false;
  @State errorText: string = '';

  // --- Cryptography State Variables ---
  @State private keyPair: cryptoFramework.KeyPair | null = null;

  // aboutToAppear: 在组件即将显示时执行，用于初始化密钥
  async aboutToAppear() {
    this.isLoading = true;
    try {
      // 1. 您提供的预设公钥和私钥（Hex格式）
      const presetPublicKeyHex = '0467c5dd4de7e975469e8145dda8fd6c50dba0f738e0130fcc43e97ab761b838f1f87f90ababf473802e580cb5df506edf232ad09995afd174333b77e24c643b07';
      const presetPrivateKeyHex = '9033802a7e3988597e9e2c57ed320081e240db88658a6d96b783b82b1fc8a3f1';

      // 2. 【核心修正】构建符合鸿蒙API要求的DER编码密钥
      // 公钥 (SubjectPublicKeyInfo format)
      const rawPublicKeyBytes = hexToUint8Array(presetPublicKeyHex);
      const pubKeyDerHeader = new Uint8Array([
        0x30, 0x59, 0x30, 0x13, 0x06, 0x07, 0x2A, 0x86, 0x48, 0xCE, 0x3D, 0x02, 0x01, 0x06, 0x08, 0x2A,
        0x81, 0x1C, 0xCF, 0x55, 0x01, 0x82, 0x2D, 0x03, 0x42, 0x00
      ]);
      const fullPublicKeyDer = new Uint8Array(pubKeyDerHeader.length + rawPublicKeyBytes.length);
      fullPublicKeyDer.set(pubKeyDerHeader, 0);
      fullPublicKeyDer.set(rawPublicKeyBytes, pubKeyDerHeader.length);

      // 私钥 (ECPrivateKey format, 参照官方文档示例结构)
      const rawPrivateKeyBytes = hexToUint8Array(presetPrivateKeyHex);
      // 这个结构包含了版本号(1)、私钥本身(32字节)和SM2曲线的OID
      const priKeyStructure = new Uint8Array([
        0x30, 0x31, // SEQUENCE, 49 bytes long
        0x02, 0x01, 0x01, // INTEGER, 1 (version)
        0x04, 0x20, // OCTET STRING, 32 bytes (the private key)
        ...rawPrivateKeyBytes,
        0xA0, 0x0A, // CONTEXT-SPECIFIC [0], 10 bytes long
        0x06, 0x08, 0x2A, 0x81, 0x1C, 0xCF, 0x55, 0x01, 0x82, 0x2D // OID for sm2p256v1
      ]);
      const fullPrivateKeyDer = priKeyStructure;

      // 3. 将DER格式的公私钥数据转换为框架内部的KeyPair对象
      const pubKeyBlob: cryptoFramework.DataBlob = { data: fullPublicKeyDer };
      const priKeyBlob: cryptoFramework.DataBlob = { data: fullPrivateKeyDer };
      const sm2Generator = cryptoFramework.createAsyKeyGenerator('SM2_256');
      this.keyPair = await sm2Generator.convertKey(pubKeyBlob, priKeyBlob);

      hilog.info(0x0000, 'Sm2Crypto', '预设公/私钥初始化成功！');
    } catch (err) {
      this.errorText = `密钥初始化失败: ${JSON.stringify(err)}`;
      hilog.error(0x0000, 'Sm2Crypto', `Key init failed: ${JSON.stringify(err)}`);
    } finally {
      this.isLoading = false;
    }
  }

  // 加密函数
  async encrypt() {
    if (!this.keyPair?.pubKey) {
      this.errorText = '公钥不可用，无法加密。';
      return;
    }
    if (this.plainText.trim() === '' || this.isLoading) return;

    this.isLoading = true;
    this.errorText = '';
    const originalText = this.plainText;

    try {
      const plainTextBlob: cryptoFramework.DataBlob = { data: new Uint8Array(buffer.from(originalText, 'utf-8').buffer) };
      const cipher = cryptoFramework.createCipher('SM2_256|SM3');
      await cipher.init(cryptoFramework.CryptoMode.ENCRYPT_MODE, this.keyPair.pubKey, null);
      const encryptedBlob = await cipher.doFinal(plainTextBlob);

      if (encryptedBlob?.data) {
        const encryptedBase64 = buffer.from(encryptedBlob.data).toString('base64');
        this.results.unshift({ type: '加密', original: originalText, result: encryptedBase64 });
        this.cipherText = encryptedBase64; // 自动填充到解密框
        this.plainText = '';
      } else {
        throw new Error('加密结果为空。');
      }
    } catch (err) {
      this.errorText = `加密失败: ${JSON.stringify(err)}`;
    } finally {
      this.isLoading = false;
    }
  }

  // 解密函数
  async decrypt() {
    if (!this.keyPair?.priKey) {
      this.errorText = '私钥不可用，无法解密。';
      return;
    }
    if (this.cipherText.trim() === '' || this.isLoading) return;

    this.isLoading = true;
    this.errorText = '';
    const originalCipherText = this.cipherText;

    try {
      const cipherTextBlob: cryptoFramework.DataBlob = { data: new Uint8Array(buffer.from(originalCipherText, 'base64').buffer) };
      const decoder = cryptoFramework.createCipher('SM2_256|SM3');
      await decoder.init(cryptoFramework.CryptoMode.DECRYPT_MODE, this.keyPair.priKey, null);
      const decryptedBlob = await decoder.doFinal(cipherTextBlob);

      if (decryptedBlob?.data) {
        const decryptedText = buffer.from(decryptedBlob.data).toString('utf-8');
        this.results.unshift({ type: '解密', original: originalCipherText, result: decryptedText });
      } else {
        throw new Error('解密结果为空。');
      }
    } catch (err) {
      this.errorText = `解密失败: 密文格式无效或密钥不匹配。`;
      hilog.error(0x0000, 'Sm2Crypto', `Decrypt failed: ${JSON.stringify(err)}`);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column({ space: 10 }) {
      Text('SM2 加解密工具')
        .fontSize(24).fontWeight(FontWeight.Bold).margin({ top: 20, bottom: 10 })

      // --- 加密区域 ---
      TextInput({ placeholder: '在此输入要加密的明文', text: this.plainText })
        .onChange((value: string) => this.plainText = value)
        .width('90%').fontSize(16)
      Button('加密')
        .onClick(() => this.encrypt())
        .enabled(!this.isLoading && this.keyPair !== null)
        .backgroundColor(this.isLoading || this.keyPair === null ? Color.Gray : '#007DFF')
        .width('90%')

      Divider().strokeWidth(1).color(Color.Gray).margin(10)

      // --- 解密区域 ---
      TextInput({ placeholder: '在此输入要解密的Base64密文', text: this.cipherText })
        .onChange((value: string) => this.cipherText = value)
        .width('90%').fontSize(16).type(InputType.Normal).height(80)
      Button('解密')
        .onClick(() => this.decrypt())
        .enabled(!this.isLoading && this.keyPair !== null)
        .backgroundColor(this.isLoading || this.keyPair === null ? Color.Gray : '#007DFF')
        .width('90%')

      if (this.errorText) {
        Text(this.errorText).fontColor(Color.Red).fontSize(14).width('90%').margin({ top: 5 })
      }

      // --- 结果列表 ---
      List({ space: 10 }) {
        ForEach(this.results, (item: CryptoResult) => {
          ListItem() {
            Column({ space: 8 }) {
              Text(`操作类型: ${item.type}`).fontSize(14).fontColor(Color.Black).width('100%').textAlign(TextAlign.Start)
              Text(`原文: ${item.original}`).fontSize(14).fontColor(Color.Gray).width('100%').textAlign(TextAlign.Start).copyOption(CopyOptions.InApp)
              Text(`结果: ${item.result}`).fontSize(16).width('100%').textAlign(TextAlign.Start).copyOption(CopyOptions.InApp)
            }
            .padding(10).borderRadius(8).backgroundColor(0xF1F3F5).alignItems(HorizontalAlign.Start)
          }
        }, (item: CryptoResult, index: number) => JSON.stringify(item) + index)
      }
      .width('90%').layoutWeight(1).margin({ top: 10 })
    }
    .padding({ left: 16, right: 16, bottom: 16 }).width('100%').height('100%')
  }
}
