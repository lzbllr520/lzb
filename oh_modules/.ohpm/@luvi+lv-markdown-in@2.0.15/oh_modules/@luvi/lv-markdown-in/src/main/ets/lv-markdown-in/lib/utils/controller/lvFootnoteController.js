var i = (this && this.i) || function (a2, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.j === "function")
        r = Reflect.j(a2, target, key, desc);
    else
        for (var b2 = a2.length - 1; b2 >= 0; b2--)
            if (d = a2[b2])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let LvFootnoteController = class LvFootnoteController {
    constructor() {
        this.footnoteList = "";
    }
    setFootnoteList(item) {
        this.footnoteList = (item);
    }
    getFootnoteList() {
        return this.footnoteList;
    }
};
LvFootnoteController = i([
    Observed
], LvFootnoteController);
export { LvFootnoteController };
export const lvFootnoteController = new LvFootnoteController();
