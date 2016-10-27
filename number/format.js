export default function format(number = 0, decimals = 0, dec_point = '.', thousands_sep = ',') {
    // Set the default values here, instead so we can use them in the replace below.
    thousands_sep = (typeof thousands_sep === 'undefined') ? /*( new Number(1000).toLocaleString() !== '1000' ? new Number(1000).toLocaleString().charAt(1) : '' )*/ ',' : thousands_sep;
    dec_point = (typeof dec_point === 'undefined') ? /*new Number(0.1).toLocaleString().charAt(1)*/ '.' : dec_point;
    decimals = !isFinite(+decimals) ? 0 : Math.abs(decimals);

    // Work out the unicode representation for the decimal place and thousand sep.
    let u_dec = ('\\u' + ('0000' + (dec_point.charCodeAt(0).toString(16))).slice(-4));
    let u_sep = ('\\u' + ('0000' + (thousands_sep.charCodeAt(0).toString(16))).slice(-4));

    // Fix the number, so that it's an actual number.
    number = (number + '')
        .replace('\.', dec_point) // because the number if passed in as a float (having . as decimal point per definition) we need to replace this with the passed in decimal point character
        .replace(new RegExp(u_sep, 'g'), '')
        .replace(new RegExp(u_dec, 'g'), '.')
        .replace(new RegExp('[^0-9+\-Ee.]', 'g'), '');

    let n = !isFinite(+number) ? 0 : +number,
        s = '',
        toFixedFix = function(n, decimals) {
            return '' + (+(Math.round(('' + n).indexOf('e') > 0 ? n : n + 'e+' + decimals) + 'e-' + decimals));
        };

    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (decimals ? toFixedFix(n, decimals) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousands_sep);
    }
    if ((s[1] || '').length < decimals) {
        s[1] = s[1] || '';
        s[1] += new Array(decimals - s[1].length + 1).join('0');
    }
    return s.join(dec_point);
}
