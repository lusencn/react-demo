
import trim from './trim.js';

export default function toSnakeCase(text = '') {
    return trim(text).replace(/([a-z][A-Z])/g, (m) => `${m[0]}_${m[1].toLowerCase()}`);
};
