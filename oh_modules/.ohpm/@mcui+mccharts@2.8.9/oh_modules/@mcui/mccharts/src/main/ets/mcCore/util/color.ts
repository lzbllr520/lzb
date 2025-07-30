import { legend } from '../../utils/defaultOption';

const ColorKeywords = {
    'transparent': "rgba(0,0,0,0)",
    'black': "#000000",
    'silver': "#C0C0C0",
    'gray': "#808080",
    'white': "#FFFFFF",
    'maroon': "#800000",
    'red': "#FF0000",
    'purple': "#800080",
    'fuchsia': "#FF00FF",
    'green': "#008000",
    'lime': "#00FF00",
    'olive': "#808000",
    'yellow': "#FFFF00",
    'navy': "#000080",
    'blue': "#0000FF",
    'teal': "#008080",
    'aqua': "#00FFFF",
    'aliceblue': "#f0f8ff",
    'antiquewhite': "#faebd7",
    'aquamarine': "#7fffd4",
    'azure': "#f0ffff",
    'beige': "#f5f5dc",
    'bisque': "#ffe4c4",
    'blanchedalmond': "#ffebcd",
    'blueviolet': "#8a2be2",
    'brown': "#a52a2a",
    'burlywood': "#deb887",
    'cadetblue': "#5f9ea0",
    'chartreuse': "#7fff00",
    'chocolate': "#d2691e",
    'coral': "#ff7f50",
    'cornflowerblue': "#6495ed",
    'cornsilk': "#fff8dc",
    'crimson': "#dc143c",
    'cyan': "#00ffff",
    'darkblue': "#00008b",
    'darkcyan': "#008b8b",
    'darkgoldenrod': "#b8860b",
    'darkgray': "#a9a9a9",
    'darkgreen': "#006400",
    'darkgrey': "#a9a9a9",
    'darkkhaki': "#bdb76b",
    'darkmagenta': "#8b008b",
    'darkolivegreen': "#556b2f",
    'darkorange': "#ff8c00",
    'darkorchid': "#9932cc",
    'darkred': "#8b0000",
    'darksalmon': "#e9967a",
    'darkseagreen': "#8fbc8f",
    'darkslateblue': "#483d8b",
    'darkslategray': "#2f4f4f",
    'darkslategrey': "#2f4f4f",
    'darkturquoise': "#00ced1",
    'darkviolet': "#9400d3",
    'deeppink': "#ff1493",
    'deepskyblue': "#00bfff",
    'dimgray': "#696969",
    'dimgrey': "#696969",
    'dodgerblue': "#1e90ff",
    'firebrick': "#b22222",
    'floralwhite': "#fffaf0",
    'forestgreen': "#228b22",
    'gainsboro': "#dcdcdc",
    'ghostwhite': "#f8f8ff",
    'gold': "#ffd700",
    'goldenrod': "#daa520",
    'greenyellow': "#adff2f",
    'grey': "#808080",
    'honeydew': "#f0fff0",
    'hotpink': "#ff69b4",
    'indianred': "#cd5c5c",
    'indigo': "#4b0082",
    'ivory': "#fffff0",
    'khaki': "#f0e68c",
    'lavender': "#e6e6fa",
    'lavenderblush': "#fff0f5",
    'lawngreen': "#7cfc00",
    'lemonchiffon': "#fffacd",
    'lightblue': "#add8e6",
    'lightcoral': "#f08080",
    'lightcyan': "#e0ffff",
    'lightgoldenrodyellow': "#fafad2",
    'lightgray': "#d3d3d3",
    'lightgreen': "#90ee90",
    'lightgrey': "#d3d3d3",
    'lightpink': "#ffb6c1",
    'lightsalmon': "#ffa07a",
    'lightseagreen': "#20b2aa",
    'lightskyblue': "#87cefa",
    'lightslategray': "#778899",
    'lightslategrey': "#778899",
    'lightsteelblue': "#b0c4de",
    'lightyellow': "#ffffe0",
    'limegreen': "#32cd32",
    'linen': "#faf0e6",
    'magenta': "#ff00ff",
    'mediumaquamarine': "#66cdaa",
    'mediumblue': "#0000cd",
    'mediumorchid': "#ba55d3",
    'mediumpurple': "#9370db",
    'mediumseagreen': "#3cb371",
    'mediumslateblue': "#7b68ee",
    'mediumspringgreen': "#00fa9a",
    'mediumturquoise': "#48d1cc",
    'mediumvioletred': "#c71585",
    'midnightblue': "#191970",
    'mintcream': "#f5fffa",
    'mistyrose': "#ffe4e1",
    'moccasin': "#ffe4b5",
    'navajowhite': "#ffdead",
    'oldlace': "#fdf5e6",
    'olivedrab': "#6b8e23",
    'orange': "#ffa500",
    'orangered': "#ff4500",
    'orchid': "#da70d6",
    'palegoldenrod': "#eee8aa",
    'palegreen': "#98fb98",
    'paleturquoise': "#afeeee",
    'palevioletred': "#db7093",
    'papayawhip': "#ffefd5",
    'peachpuff': "#ffdab9",
    'peru': "#cd853f",
    'pink': "#ffc0cb",
    'plum': "#dda0dd",
    'powderblue': "#b0e0e6",
    'rosybrown': "#bc8f8f",
    'royalblue': "#4169e1",
    'saddlebrown': "#8b4513",
    'salmon': "#fa8072",
    'sandybrown': "#f4a460",
    'seagreen': "#2e8b57",
    'seashell': "#fff5ee",
    'sienna': "#a0522d",
    'skyblue': "#87ceeb",
    'slateblue': "#6a5acd",
    'slategray': "#708090",
    'snow': "#fffafa",
    'springgreen': "#00ff7f",
    'steelblue': "#4682b4",
    'tan': "#d2b48c",
    'thistle': "#d8bfd8",
    'tomato': "#ff6347",
    'turquoise': "#40e0d0",
    'violet': "#ee82ee",
    'wheat': "#f5deb3",
    'whitesmoke': "#f5f5f5",
    'yellowgreen': "#9acd32"
}

function isHex(r) {
  return typeof r != "string" ? !1 : (r = r.toLowerCase(), /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(r));
}
function isRgb(r) {
  return typeof r != "string" ? !1 : (r = r.toLowerCase(), /^(rgb\(|RGB\()/.test(r));
}
function isRgba(r) {
  return typeof r != "string" ? !1 : (r = r.toLowerCase(), /^(rgba|RGBA)/.test(r));
}
function isRgbOrRgba(r) {
  return /^(rgb|rgba|RGB|RGBA)/.test(r);
}
function p(r) {
  return ColorKeywords[r];
}
function g(r) {
  if (isHex(r) || isRgbOrRgba(r)) {
      return r;
  }
  const t = p(r);
  if (!t)
    throw new Error(`Color: Invalid Input of ${r}`);
  return t;
}
function m(r) {
  r = r.replace("#", ""), r.length === 3 && (r = Array.from(r).map((e) => e.toString() + e.toString()).join(""));
  const t = r.split("");
  if (t.length === 8) {
      const rgba = []
      let a = 1
      Array(4).fill(0).map((e, n) => {
          const hexValue = parseInt(`0x${t[n * 2]}${t[n * 2 + 1]}`)
          return n == 0 ? a = hexValue / 255  : rgba.push(hexValue)
      });
      rgba.push(a)
      return rgba
  }
  return new Array(3).fill(0).map((e, n) => parseInt(`0x${t[n * 2]}${t[n * 2 + 1]}`));
}
function R(r) {
  return r.replace(/rgb\(|rgba\(|\)/g, "").split(",").slice(0, 3).map((t) => parseInt(t));
}
function getRgbValue(r) {
  const e = g(r).toLowerCase();
  return isHex(e) ? m(e) : R(e);
}
function getOpacity(r) {
  const t = g(r);
  return isRgba(t) ? Number(
    t.toLowerCase().split(",").slice(-1)[0].replace(/[)|\s]/g, "")
  ) : 1;
}
function getRgbaValue(r) {
  const t = getRgbValue(r);
  return t && [...t, getOpacity(r)];
}
function toRgb(r, t) {
  const e = getRgbValue(r);
  return typeof t == "number" ? `rgba(${e.join(",")},${t})` : `rgb(${e.join(",")})`;
}
function toHex(r) {
  if (isHex(r))
    return r;
  const t = getRgbValue(r), e = (n) => Number(n).toString(16).padStart(2, "0");
  return `#${t.map(e).join("")}`;
}
function getColorParseIntValue (r) {
    if (!Array.isArray(r))
        throw new Error(`getColorFromRgbValue: ${r} is not an array`);
    let { length: t } = r;
    if (t === 5) {
        r.splice(4, 1)
        t = 4
    }
    if (t !== 3 && t !== 4)
        throw new Error("getColorFromRgbValue: value length should be 3 or 4" +  t);
    return r.map((item,index) => {
        return index == 3 ? item : parseInt(item)
    })
}
function getColorFromRgbValue(r) {
    if (!Array.isArray(r))
        throw new Error(`getColorFromRgbValue: ${r} is not an array`);
    let { length: t } = r;
    if (t === 5) {
        r.splice(4, 1)
        t = 4
    }
    if (t !== 3 && t !== 4)
        throw new Error("getColorFromRgbValue: value length should be 3 or 4");
    return (t === 3 ? "rgb(" : "rgba(") + r.join(",") + ")";
}
function darken(r, t = 0) {
  let e = getRgbaValue(r);
  return e = e.map((n, o) => o === 3 ? n : n - Math.ceil(2.55 * t)).map((n) => n < 0 ? 0 : n), getColorFromRgbValue(e);
}
function lighten(r, t = 0) {
  let e = getRgbaValue(r);
  return e = e.map((n, o) => o === 3 ? n : n + Math.ceil(2.55 * t)).map((n) => n > 255 ? 255 : n), getColorFromRgbValue(e);
}
function fade(r, t = 100) {
  const e = getRgbValue(r);
  return getColorFromRgbValue([...e, t / 100]);
}
export {
    darken,
    fade,
    getColorFromRgbValue,
    getColorParseIntValue,
    getOpacity,
    getRgbValue,
    getRgbaValue,
    isHex,
    isRgb,
    isRgbOrRgba,
    isRgba,
    lighten,
    toHex,
    toRgb
};

export default {
    darken,
    fade,
    getColorFromRgbValue,
    getColorParseIntValue,
    getOpacity,
    getRgbValue,
    getRgbaValue,
    isHex,
    isRgb,
    isRgbOrRgba,
    isRgba,
    lighten,
    toHex,
    toRgb
};