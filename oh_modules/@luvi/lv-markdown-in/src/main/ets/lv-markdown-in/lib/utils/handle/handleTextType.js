import { SP_TYPE } from '../constant';
import { lvFootnoteController } from '../controller/lvFootnoteController';
export default function handleTextType(text) {
    const n2 = /(\*\*\*[^(\*\*\*)]+\*\*\*|\_\_\_[^(\_\_\_)]+\_\_\_|\*\*[^(\*\*)]+\*\*|\_\_[^(\_\_)]+\_\_|\*[^(\*)]+\*|\_[^(\_)]+\_|\=\=[^(\=\=)]+\=\=|\~\~[^(\~\~)]+\~\~|\`[^(\`)]+\`|\[[^\]]+\]\([^\)]+\))/g;
    const match = text.split(n2);
    match.forEach((item) => {
        let flag = item.trim().slice(0, 2) == '[^' && item.trim().indexOf('](') !== -1 &&
            item.trim().indexOf(')') !== -1;
        if (flag && lvFootnoteController) {
            lvFootnoteController.footnoteList += item + SP_TYPE.SPK;
        }
    });
    return match;
}
