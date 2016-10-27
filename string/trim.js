export default function trim(string = '') {
    return string.replace(/^\s+|\s+$/g, '').replace(/^\t+|\t+$/g, '');
}
