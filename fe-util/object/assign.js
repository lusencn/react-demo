/**
 * 将source对象的属性，浅拷贝到targe
 */
export default function assign(target = {}, ...sources) {
    for (let i in sources) {
        let sourceObj = sources[i];
        for (let prop in sourceObj) {
            if (!sourceObj.hasOwnProperty(prop)) {
                continue;
            }
            target[prop] = sourceObj[prop];
        }
    }
    return target;
}
