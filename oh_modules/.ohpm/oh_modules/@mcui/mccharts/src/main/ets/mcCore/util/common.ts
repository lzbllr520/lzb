function deepClone(obj, hash?) {
    if (!obj) return obj
    let clone;

    if (!hash) return JSON.parse(JSON.stringify(obj))

    // 检查obj是否为对象且不是null
    if (obj && typeof obj === 'object') {
        // 根据obj的类型决定创建的新对象类型
        clone = (obj instanceof Array) ? [] : {};
        
        // 遍历obj的所有可枚举属性
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) { // 确保只处理对象自身的属性，而非继承的属性
                // 如果是数组则直接json字符串化
                if (key === 'data') {
                    clone[key] = JSON.parse(JSON.stringify(obj[key]))
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    // 如果属性值也是一个对象，则递归调用deepClone
                    clone[key] = deepClone(obj[key], true);
                } else {
                    // 否则直接赋值
                    if (![undefined, null, ''].includes(obj[key])) {
                        clone[key] = obj[key];
                    }
                }
            }
        }
    } else {
        // 如果不是对象，则直接返回该值
        return obj;
    }

    return clone;
}


//
// function slicedToArray(arr, i) {
//     return Array.isArray(arr) ? arr : Array.from(arr, _slicedToArray);
// }
  
function toConsumableArray(arr) {
    return Array.isArray(arr) ? arr.slice() : Array.from(arr);
}

function getCircleRadianPoint(x, y, radius, radian) {
    return [x + Math.cos(radian) * radius, y + Math.sin(radian) * radius];
}

function getFormatterVal (callbackSendable, formatter, label, index?) {
    if (callbackSendable[formatter]) {
        return String(callbackSendable[formatter](label, index))
    } else if (typeof formatter === 'string') {
        return formatter.replace('{value}', label)
    } else if (typeof formatter === 'function') {
        return String(formatter(label, index))
    }
}

export {
    deepClone,
    // slicedToArray,
    toConsumableArray,
    getCircleRadianPoint,
    getFormatterVal
}

