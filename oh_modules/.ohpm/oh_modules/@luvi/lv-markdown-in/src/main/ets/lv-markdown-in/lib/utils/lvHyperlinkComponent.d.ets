import { LvLink } from '../domain/LvLink';
@Component
export declare struct lvHyperlinkComponent {
    @Prop
    text: string;
    @Prop
    uri: string;
    @Prop
    nLink: LvLink;
    @Prop
    fontSize: number | string;
    @Prop
    fontWeight: FontWeight;
    @Prop
    dialogController: CustomDialogController | null;
    build(): void;
}
@Builder
export default function lvHyperlinkBuilder(text: string, uri: string, w3: LvLink, fontSize: number | string, fontWeight: FontWeight, x3: CustomDialogController | null): void;
