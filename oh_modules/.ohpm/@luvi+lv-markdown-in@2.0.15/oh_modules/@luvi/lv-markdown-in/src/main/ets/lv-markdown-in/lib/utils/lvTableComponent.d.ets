@Component
export declare struct lvTableComponent {
    @State
    text: string;
    @State
    dialogController: CustomDialogController | null;
    @State
    cellWidthArrayIndexed: number[];
    build(): void;
    @Builder
    lvTableHeadBuilder(text: string, b4: CustomDialogController | null): void;
    @Builder
    lvTableRowBuilder(text: string, z3: number, a4: CustomDialogController | null): void;
}
