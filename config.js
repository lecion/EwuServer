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
        GOODS_NAME_REQUIRED     : [501, '商品名称不能为空'],
        GOODS_DETAIL_REQUIRED   : [502, '商品描述不能为空'],
        GOODS_PRICE_REQUIRED    : [503, '商品描述不能为空'],
        GOODS_CATEGORY_REQUIRED : [504, '请输入商品类别'],
        GOODS_NOT_EXIST         : [505, '商品不存在'],
        GOODS_INVALID_ID        : [506, '不是正确的商品ID'],
        GOODS_SALED             : [507, '商品已经售出'],

        //商品收藏
        GC_ID_REQUIRED    : [601, '商品id不能为空'],
        GOODS_NOT_COLLECT : [602, '商品还没有被收藏'],

        //评论
        REPLY_INVALID_ID       : [701, '不是正确的评论ID'],
        REPLY_CONTENT_REQUIRED : [702, '评论内容不能为空'],
    },


    list_goods_count : 5,
}

module.exports = config;