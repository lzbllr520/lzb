import { SP_TYPE } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/constant/index&2.0.15';
import { lvFootnoteController } from '@normalized:N&&&@luvi/lv-markdown-in/src/main/ets/lv-markdown-in/lib/utils/controller/lvFootnoteController&2.0.15';
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
