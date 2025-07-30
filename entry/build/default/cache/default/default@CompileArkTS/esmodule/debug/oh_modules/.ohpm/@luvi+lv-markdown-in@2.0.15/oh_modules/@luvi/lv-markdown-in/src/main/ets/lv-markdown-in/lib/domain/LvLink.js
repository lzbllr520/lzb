var i = (this && this.i) || function (a1, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.j === "function")
        r = Reflect.j(a1, target, key, desc);
    else
        for (var b1 = a1.length - 1; b1 >= 0; b1--)
            if (d = a1[b1])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let LvLink = class LvLink {
    constructor() {
        this.textSize = 15;
        this.textColor = "#3A8AEB";
        this.textUnderline = false;
        this.linkUrl = "";
    }
    setTextSize(value) {
        this.textSize = value;
    }
    setTextColor(value) {
        this.textColor = value;
    }
    setTextUnderline(value) {
        this.textUnderline = value;
    }
    setLinkUrl(value) {
        this.linkUrl = value;
    }
    getTextSize() {
        return this.textSize;
    }
    getTextColor() {
        return this.textColor;
    }
    getTextUnderline() {
        return this.textUnderline;
    }
    getLinkUrl() {
        return this.linkUrl;
    }
};
LvLink = i([
    Observed
], LvLink);
const lvLink = new LvLink();
export { lvLink, LvLink };
