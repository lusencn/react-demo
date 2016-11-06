export default function ellipsis(string = '', len = 10) {
    if (string.length > len) {
        return `${string.substr(0, len)}...`;
    }
    return string;
}
