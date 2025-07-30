import e4 from '@ohos.web.webview';
import { LvLink } from '../domain/LvLink';
@CustomDialog
export declare struct WebControl {
    controller: CustomDialogController;
    webController: e4.WebviewController;
    @State
    mode: MixedMode;
    @State
    loading: boolean;
    @State
    nLink: LvLink;
    build(): void;
}
