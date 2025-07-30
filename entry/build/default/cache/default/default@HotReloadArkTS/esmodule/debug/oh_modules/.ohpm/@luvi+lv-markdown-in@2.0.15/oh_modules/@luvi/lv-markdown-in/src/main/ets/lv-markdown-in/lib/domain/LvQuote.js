var i = (this && this.i) || function (c1, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.j === "function")
        r = Reflect.j(c1, target, key, desc);
    else
        for (var d1 = c1.length - 1; d1 >= 0; d1--)
            if (d = c1[d1])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let LvQuote = class LvQuote {
    constructor() {
        this.backgroundColor = "#f8f8f8";
        this.borderColor = "#ff5722";
    }
    setBackgroundColor(value) {
        this.backgroundColor = value;
    }
    setBorderColor(value) {
        this.borderColor = value;
    }
    getBackgroundColor() {
        return this.backgroundColor;
    }
    getBorderColor() {
        return this.borderColor;
    }
};
LvQuote = i([
    Observed
], LvQuote);
const lvQuote = new LvQuote();
export { lvQuote, LvQuote };
