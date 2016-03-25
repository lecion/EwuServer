var status = require('./status');

function dump(obj) {
    var output = "┏━━━━━━━━━━━━━━━━━━━━━━━━━━Dump Start━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    if (obj !== null && obj !== undefined) {
        for (var i in obj) {
            var prop = obj[i];
            output += "┃\t" +i +" = "+prop+"\n";
        }
    } else {
        output += "┃\t" + obj + "\n";
    }

    output += "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━Dump End━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    console.log(output);
}

module.exports.dump = dump;

module.exports.info = function(code) {
    return status.err[code] ? status.err[code] : "Unknown error. Please mail to ylc931116@gmail.com";
};

module.exports.s = function (status) {
    return {
        code: status[0],
        msg: status[1],
    };
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