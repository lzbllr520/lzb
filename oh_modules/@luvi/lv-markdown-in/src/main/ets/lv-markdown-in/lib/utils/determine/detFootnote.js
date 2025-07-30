export function determineFootnote(text, c2) {
    let check = text.trim().indexOf('[') !== -1 && text.trim().indexOf('](') !== -1 && text.trim().indexOf(')') !== -1 &&
        text.trim().substring(text.trim().indexOf('[') + 1, text.trim().indexOf('[') + 2) == "^";
    if (check) {
        let d2 = text.split(/(\[\^[^\]]+\]\([^\)]+\))/g);
        d2.forEach((item) => {
            let flag = item.trim().slice(0, 2) == '[^' && item.trim().indexOf('](') !== -1 &&
                item.trim().indexOf(')') !== -1;
            if (flag) {
            }
        });
    }
    return check;
}
