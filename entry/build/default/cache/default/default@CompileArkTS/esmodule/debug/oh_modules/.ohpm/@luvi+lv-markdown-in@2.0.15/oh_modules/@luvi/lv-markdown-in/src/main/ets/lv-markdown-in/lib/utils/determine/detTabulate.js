function e2(str) {
    const l2 = /^\d+$/;
    return l2.test(str);
}
export function determineTabulate(text, f2, g2) {
    let check = text.trim().split(".");
    let h2 = f2?.trim().split(".");
    let i2 = g2?.trim().split(".");
    if ((check.length > 1 && e2(check[0]) && h2.length > 1 && e2(h2[0])) ||
        (check.length > 1 && e2(check[0]) && i2.length > 1 && e2(i2[0]))) {
        return true;
    }
    const j2 = text.trim().slice(0, 1);
    const k2 = text.trim().slice(1, 2);
    return ((j2 === '*' && k2 !== '*') || j2 === '-' || j2 === '+') ? true : false;
}
