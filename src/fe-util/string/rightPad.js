export default function rightPad(text = '', length = 0, mask = ' ') {
    const cur = text.length;
    if (length <= cur) {
        return text;
    }
    const masked = length - cur;
    let filler = mask;
    while (filler.length < masked) {
        filler += filler;
    }
    const fillerSlice = filler.slice(0, masked);
    return text + fillerSlice;
}
