var status = require('./status');
var crypto = require('crypto');

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function dump(obj) {
    var output = "┏━━━━━━━━━━━━━━━━━━━━━━━━━━Dump Start━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    if (obj !== null && obj !== undefined) {
        for (var i in obj) {
            var prop = obj[i];
            output += "┃\t" + i + " = " + prop + "\n";
        }
    } else {
        output += "┃\t" + obj + "\n";
    }

    output += "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━Dump End━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    console.log(output);
}

module.exports.dump = dump;

module.exports.info = function (code) {
    return status.err[code] ? status.err[code] : "Unknown error. Please mail to ylc931116@gmail.com";
};

module.exports.s = function (status) {
    return {
        code : status[0],
        msg  : status[1],
    };
}

module.exports.getUpToken = function (accessKey, secretKey, putPolicy) {

    var put_policy = JSON.stringify(putPolicy);
    console.log("put_policy = ", put_policy);

    var encoded = base64encode(utf16to8(put_policy));
    console.log("encoded = ", encoded);

    var sign = crypto.createHmac('sha1', secretKey).update(encoded).digest().toString('base64');
    console.log("sign = ", sign);

    var uploadToken = accessKey + ':' + sign + ':' + encoded;
    console.log("uploadToken = ", uploadToken);
    return uploadToken;

}

function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i   = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}


//async function encrypt(data) {
//    let salt = await bcrypt.genSalt(config.SALT_WORK_FACTOR);
//    let hash = await bcrypt.hash(data, salt);
//    return hash;
//};
//function aaa() {
//    alert('aaaaa');
//}

//module.exports.encrypt = encrypt;