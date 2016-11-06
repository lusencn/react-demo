export const keys = {
    KEY_0: 0x30,
    KEY_1: 0x31,
    KEY_2: 0x32,
    KEY_3: 0x33,
    KEY_4: 0x34,
    KEY_5: 0x35,
    KEY_6: 0x36,
    KEY_7: 0x37,
    KEY_8: 0x38,
    KEY_9: 0x39,
    KEY_NUMPAD_0: 0x60,
    KEY_NUMPAD_1: 0x61,
    KEY_NUMPAD_2: 0x62,
    KEY_NUMPAD_3: 0x63,
    KEY_NUMPAD_4: 0x64,
    KEY_NUMPAD_5: 0x65,
    KEY_NUMPAD_6: 0x66,
    KEY_NUMPAD_7: 0x67,
    KEY_NUMPAD_8: 0x68,
    KEY_NUMPAD_9: 0x69,

    KEY_PLUS: 0xbb,
    KEY_MINUS: 0xbd,
    KEY_PERIOD: 0xbe,
    
    KEY_ARROW_LEFT: 0x25,
    KEY_ARROW_RIGHT: 0x27,
    KEY_ARROW_UP: 0x26,
    KEY_ARROW_DOWN: 0x28,

    KEY_BACKSPACE: 0x08
};

export let isNumberKey = (keyCode) => {
    return keyCode >= keys.KEY_0 && keyCode <= keys.KEY_9 || keyCode >= keys.KEY_NUMPAD_0 && keyCode <= keys.KEY_NUMPAD_9;
};

export let isPercentKey = (event, keyCode) => {
    return event.shiftKey && keyCode === keys.KEY_5;
};

export let containsKey = (keyCode) => {
    for (let key in keys) {
        if (keys.hasOwnProperty(key) && keys[key] === keyCode) {
            return true;
        }
    }
    return false;
};