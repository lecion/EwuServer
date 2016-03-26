var config = {
    port             : 3000,
    db               : 'mongodb://localhost/ewu',
    secret           : 'lecion',
    token_expire     : 3600 * 24 * 30,
    SALT_WORK_FACTOR : 10,

    s : {
        //Auth
        INVALID_TOKEN   : [101, 'token无效'],
        TOKEN_NOT_FOUND : [102, '请提供token'],

        //注册
        INVALIDE_NAME     : [201, '用户名不合法'],
        INVALIDE_PASSWORD : [202, '密码不合法'],
        USER_EXIST        : [203, '用户已存在'],

        //登陆
        USER_NOT_EXIST : [301, '该用户不存在,请先注册'],
        WRONG_PASSWORD : [302, '密码错误'],
        //User
        USER_NOT_FOUND : [401, '未找到该用户'],

        //Goods
        GOODS_NAME_REQUIRED   : [501, '商品名称不能为空'],
        GOODS_DETAIL_REQUIRED : [502, '商品描述不能为空'],
        GOODS_PRICE_REQUIRED  : [503, '商品描述不能为空'],
        GOODS_TYPE_REQUIRED   : [504, '请输入商品类别']

    }
}

module.exports = config;