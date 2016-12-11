
import trim from './trim.js';

export default function toCamelCase(text = '') {
    return trim(text).replace(/_([a-z])/g, (m) => m[1].toUpperCase());
};
