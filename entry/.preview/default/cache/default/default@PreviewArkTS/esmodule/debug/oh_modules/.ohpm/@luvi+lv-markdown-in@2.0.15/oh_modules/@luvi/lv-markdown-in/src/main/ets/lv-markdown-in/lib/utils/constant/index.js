var LV_MD_CONTENT_TYPE;
(function (z1) {
    z1["TITLE"] = "title";
    z1["TEXT"] = "text";
    z1["QUOTE"] = "quote";
    z1["URL"] = "url";
    z1["IMG"] = "img";
    z1["LINE"] = "line";
    z1["CODE"] = "code";
    z1["TABLE"] = "table";
    z1["TABULATE"] = "tabulate";
    z1["CHECKBOX"] = "checkbox";
    z1["HTMLIMG"] = "htmlImg";
    z1["HTMLFONT"] = "htmlFont";
    z1["FOOTNOTE"] = "footNote";
})(LV_MD_CONTENT_TYPE || (LV_MD_CONTENT_TYPE = {}));
var LV_MD_DATA_TYPE;
(function (w1) {
    w1[w1["FLAG"] = 0] = "FLAG";
    w1[w1["MSG"] = 1] = "MSG";
})(LV_MD_DATA_TYPE || (LV_MD_DATA_TYPE = {}));
var LV_TEXT_TYPE;
(function (v1) {
    v1["L_BOLD"] = "lvTextBold";
    v1["L_ITALIC"] = "lvTextItalic";
    v1["L_MARK"] = "lvTextMark";
    v1["L_DEL"] = "lvTextDel";
    v1["L_PINK"] = "lvTextPink";
})(LV_TEXT_TYPE || (LV_TEXT_TYPE = {}));
const SP_TYPE = {
    SPK: "=~=SPK65LUVIMDIN=~=",
    SPL: "SPL65"
};
export { LV_MD_CONTENT_TYPE, LV_MD_DATA_TYPE, LV_TEXT_TYPE, SP_TYPE };
