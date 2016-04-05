/**
 * Created by Lecion on 3/23/16.
 */
var express  = require('express');
var router   = express.Router();
var auth     = require('../../middlewares/auth');
var Goods    = require('../models/Goods');
var util     = require('../../common/functions');
var Category = require('../models/Category');
var Region   = require('../models/Region')
router.get('/test', function (req, res) {
    res.send('this is test');
})


router['post']('/test/token/', function (req, res) {
    var name  = req.body.name;
    var token = jwt.sign({user : name}, config.secret, {
        expiresIn : 10,
    })
    res.json({
        success : true,
        message : 'Welcome',
        token   : token
    })
})

router.use('/test/auth', function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log('err ' + err)
                return res.json({success : false, message : 'Failed to authenticate token.'});
            } else {
                req.decoded = decoded;
                util.dump(decoded);
                next();
            }
        })
    } else {
        return res.status(403).send({
            success : false,
            message : 'Please provide token.'
        });
    }
})

router['get']('/a', auth.auth, function (req, res) {
    res.send('aaaaaaaa')
})

router.get('/goods/create', function (req, res, next) {
    Goods.create({
        name         : "商品1",
        origin_price : 12.5,
        sale_price   : 6,
        quality      : "85新",
        intro        : "大甩卖大甩卖"
    }, function (err, goods) {
        if (err) {
            return next(err);
        }
        console.log('新增商品成功');
        console.dir(goods);
        return res.send("新增商品成功:" + goods.name);
    });
})

router.get('/goods/update', function (req, res, next) {
    Goods.one({name : "商品1"}, function (err, goods) {
        if (err) return next(err)
        Goods.updateById(goods._id, {sale_price : 5, quality : "80新"}, function (err, result) {
            if (err) return next(err);
            console.dir(result);
            return res.send("更新商品成功" + result);
        })
    })
})

router.delete('/test/goods/', function (req, res, next) {
    Goods.deleteAll(function (err) {
        if (err) return next(err);
        res.api("删除成功");
    })
})


router.get('/test/category/add', function (req, res, next) {
    var parent = req.query.parent || null;
    var name   = req.query.name || '';
    if (name === '') {
        return res.api_error("名字不能为空");
    }
    if (parent) {

        Category.one({name : parent}, function (err, category) {
            if (err) return next(err);
            var parent_id = null;
            if (category) {
                parent_id = category._id;
            }
            Category.create({
                name   : name,
                parent : parent_id
            }, function (err, category) {
                if (err) return next(err);
                res.api(category);
            });
        })
    } else {
        Category.create({
            name : name,
        }, function (err, category) {
            if (err) return next(err);
            res.api(category);
        })
    }
})

router.get('/test/category', function (req, res, next) {
    Category.model.find({}, 'name parent', function (err, categories) {
        if (err) return next(err);
        res.api(categories);
    })

})

router.get('/test/category/tree', function (req, res, next) {
    Category.model.find({}, 'name parent', function (err, categories) {
        if (err) next(err);
        //var tree;
        //tree = sortOut(categories, null, 0);
        res.api(categories)
    })
})

router.get('/test/region', function (req, res, next) {
    var regions = [{
        "id"   : "1",
        "pid"  : "0",
        "type" : "0",
        "code" : "110000",
        "name" : "北京市"
    },
        {
            "id"   : "2",
            "pid"  : "1",
            "type" : "1",
            "code" : "110100",
            "name" : "市辖区"
        },
        {
            "id"   : "3",
            "pid"  : "2",
            "type" : "2",
            "code" : "110101",
            "name" : "东城区"
        },
        {
            "id"   : "4",
            "pid"  : "2",
            "type" : "2",
            "code" : "110102",
            "name" : "西城区"
        },
        {
            "id"   : "5",
            "pid"  : "2",
            "type" : "2",
            "code" : "110105",
            "name" : "朝阳区"
        },
        {
            "id"   : "6",
            "pid"  : "2",
            "type" : "2",
            "code" : "110106",
            "name" : "丰台区"
        },
        {
            "id"   : "7",
            "pid"  : "2",
            "type" : "2",
            "code" : "110107",
            "name" : "石景山区"
        },
        {
            "id"   : "8",
            "pid"  : "2",
            "type" : "2",
            "code" : "110108",
            "name" : "海淀区"
        },
        {
            "id"   : "9",
            "pid"  : "2",
            "type" : "2",
            "code" : "110109",
            "name" : "门头沟区"
        },
        {
            "id"   : "10",
            "pid"  : "2",
            "type" : "2",
            "code" : "110111",
            "name" : "房山区"
        },
        {
            "id"   : "11",
            "pid"  : "2",
            "type" : "2",
            "code" : "110112",
            "name" : "通州区"
        },
        {
            "id"   : "12",
            "pid"  : "2",
            "type" : "2",
            "code" : "110113",
            "name" : "顺义区"
        },
        {
            "id"   : "13",
            "pid"  : "2",
            "type" : "2",
            "code" : "110114",
            "name" : "昌平区"
        },
        {
            "id"   : "14",
            "pid"  : "2",
            "type" : "2",
            "code" : "110115",
            "name" : "大兴区"
        },
        {
            "id"   : "15",
            "pid"  : "2",
            "type" : "2",
            "code" : "110116",
            "name" : "怀柔区"
        },
        {
            "id"   : "16",
            "pid"  : "2",
            "type" : "2",
            "code" : "110117",
            "name" : "平谷区"
        },
        {
            "id"   : "17",
            "pid"  : "1",
            "type" : "1",
            "code" : "110200",
            "name" : "县"
        },
        {
            "id"   : "18",
            "pid"  : "17",
            "type" : "2",
            "code" : "110228",
            "name" : "密云县"
        },
        {
            "id"   : "19",
            "pid"  : "17",
            "type" : "2",
            "code" : "110229",
            "name" : "延庆县"
        },
        {
            "id"   : "20",
            "pid"  : "0",
            "type" : "0",
            "code" : "120000",
            "name" : "天津市"
        },
        {
            "id"   : "21",
            "pid"  : "20",
            "type" : "1",
            "code" : "120100",
            "name" : "市辖区"
        },
        {
            "id"   : "22",
            "pid"  : "21",
            "type" : "2",
            "code" : "120101",
            "name" : "和平区"
        },
        {
            "id"   : "23",
            "pid"  : "21",
            "type" : "2",
            "code" : "120102",
            "name" : "河东区"
        },
        {
            "id"   : "24",
            "pid"  : "21",
            "type" : "2",
            "code" : "120103",
            "name" : "河西区"
        },
        {
            "id"   : "25",
            "pid"  : "21",
            "type" : "2",
            "code" : "120104",
            "name" : "南开区"
        },
        {
            "id"   : "26",
            "pid"  : "21",
            "type" : "2",
            "code" : "120105",
            "name" : "河北区"
        },
        {
            "id"   : "27",
            "pid"  : "21",
            "type" : "2",
            "code" : "120106",
            "name" : "红桥区"
        },
        {
            "id"   : "28",
            "pid"  : "21",
            "type" : "2",
            "code" : "120110",
            "name" : "东丽区"
        },
        {
            "id"   : "29",
            "pid"  : "21",
            "type" : "2",
            "code" : "120111",
            "name" : "西青区"
        },
        {
            "id"   : "30",
            "pid"  : "21",
            "type" : "2",
            "code" : "120112",
            "name" : "津南区"
        },
        {
            "id"   : "31",
            "pid"  : "21",
            "type" : "2",
            "code" : "120113",
            "name" : "北辰区"
        },
        {
            "id"   : "32",
            "pid"  : "21",
            "type" : "2",
            "code" : "120114",
            "name" : "武清区"
        },
        {
            "id"   : "33",
            "pid"  : "21",
            "type" : "2",
            "code" : "120115",
            "name" : "宝坻区"
        },
        {
            "id"   : "34",
            "pid"  : "21",
            "type" : "2",
            "code" : "120116",
            "name" : "滨海新区"
        },
        {
            "id"   : "35",
            "pid"  : "20",
            "type" : "1",
            "code" : "120200",
            "name" : "县"
        },
        {
            "id"   : "36",
            "pid"  : "35",
            "type" : "2",
            "code" : "120221",
            "name" : "宁河县"
        },
        {
            "id"   : "37",
            "pid"  : "35",
            "type" : "2",
            "code" : "120223",
            "name" : "静海县"
        },
        {
            "id"   : "38",
            "pid"  : "35",
            "type" : "2",
            "code" : "120225",
            "name" : "蓟县"
        },
        {
            "id"   : "39",
            "pid"  : "0",
            "type" : "0",
            "code" : "130000",
            "name" : "河北省"
        },
        {
            "id"   : "40",
            "pid"  : "39",
            "type" : "1",
            "code" : "130100",
            "name" : "石家庄市"
        },
        {
            "id"   : "41",
            "pid"  : "40",
            "type" : "2",
            "code" : "130101",
            "name" : "市辖区"
        },
        {
            "id"   : "42",
            "pid"  : "40",
            "type" : "2",
            "code" : "130102",
            "name" : "长安区"
        },
        {
            "id"   : "43",
            "pid"  : "40",
            "type" : "2",
            "code" : "130104",
            "name" : "桥西区"
        },
        {
            "id"   : "44",
            "pid"  : "40",
            "type" : "2",
            "code" : "130105",
            "name" : "新华区"
        },
        {
            "id"   : "45",
            "pid"  : "40",
            "type" : "2",
            "code" : "130107",
            "name" : "井陉矿区"
        },
        {
            "id"   : "46",
            "pid"  : "40",
            "type" : "2",
            "code" : "130108",
            "name" : "裕华区"
        },
        {
            "id"   : "47",
            "pid"  : "40",
            "type" : "2",
            "code" : "130109",
            "name" : "藁城区"
        },
        {
            "id"   : "48",
            "pid"  : "40",
            "type" : "2",
            "code" : "130110",
            "name" : "鹿泉区"
        },
        {
            "id"   : "49",
            "pid"  : "40",
            "type" : "2",
            "code" : "130111",
            "name" : "栾城区"
        },
        {
            "id"   : "50",
            "pid"  : "40",
            "type" : "2",
            "code" : "130121",
            "name" : "井陉县"
        },
        {
            "id"   : "51",
            "pid"  : "40",
            "type" : "2",
            "code" : "130123",
            "name" : "正定县"
        },
        {
            "id"   : "52",
            "pid"  : "40",
            "type" : "2",
            "code" : "130125",
            "name" : "行唐县"
        },
        {
            "id"   : "53",
            "pid"  : "40",
            "type" : "2",
            "code" : "130126",
            "name" : "灵寿县"
        },
        {
            "id"   : "54",
            "pid"  : "40",
            "type" : "2",
            "code" : "130127",
            "name" : "高邑县"
        },
        {
            "id"   : "55",
            "pid"  : "40",
            "type" : "2",
            "code" : "130128",
            "name" : "深泽县"
        },
        {
            "id"   : "56",
            "pid"  : "40",
            "type" : "2",
            "code" : "130129",
            "name" : "赞皇县"
        },
        {
            "id"   : "57",
            "pid"  : "40",
            "type" : "2",
            "code" : "130130",
            "name" : "无极县"
        },
        {
            "id"   : "58",
            "pid"  : "40",
            "type" : "2",
            "code" : "130131",
            "name" : "平山县"
        },
        {
            "id"   : "59",
            "pid"  : "40",
            "type" : "2",
            "code" : "130132",
            "name" : "元氏县"
        },
        {
            "id"   : "60",
            "pid"  : "40",
            "type" : "2",
            "code" : "130133",
            "name" : "赵县"
        },
        {
            "id"   : "61",
            "pid"  : "40",
            "type" : "2",
            "code" : "130181",
            "name" : "辛集市"
        },
        {
            "id"   : "62",
            "pid"  : "40",
            "type" : "2",
            "code" : "130183",
            "name" : "晋州市"
        },
        {
            "id"   : "63",
            "pid"  : "40",
            "type" : "2",
            "code" : "130184",
            "name" : "新乐市"
        },
        {
            "id"   : "64",
            "pid"  : "39",
            "type" : "1",
            "code" : "130200",
            "name" : "唐山市"
        },
        {
            "id"   : "65",
            "pid"  : "64",
            "type" : "2",
            "code" : "130201",
            "name" : "市辖区"
        },
        {
            "id"   : "66",
            "pid"  : "64",
            "type" : "2",
            "code" : "130202",
            "name" : "路南区"
        },
        {
            "id"   : "67",
            "pid"  : "64",
            "type" : "2",
            "code" : "130203",
            "name" : "路北区"
        },
        {
            "id"   : "68",
            "pid"  : "64",
            "type" : "2",
            "code" : "130204",
            "name" : "古冶区"
        },
        {
            "id"   : "69",
            "pid"  : "64",
            "type" : "2",
            "code" : "130205",
            "name" : "开平区"
        },
        {
            "id"   : "70",
            "pid"  : "64",
            "type" : "2",
            "code" : "130207",
            "name" : "丰南区"
        },
        {
            "id"   : "71",
            "pid"  : "64",
            "type" : "2",
            "code" : "130208",
            "name" : "丰润区"
        },
        {
            "id"   : "72",
            "pid"  : "64",
            "type" : "2",
            "code" : "130209",
            "name" : "曹妃甸区"
        },
        {
            "id"   : "73",
            "pid"  : "64",
            "type" : "2",
            "code" : "130223",
            "name" : "滦县"
        },
        {
            "id"   : "74",
            "pid"  : "64",
            "type" : "2",
            "code" : "130224",
            "name" : "滦南县"
        },
        {
            "id"   : "75",
            "pid"  : "64",
            "type" : "2",
            "code" : "130225",
            "name" : "乐亭县"
        },
        {
            "id"   : "76",
            "pid"  : "64",
            "type" : "2",
            "code" : "130227",
            "name" : "迁西县"
        },
        {
            "id"   : "77",
            "pid"  : "64",
            "type" : "2",
            "code" : "130229",
            "name" : "玉田县"
        },
        {
            "id"   : "78",
            "pid"  : "64",
            "type" : "2",
            "code" : "130281",
            "name" : "遵化市"
        },
        {
            "id"   : "79",
            "pid"  : "64",
            "type" : "2",
            "code" : "130283",
            "name" : "迁安市"
        },
        {
            "id"   : "80",
            "pid"  : "39",
            "type" : "1",
            "code" : "130300",
            "name" : "秦皇岛市"
        },
        {
            "id"   : "81",
            "pid"  : "80",
            "type" : "2",
            "code" : "130301",
            "name" : "市辖区"
        },
        {
            "id"   : "82",
            "pid"  : "80",
            "type" : "2",
            "code" : "130302",
            "name" : "海港区"
        },
        {
            "id"   : "83",
            "pid"  : "80",
            "type" : "2",
            "code" : "130303",
            "name" : "山海关区"
        },
        {
            "id"   : "84",
            "pid"  : "80",
            "type" : "2",
            "code" : "130304",
            "name" : "北戴河区"
        },
        {
            "id"   : "85",
            "pid"  : "80",
            "type" : "2",
            "code" : "130321",
            "name" : "青龙满族自治县"
        },
        {
            "id"   : "86",
            "pid"  : "80",
            "type" : "2",
            "code" : "130322",
            "name" : "昌黎县"
        },
        {
            "id"   : "87",
            "pid"  : "80",
            "type" : "2",
            "code" : "130323",
            "name" : "抚宁县"
        },
        {
            "id"   : "88",
            "pid"  : "80",
            "type" : "2",
            "code" : "130324",
            "name" : "卢龙县"
        },
        {
            "id"   : "89",
            "pid"  : "39",
            "type" : "1",
            "code" : "130400",
            "name" : "邯郸市"
        },
        {
            "id"   : "90",
            "pid"  : "89",
            "type" : "2",
            "code" : "130401",
            "name" : "市辖区"
        },
        {
            "id"   : "91",
            "pid"  : "89",
            "type" : "2",
            "code" : "130402",
            "name" : "邯山区"
        },
        {
            "id"   : "92",
            "pid"  : "89",
            "type" : "2",
            "code" : "130403",
            "name" : "丛台区"
        },
        {
            "id"   : "93",
            "pid"  : "89",
            "type" : "2",
            "code" : "130404",
            "name" : "复兴区"
        },
        {
            "id"   : "94",
            "pid"  : "89",
            "type" : "2",
            "code" : "130406",
            "name" : "峰峰矿区"
        },
        {
            "id"   : "95",
            "pid"  : "89",
            "type" : "2",
            "code" : "130421",
            "name" : "邯郸县"
        },
        {
            "id"   : "96",
            "pid"  : "89",
            "type" : "2",
            "code" : "130423",
            "name" : "临漳县"
        },
        {
            "id"   : "97",
            "pid"  : "89",
            "type" : "2",
            "code" : "130424",
            "name" : "成安县"
        },
        {
            "id"   : "98",
            "pid"  : "89",
            "type" : "2",
            "code" : "130425",
            "name" : "大名县"
        },
        {
            "id"   : "99",
            "pid"  : "89",
            "type" : "2",
            "code" : "130426",
            "name" : "涉县"
        },
        {
            "id"   : "100",
            "pid"  : "89",
            "type" : "2",
            "code" : "130427",
            "name" : "磁县"
        },
        {
            "id"   : "101",
            "pid"  : "89",
            "type" : "2",
            "code" : "130428",
            "name" : "肥乡县"
        },
        {
            "id"   : "102",
            "pid"  : "89",
            "type" : "2",
            "code" : "130429",
            "name" : "永年县"
        },
        {
            "id"   : "103",
            "pid"  : "89",
            "type" : "2",
            "code" : "130430",
            "name" : "邱县"
        },
        {
            "id"   : "104",
            "pid"  : "89",
            "type" : "2",
            "code" : "130431",
            "name" : "鸡泽县"
        },
        {
            "id"   : "105",
            "pid"  : "89",
            "type" : "2",
            "code" : "130432",
            "name" : "广平县"
        },
        {
            "id"   : "106",
            "pid"  : "89",
            "type" : "2",
            "code" : "130433",
            "name" : "馆陶县"
        },
        {
            "id"   : "107",
            "pid"  : "89",
            "type" : "2",
            "code" : "130434",
            "name" : "魏县"
        },
        {
            "id"   : "108",
            "pid"  : "89",
            "type" : "2",
            "code" : "130435",
            "name" : "曲周县"
        },
        {
            "id"   : "109",
            "pid"  : "89",
            "type" : "2",
            "code" : "130481",
            "name" : "武安市"
        },
        {
            "id"   : "110",
            "pid"  : "39",
            "type" : "1",
            "code" : "130500",
            "name" : "邢台市"
        },
        {
            "id"   : "111",
            "pid"  : "110",
            "type" : "2",
            "code" : "130501",
            "name" : "市辖区"
        },
        {
            "id"   : "112",
            "pid"  : "110",
            "type" : "2",
            "code" : "130502",
            "name" : "桥东区"
        },
        {
            "id"   : "113",
            "pid"  : "110",
            "type" : "2",
            "code" : "130503",
            "name" : "桥西区"
        },
        {
            "id"   : "114",
            "pid"  : "110",
            "type" : "2",
            "code" : "130521",
            "name" : "邢台县"
        },
        {
            "id"   : "115",
            "pid"  : "110",
            "type" : "2",
            "code" : "130522",
            "name" : "临城县"
        },
        {
            "id"   : "116",
            "pid"  : "110",
            "type" : "2",
            "code" : "130523",
            "name" : "内丘县"
        },
        {
            "id"   : "117",
            "pid"  : "110",
            "type" : "2",
            "code" : "130524",
            "name" : "柏乡县"
        },
        {
            "id"   : "118",
            "pid"  : "110",
            "type" : "2",
            "code" : "130525",
            "name" : "隆尧县"
        },
        {
            "id"   : "119",
            "pid"  : "110",
            "type" : "2",
            "code" : "130526",
            "name" : "任县"
        },
        {
            "id"   : "120",
            "pid"  : "110",
            "type" : "2",
            "code" : "130527",
            "name" : "南和县"
        },
        {
            "id"   : "121",
            "pid"  : "110",
            "type" : "2",
            "code" : "130528",
            "name" : "宁晋县"
        },
        {
            "id"   : "122",
            "pid"  : "110",
            "type" : "2",
            "code" : "130529",
            "name" : "巨鹿县"
        },
        {
            "id"   : "123",
            "pid"  : "110",
            "type" : "2",
            "code" : "130530",
            "name" : "新河县"
        },
        {
            "id"   : "124",
            "pid"  : "110",
            "type" : "2",
            "code" : "130531",
            "name" : "广宗县"
        },
        {
            "id"   : "125",
            "pid"  : "110",
            "type" : "2",
            "code" : "130532",
            "name" : "平乡县"
        },
        {
            "id"   : "126",
            "pid"  : "110",
            "type" : "2",
            "code" : "130533",
            "name" : "威县"
        },
        {
            "id"   : "127",
            "pid"  : "110",
            "type" : "2",
            "code" : "130534",
            "name" : "清河县"
        },
        {
            "id"   : "128",
            "pid"  : "110",
            "type" : "2",
            "code" : "130535",
            "name" : "临西县"
        },
        {
            "id"   : "129",
            "pid"  : "110",
            "type" : "2",
            "code" : "130581",
            "name" : "南宫市"
        },
        {
            "id"   : "130",
            "pid"  : "110",
            "type" : "2",
            "code" : "130582",
            "name" : "沙河市"
        },
        {
            "id"   : "131",
            "pid"  : "39",
            "type" : "1",
            "code" : "130600",
            "name" : "保定市"
        },
        {
            "id"   : "132",
            "pid"  : "131",
            "type" : "2",
            "code" : "130601",
            "name" : "市辖区"
        },
        {
            "id"   : "133",
            "pid"  : "131",
            "type" : "2",
            "code" : "130602",
            "name" : "新市区"
        },
        {
            "id"   : "134",
            "pid"  : "131",
            "type" : "2",
            "code" : "130603",
            "name" : "北市区"
        },
        {
            "id"   : "135",
            "pid"  : "131",
            "type" : "2",
            "code" : "130604",
            "name" : "南市区"
        },
        {
            "id"   : "136",
            "pid"  : "131",
            "type" : "2",
            "code" : "130621",
            "name" : "满城县"
        },
        {
            "id"   : "137",
            "pid"  : "131",
            "type" : "2",
            "code" : "130622",
            "name" : "清苑县"
        },
        {
            "id"   : "138",
            "pid"  : "131",
            "type" : "2",
            "code" : "130623",
            "name" : "涞水县"
        },
        {
            "id"   : "139",
            "pid"  : "131",
            "type" : "2",
            "code" : "130624",
            "name" : "阜平县"
        },
        {
            "id"   : "140",
            "pid"  : "131",
            "type" : "2",
            "code" : "130625",
            "name" : "徐水县"
        },
        {
            "id"   : "141",
            "pid"  : "131",
            "type" : "2",
            "code" : "130626",
            "name" : "定兴县"
        },
        {
            "id"   : "142",
            "pid"  : "131",
            "type" : "2",
            "code" : "130627",
            "name" : "唐县"
        },
        {
            "id"   : "143",
            "pid"  : "131",
            "type" : "2",
            "code" : "130628",
            "name" : "高阳县"
        },
        {
            "id"   : "144",
            "pid"  : "131",
            "type" : "2",
            "code" : "130629",
            "name" : "容城县"
        },
        {
            "id"   : "145",
            "pid"  : "131",
            "type" : "2",
            "code" : "130630",
            "name" : "涞源县"
        },
        {
            "id"   : "146",
            "pid"  : "131",
            "type" : "2",
            "code" : "130631",
            "name" : "望都县"
        },
        {
            "id"   : "147",
            "pid"  : "131",
            "type" : "2",
            "code" : "130632",
            "name" : "安新县"
        },
        {
            "id"   : "148",
            "pid"  : "131",
            "type" : "2",
            "code" : "130633",
            "name" : "易县"
        },
        {
            "id"   : "149",
            "pid"  : "131",
            "type" : "2",
            "code" : "130634",
            "name" : "曲阳县"
        },
        {
            "id"   : "150",
            "pid"  : "131",
            "type" : "2",
            "code" : "130635",
            "name" : "蠡县"
        },
        {
            "id"   : "151",
            "pid"  : "131",
            "type" : "2",
            "code" : "130636",
            "name" : "顺平县"
        },
        {
            "id"   : "152",
            "pid"  : "131",
            "type" : "2",
            "code" : "130637",
            "name" : "博野县"
        },
        {
            "id"   : "153",
            "pid"  : "131",
            "type" : "2",
            "code" : "130638",
            "name" : "雄县"
        },
        {
            "id"   : "154",
            "pid"  : "131",
            "type" : "2",
            "code" : "130681",
            "name" : "涿州市"
        },
        {
            "id"   : "155",
            "pid"  : "131",
            "type" : "2",
            "code" : "130682",
            "name" : "定州市"
        },
        {
            "id"   : "156",
            "pid"  : "131",
            "type" : "2",
            "code" : "130683",
            "name" : "安国市"
        },
        {
            "id"   : "157",
            "pid"  : "131",
            "type" : "2",
            "code" : "130684",
            "name" : "高碑店市"
        },
        {
            "id"   : "158",
            "pid"  : "39",
            "type" : "1",
            "code" : "130700",
            "name" : "张家口市"
        },
        {
            "id"   : "159",
            "pid"  : "158",
            "type" : "2",
            "code" : "130701",
            "name" : "市辖区"
        },
        {
            "id"   : "160",
            "pid"  : "158",
            "type" : "2",
            "code" : "130702",
            "name" : "桥东区"
        },
        {
            "id"   : "161",
            "pid"  : "158",
            "type" : "2",
            "code" : "130703",
            "name" : "桥西区"
        },
        {
            "id"   : "162",
            "pid"  : "158",
            "type" : "2",
            "code" : "130705",
            "name" : "宣化区"
        },
        {
            "id"   : "163",
            "pid"  : "158",
            "type" : "2",
            "code" : "130706",
            "name" : "下花园区"
        },
        {
            "id"   : "164",
            "pid"  : "158",
            "type" : "2",
            "code" : "130721",
            "name" : "宣化县"
        },
        {
            "id"   : "165",
            "pid"  : "158",
            "type" : "2",
            "code" : "130722",
            "name" : "张北县"
        },
        {
            "id"   : "166",
            "pid"  : "158",
            "type" : "2",
            "code" : "130723",
            "name" : "康保县"
        },
        {
            "id"   : "167",
            "pid"  : "158",
            "type" : "2",
            "code" : "130724",
            "name" : "沽源县"
        },
        {
            "id"   : "168",
            "pid"  : "158",
            "type" : "2",
            "code" : "130725",
            "name" : "尚义县"
        },
        {
            "id"   : "169",
            "pid"  : "158",
            "type" : "2",
            "code" : "130726",
            "name" : "蔚县"
        },
        {
            "id"   : "170",
            "pid"  : "158",
            "type" : "2",
            "code" : "130727",
            "name" : "阳原县"
        },
        {
            "id"   : "171",
            "pid"  : "158",
            "type" : "2",
            "code" : "130728",
            "name" : "怀安县"
        },
        {
            "id"   : "172",
            "pid"  : "158",
            "type" : "2",
            "code" : "130729",
            "name" : "万全县"
        },
        {
            "id"   : "173",
            "pid"  : "158",
            "type" : "2",
            "code" : "130730",
            "name" : "怀来县"
        },
        {
            "id"   : "174",
            "pid"  : "158",
            "type" : "2",
            "code" : "130731",
            "name" : "涿鹿县"
        },
        {
            "id"   : "175",
            "pid"  : "158",
            "type" : "2",
            "code" : "130732",
            "name" : "赤城县"
        },
        {
            "id"   : "176",
            "pid"  : "158",
            "type" : "2",
            "code" : "130733",
            "name" : "崇礼县"
        },
        {
            "id"   : "177",
            "pid"  : "39",
            "type" : "1",
            "code" : "130800",
            "name" : "承德市"
        },
        {
            "id"   : "178",
            "pid"  : "177",
            "type" : "2",
            "code" : "130801",
            "name" : "市辖区"
        },
        {
            "id"   : "179",
            "pid"  : "177",
            "type" : "2",
            "code" : "130802",
            "name" : "双桥区"
        },
        {
            "id"   : "180",
            "pid"  : "177",
            "type" : "2",
            "code" : "130803",
            "name" : "双滦区"
        },
        {
            "id"   : "181",
            "pid"  : "177",
            "type" : "2",
            "code" : "130804",
            "name" : "鹰手营子矿区"
        },
        {
            "id"   : "182",
            "pid"  : "177",
            "type" : "2",
            "code" : "130821",
            "name" : "承德县"
        },
        {
            "id"   : "183",
            "pid"  : "177",
            "type" : "2",
            "code" : "130822",
            "name" : "兴隆县"
        },
        {
            "id"   : "184",
            "pid"  : "177",
            "type" : "2",
            "code" : "130823",
            "name" : "平泉县"
        },
        {
            "id"   : "185",
            "pid"  : "177",
            "type" : "2",
            "code" : "130824",
            "name" : "滦平县"
        },
        {
            "id"   : "186",
            "pid"  : "177",
            "type" : "2",
            "code" : "130825",
            "name" : "隆化县"
        },
        {
            "id"   : "187",
            "pid"  : "177",
            "type" : "2",
            "code" : "130826",
            "name" : "丰宁满族自治县"
        },
        {
            "id"   : "188",
            "pid"  : "177",
            "type" : "2",
            "code" : "130827",
            "name" : "宽城满族自治县"
        },
        {
            "id"   : "189",
            "pid"  : "177",
            "type" : "2",
            "code" : "130828",
            "name" : "围场满族蒙古族自治县"
        },
        {
            "id"   : "190",
            "pid"  : "39",
            "type" : "1",
            "code" : "130900",
            "name" : "沧州市"
        },
        {
            "id"   : "191",
            "pid"  : "190",
            "type" : "2",
            "code" : "130901",
            "name" : "市辖区"
        },
        {
            "id"   : "192",
            "pid"  : "190",
            "type" : "2",
            "code" : "130902",
            "name" : "新华区"
        },
        {
            "id"   : "193",
            "pid"  : "190",
            "type" : "2",
            "code" : "130903",
            "name" : "运河区"
        },
        {
            "id"   : "194",
            "pid"  : "190",
            "type" : "2",
            "code" : "130921",
            "name" : "沧县"
        },
        {
            "id"   : "195",
            "pid"  : "190",
            "type" : "2",
            "code" : "130922",
            "name" : "青县"
        },
        {
            "id"   : "196",
            "pid"  : "190",
            "type" : "2",
            "code" : "130923",
            "name" : "东光县"
        },
        {
            "id"   : "197",
            "pid"  : "190",
            "type" : "2",
            "code" : "130924",
            "name" : "海兴县"
        },
        {
            "id"   : "198",
            "pid"  : "190",
            "type" : "2",
            "code" : "130925",
            "name" : "盐山县"
        },
        {
            "id"   : "199",
            "pid"  : "190",
            "type" : "2",
            "code" : "130926",
            "name" : "肃宁县"
        },
        {
            "id"   : "200",
            "pid"  : "190",
            "type" : "2",
            "code" : "130927",
            "name" : "南皮县"
        },
        {
            "id"   : "201",
            "pid"  : "190",
            "type" : "2",
            "code" : "130928",
            "name" : "吴桥县"
        },
        {
            "id"   : "202",
            "pid"  : "190",
            "type" : "2",
            "code" : "130929",
            "name" : "献县"
        },
        {
            "id"   : "203",
            "pid"  : "190",
            "type" : "2",
            "code" : "130930",
            "name" : "孟村回族自治县"
        },
        {
            "id"   : "204",
            "pid"  : "190",
            "type" : "2",
            "code" : "130981",
            "name" : "泊头市"
        },
        {
            "id"   : "205",
            "pid"  : "190",
            "type" : "2",
            "code" : "130982",
            "name" : "任丘市"
        },
        {
            "id"   : "206",
            "pid"  : "190",
            "type" : "2",
            "code" : "130983",
            "name" : "黄骅市"
        },
        {
            "id"   : "207",
            "pid"  : "190",
            "type" : "2",
            "code" : "130984",
            "name" : "河间市"
        },
        {
            "id"   : "208",
            "pid"  : "39",
            "type" : "1",
            "code" : "131000",
            "name" : "廊坊市"
        },
        {
            "id"   : "209",
            "pid"  : "208",
            "type" : "2",
            "code" : "131001",
            "name" : "市辖区"
        },
        {
            "id"   : "210",
            "pid"  : "208",
            "type" : "2",
            "code" : "131002",
            "name" : "安次区"
        },
        {
            "id"   : "211",
            "pid"  : "208",
            "type" : "2",
            "code" : "131003",
            "name" : "广阳区"
        },
        {
            "id"   : "212",
            "pid"  : "208",
            "type" : "2",
            "code" : "131022",
            "name" : "固安县"
        },
        {
            "id"   : "213",
            "pid"  : "208",
            "type" : "2",
            "code" : "131023",
            "name" : "永清县"
        },
        {
            "id"   : "214",
            "pid"  : "208",
            "type" : "2",
            "code" : "131024",
            "name" : "香河县"
        },
        {
            "id"   : "215",
            "pid"  : "208",
            "type" : "2",
            "code" : "131025",
            "name" : "大城县"
        },
        {
            "id"   : "216",
            "pid"  : "208",
            "type" : "2",
            "code" : "131026",
            "name" : "文安县"
        },
        {
            "id"   : "217",
            "pid"  : "208",
            "type" : "2",
            "code" : "131028",
            "name" : "大厂回族自治县"
        },
        {
            "id"   : "218",
            "pid"  : "208",
            "type" : "2",
            "code" : "131081",
            "name" : "霸州市"
        },
        {
            "id"   : "219",
            "pid"  : "208",
            "type" : "2",
            "code" : "131082",
            "name" : "三河市"
        },
        {
            "id"   : "220",
            "pid"  : "39",
            "type" : "1",
            "code" : "131100",
            "name" : "衡水市"
        },
        {
            "id"   : "221",
            "pid"  : "220",
            "type" : "2",
            "code" : "131101",
            "name" : "市辖区"
        },
        {
            "id"   : "222",
            "pid"  : "220",
            "type" : "2",
            "code" : "131102",
            "name" : "桃城区"
        },
        {
            "id"   : "223",
            "pid"  : "220",
            "type" : "2",
            "code" : "131121",
            "name" : "枣强县"
        },
        {
            "id"   : "224",
            "pid"  : "220",
            "type" : "2",
            "code" : "131122",
            "name" : "武邑县"
        },
        {
            "id"   : "225",
            "pid"  : "220",
            "type" : "2",
            "code" : "131123",
            "name" : "武强县"
        },
        {
            "id"   : "226",
            "pid"  : "220",
            "type" : "2",
            "code" : "131124",
            "name" : "饶阳县"
        },
        {
            "id"   : "227",
            "pid"  : "220",
            "type" : "2",
            "code" : "131125",
            "name" : "安平县"
        },
        {
            "id"   : "228",
            "pid"  : "220",
            "type" : "2",
            "code" : "131126",
            "name" : "故城县"
        },
        {
            "id"   : "229",
            "pid"  : "220",
            "type" : "2",
            "code" : "131127",
            "name" : "景县"
        },
        {
            "id"   : "230",
            "pid"  : "220",
            "type" : "2",
            "code" : "131128",
            "name" : "阜城县"
        },
        {
            "id"   : "231",
            "pid"  : "220",
            "type" : "2",
            "code" : "131181",
            "name" : "冀州市"
        },
        {
            "id"   : "232",
            "pid"  : "220",
            "type" : "2",
            "code" : "131182",
            "name" : "深州市"
        },
        {
            "id"   : "233",
            "pid"  : "0",
            "type" : "0",
            "code" : "140000",
            "name" : "山西省"
        },
        {
            "id"   : "234",
            "pid"  : "233",
            "type" : "1",
            "code" : "140100",
            "name" : "太原市"
        },
        {
            "id"   : "235",
            "pid"  : "234",
            "type" : "2",
            "code" : "140101",
            "name" : "市辖区"
        },
        {
            "id"   : "236",
            "pid"  : "234",
            "type" : "2",
            "code" : "140105",
            "name" : "小店区"
        },
        {
            "id"   : "237",
            "pid"  : "234",
            "type" : "2",
            "code" : "140106",
            "name" : "迎泽区"
        },
        {
            "id"   : "238",
            "pid"  : "234",
            "type" : "2",
            "code" : "140107",
            "name" : "杏花岭区"
        },
        {
            "id"   : "239",
            "pid"  : "234",
            "type" : "2",
            "code" : "140108",
            "name" : "尖草坪区"
        },
        {
            "id"   : "240",
            "pid"  : "234",
            "type" : "2",
            "code" : "140109",
            "name" : "万柏林区"
        },
        {
            "id"   : "241",
            "pid"  : "234",
            "type" : "2",
            "code" : "140110",
            "name" : "晋源区"
        },
        {
            "id"   : "242",
            "pid"  : "234",
            "type" : "2",
            "code" : "140121",
            "name" : "清徐县"
        },
        {
            "id"   : "243",
            "pid"  : "234",
            "type" : "2",
            "code" : "140122",
            "name" : "阳曲县"
        },
        {
            "id"   : "244",
            "pid"  : "234",
            "type" : "2",
            "code" : "140123",
            "name" : "娄烦县"
        },
        {
            "id"   : "245",
            "pid"  : "234",
            "type" : "2",
            "code" : "140181",
            "name" : "古交市"
        },
        {
            "id"   : "246",
            "pid"  : "233",
            "type" : "1",
            "code" : "140200",
            "name" : "大同市"
        },
        {
            "id"   : "247",
            "pid"  : "246",
            "type" : "2",
            "code" : "140201",
            "name" : "市辖区"
        },
        {
            "id"   : "248",
            "pid"  : "246",
            "type" : "2",
            "code" : "140202",
            "name" : "城区"
        },
        {
            "id"   : "249",
            "pid"  : "246",
            "type" : "2",
            "code" : "140203",
            "name" : "矿区"
        },
        {
            "id"   : "250",
            "pid"  : "246",
            "type" : "2",
            "code" : "140211",
            "name" : "南郊区"
        },
        {
            "id"   : "251",
            "pid"  : "246",
            "type" : "2",
            "code" : "140212",
            "name" : "新荣区"
        },
        {
            "id"   : "252",
            "pid"  : "246",
            "type" : "2",
            "code" : "140221",
            "name" : "阳高县"
        },
        {
            "id"   : "253",
            "pid"  : "246",
            "type" : "2",
            "code" : "140222",
            "name" : "天镇县"
        },
        {
            "id"   : "254",
            "pid"  : "246",
            "type" : "2",
            "code" : "140223",
            "name" : "广灵县"
        },
        {
            "id"   : "255",
            "pid"  : "246",
            "type" : "2",
            "code" : "140224",
            "name" : "灵丘县"
        },
        {
            "id"   : "256",
            "pid"  : "246",
            "type" : "2",
            "code" : "140225",
            "name" : "浑源县"
        },
        {
            "id"   : "257",
            "pid"  : "246",
            "type" : "2",
            "code" : "140226",
            "name" : "左云县"
        },
        {
            "id"   : "258",
            "pid"  : "246",
            "type" : "2",
            "code" : "140227",
            "name" : "大同县"
        },
        {
            "id"   : "259",
            "pid"  : "233",
            "type" : "1",
            "code" : "140300",
            "name" : "阳泉市"
        },
        {
            "id"   : "260",
            "pid"  : "259",
            "type" : "2",
            "code" : "140301",
            "name" : "市辖区"
        },
        {
            "id"   : "261",
            "pid"  : "259",
            "type" : "2",
            "code" : "140302",
            "name" : "城区"
        },
        {
            "id"   : "262",
            "pid"  : "259",
            "type" : "2",
            "code" : "140303",
            "name" : "矿区"
        },
        {
            "id"   : "263",
            "pid"  : "259",
            "type" : "2",
            "code" : "140311",
            "name" : "郊区"
        },
        {
            "id"   : "264",
            "pid"  : "259",
            "type" : "2",
            "code" : "140321",
            "name" : "平定县"
        },
        {
            "id"   : "265",
            "pid"  : "259",
            "type" : "2",
            "code" : "140322",
            "name" : "盂县"
        },
        {
            "id"   : "266",
            "pid"  : "233",
            "type" : "1",
            "code" : "140400",
            "name" : "长治市"
        },
        {
            "id"   : "267",
            "pid"  : "266",
            "type" : "2",
            "code" : "140401",
            "name" : "市辖区"
        },
        {
            "id"   : "268",
            "pid"  : "266",
            "type" : "2",
            "code" : "140402",
            "name" : "城区"
        },
        {
            "id"   : "269",
            "pid"  : "266",
            "type" : "2",
            "code" : "140411",
            "name" : "郊区"
        },
        {
            "id"   : "270",
            "pid"  : "266",
            "type" : "2",
            "code" : "140421",
            "name" : "长治县"
        },
        {
            "id"   : "271",
            "pid"  : "266",
            "type" : "2",
            "code" : "140423",
            "name" : "襄垣县"
        },
        {
            "id"   : "272",
            "pid"  : "266",
            "type" : "2",
            "code" : "140424",
            "name" : "屯留县"
        },
        {
            "id"   : "273",
            "pid"  : "266",
            "type" : "2",
            "code" : "140425",
            "name" : "平顺县"
        },
        {
            "id"   : "274",
            "pid"  : "266",
            "type" : "2",
            "code" : "140426",
            "name" : "黎城县"
        },
        {
            "id"   : "275",
            "pid"  : "266",
            "type" : "2",
            "code" : "140427",
            "name" : "壶关县"
        },
        {
            "id"   : "276",
            "pid"  : "266",
            "type" : "2",
            "code" : "140428",
            "name" : "长子县"
        },
        {
            "id"   : "277",
            "pid"  : "266",
            "type" : "2",
            "code" : "140429",
            "name" : "武乡县"
        },
        {
            "id"   : "278",
            "pid"  : "266",
            "type" : "2",
            "code" : "140430",
            "name" : "沁县"
        },
        {
            "id"   : "279",
            "pid"  : "266",
            "type" : "2",
            "code" : "140431",
            "name" : "沁源县"
        },
        {
            "id"   : "280",
            "pid"  : "266",
            "type" : "2",
            "code" : "140481",
            "name" : "潞城市"
        },
        {
            "id"   : "281",
            "pid"  : "233",
            "type" : "1",
            "code" : "140500",
            "name" : "晋城市"
        },
        {
            "id"   : "282",
            "pid"  : "281",
            "type" : "2",
            "code" : "140501",
            "name" : "市辖区"
        },
        {
            "id"   : "283",
            "pid"  : "281",
            "type" : "2",
            "code" : "140502",
            "name" : "城区"
        },
        {
            "id"   : "284",
            "pid"  : "281",
            "type" : "2",
            "code" : "140521",
            "name" : "沁水县"
        },
        {
            "id"   : "285",
            "pid"  : "281",
            "type" : "2",
            "code" : "140522",
            "name" : "阳城县"
        },
        {
            "id"   : "286",
            "pid"  : "281",
            "type" : "2",
            "code" : "140524",
            "name" : "陵川县"
        },
        {
            "id"   : "287",
            "pid"  : "281",
            "type" : "2",
            "code" : "140525",
            "name" : "泽州县"
        },
        {
            "id"   : "288",
            "pid"  : "281",
            "type" : "2",
            "code" : "140581",
            "name" : "高平市"
        },
        {
            "id"   : "289",
            "pid"  : "233",
            "type" : "1",
            "code" : "140600",
            "name" : "朔州市"
        },
        {
            "id"   : "290",
            "pid"  : "289",
            "type" : "2",
            "code" : "140601",
            "name" : "市辖区"
        },
        {
            "id"   : "291",
            "pid"  : "289",
            "type" : "2",
            "code" : "140602",
            "name" : "朔城区"
        },
        {
            "id"   : "292",
            "pid"  : "289",
            "type" : "2",
            "code" : "140603",
            "name" : "平鲁区"
        },
        {
            "id"   : "293",
            "pid"  : "289",
            "type" : "2",
            "code" : "140621",
            "name" : "山阴县"
        },
        {
            "id"   : "294",
            "pid"  : "289",
            "type" : "2",
            "code" : "140622",
            "name" : "应县"
        },
        {
            "id"   : "295",
            "pid"  : "289",
            "type" : "2",
            "code" : "140623",
            "name" : "右玉县"
        },
        {
            "id"   : "296",
            "pid"  : "289",
            "type" : "2",
            "code" : "140624",
            "name" : "怀仁县"
        },
        {
            "id"   : "297",
            "pid"  : "233",
            "type" : "1",
            "code" : "140700",
            "name" : "晋中市"
        },
        {
            "id"   : "298",
            "pid"  : "297",
            "type" : "2",
            "code" : "140701",
            "name" : "市辖区"
        },
        {
            "id"   : "299",
            "pid"  : "297",
            "type" : "2",
            "code" : "140702",
            "name" : "榆次区"
        },
        {
            "id"   : "300",
            "pid"  : "297",
            "type" : "2",
            "code" : "140721",
            "name" : "榆社县"
        },
        {
            "id"   : "301",
            "pid"  : "297",
            "type" : "2",
            "code" : "140722",
            "name" : "左权县"
        },
        {
            "id"   : "302",
            "pid"  : "297",
            "type" : "2",
            "code" : "140723",
            "name" : "和顺县"
        },
        {
            "id"   : "303",
            "pid"  : "297",
            "type" : "2",
            "code" : "140724",
            "name" : "昔阳县"
        },
        {
            "id"   : "304",
            "pid"  : "297",
            "type" : "2",
            "code" : "140725",
            "name" : "寿阳县"
        },
        {
            "id"   : "305",
            "pid"  : "297",
            "type" : "2",
            "code" : "140726",
            "name" : "太谷县"
        },
        {
            "id"   : "306",
            "pid"  : "297",
            "type" : "2",
            "code" : "140727",
            "name" : "祁县"
        },
        {
            "id"   : "307",
            "pid"  : "297",
            "type" : "2",
            "code" : "140728",
            "name" : "平遥县"
        },
        {
            "id"   : "308",
            "pid"  : "297",
            "type" : "2",
            "code" : "140729",
            "name" : "灵石县"
        },
        {
            "id"   : "309",
            "pid"  : "297",
            "type" : "2",
            "code" : "140781",
            "name" : "介休市"
        },
        {
            "id"   : "310",
            "pid"  : "233",
            "type" : "1",
            "code" : "140800",
            "name" : "运城市"
        },
        {
            "id"   : "311",
            "pid"  : "310",
            "type" : "2",
            "code" : "140801",
            "name" : "市辖区"
        },
        {
            "id"   : "312",
            "pid"  : "310",
            "type" : "2",
            "code" : "140802",
            "name" : "盐湖区"
        },
        {
            "id"   : "313",
            "pid"  : "310",
            "type" : "2",
            "code" : "140821",
            "name" : "临猗县"
        },
        {
            "id"   : "314",
            "pid"  : "310",
            "type" : "2",
            "code" : "140822",
            "name" : "万荣县"
        },
        {
            "id"   : "315",
            "pid"  : "310",
            "type" : "2",
            "code" : "140823",
            "name" : "闻喜县"
        },
        {
            "id"   : "316",
            "pid"  : "310",
            "type" : "2",
            "code" : "140824",
            "name" : "稷山县"
        },
        {
            "id"   : "317",
            "pid"  : "310",
            "type" : "2",
            "code" : "140825",
            "name" : "新绛县"
        },
        {
            "id"   : "318",
            "pid"  : "310",
            "type" : "2",
            "code" : "140826",
            "name" : "绛县"
        },
        {
            "id"   : "319",
            "pid"  : "310",
            "type" : "2",
            "code" : "140827",
            "name" : "垣曲县"
        },
        {
            "id"   : "320",
            "pid"  : "310",
            "type" : "2",
            "code" : "140828",
            "name" : "夏县"
        },
        {
            "id"   : "321",
            "pid"  : "310",
            "type" : "2",
            "code" : "140829",
            "name" : "平陆县"
        },
        {
            "id"   : "322",
            "pid"  : "310",
            "type" : "2",
            "code" : "140830",
            "name" : "芮城县"
        },
        {
            "id"   : "323",
            "pid"  : "310",
            "type" : "2",
            "code" : "140881",
            "name" : "永济市"
        },
        {
            "id"   : "324",
            "pid"  : "310",
            "type" : "2",
            "code" : "140882",
            "name" : "河津市"
        },
        {
            "id"   : "325",
            "pid"  : "233",
            "type" : "1",
            "code" : "140900",
            "name" : "忻州市"
        },
        {
            "id"   : "326",
            "pid"  : "325",
            "type" : "2",
            "code" : "140901",
            "name" : "市辖区"
        },
        {
            "id"   : "327",
            "pid"  : "325",
            "type" : "2",
            "code" : "140902",
            "name" : "忻府区"
        },
        {
            "id"   : "328",
            "pid"  : "325",
            "type" : "2",
            "code" : "140921",
            "name" : "定襄县"
        },
        {
            "id"   : "329",
            "pid"  : "325",
            "type" : "2",
            "code" : "140922",
            "name" : "五台县"
        },
        {
            "id"   : "330",
            "pid"  : "325",
            "type" : "2",
            "code" : "140923",
            "name" : "代县"
        },
        {
            "id"   : "331",
            "pid"  : "325",
            "type" : "2",
            "code" : "140924",
            "name" : "繁峙县"
        },
        {
            "id"   : "332",
            "pid"  : "325",
            "type" : "2",
            "code" : "140925",
            "name" : "宁武县"
        },
        {
            "id"   : "333",
            "pid"  : "325",
            "type" : "2",
            "code" : "140926",
            "name" : "静乐县"
        },
        {
            "id"   : "334",
            "pid"  : "325",
            "type" : "2",
            "code" : "140927",
            "name" : "神池县"
        },
        {
            "id"   : "335",
            "pid"  : "325",
            "type" : "2",
            "code" : "140928",
            "name" : "五寨县"
        },
        {
            "id"   : "336",
            "pid"  : "325",
            "type" : "2",
            "code" : "140929",
            "name" : "岢岚县"
        },
        {
            "id"   : "337",
            "pid"  : "325",
            "type" : "2",
            "code" : "140930",
            "name" : "河曲县"
        },
        {
            "id"   : "338",
            "pid"  : "325",
            "type" : "2",
            "code" : "140931",
            "name" : "保德县"
        },
        {
            "id"   : "339",
            "pid"  : "325",
            "type" : "2",
            "code" : "140932",
            "name" : "偏关县"
        },
        {
            "id"   : "340",
            "pid"  : "325",
            "type" : "2",
            "code" : "140981",
            "name" : "原平市"
        },
        {
            "id"   : "341",
            "pid"  : "233",
            "type" : "1",
            "code" : "141000",
            "name" : "临汾市"
        },
        {
            "id"   : "342",
            "pid"  : "341",
            "type" : "2",
            "code" : "141001",
            "name" : "市辖区"
        },
        {
            "id"   : "343",
            "pid"  : "341",
            "type" : "2",
            "code" : "141002",
            "name" : "尧都区"
        },
        {
            "id"   : "344",
            "pid"  : "341",
            "type" : "2",
            "code" : "141021",
            "name" : "曲沃县"
        },
        {
            "id"   : "345",
            "pid"  : "341",
            "type" : "2",
            "code" : "141022",
            "name" : "翼城县"
        },
        {
            "id"   : "346",
            "pid"  : "341",
            "type" : "2",
            "code" : "141023",
            "name" : "襄汾县"
        },
        {
            "id"   : "347",
            "pid"  : "341",
            "type" : "2",
            "code" : "141024",
            "name" : "洪洞县"
        },
        {
            "id"   : "348",
            "pid"  : "341",
            "type" : "2",
            "code" : "141025",
            "name" : "古县"
        },
        {
            "id"   : "349",
            "pid"  : "341",
            "type" : "2",
            "code" : "141026",
            "name" : "安泽县"
        },
        {
            "id"   : "350",
            "pid"  : "341",
            "type" : "2",
            "code" : "141027",
            "name" : "浮山县"
        },
        {
            "id"   : "351",
            "pid"  : "341",
            "type" : "2",
            "code" : "141028",
            "name" : "吉县"
        },
        {
            "id"   : "352",
            "pid"  : "341",
            "type" : "2",
            "code" : "141029",
            "name" : "乡宁县"
        },
        {
            "id"   : "353",
            "pid"  : "341",
            "type" : "2",
            "code" : "141030",
            "name" : "大宁县"
        },
        {
            "id"   : "354",
            "pid"  : "341",
            "type" : "2",
            "code" : "141031",
            "name" : "隰县"
        },
        {
            "id"   : "355",
            "pid"  : "341",
            "type" : "2",
            "code" : "141032",
            "name" : "永和县"
        },
        {
            "id"   : "356",
            "pid"  : "341",
            "type" : "2",
            "code" : "141033",
            "name" : "蒲县"
        },
        {
            "id"   : "357",
            "pid"  : "341",
            "type" : "2",
            "code" : "141034",
            "name" : "汾西县"
        },
        {
            "id"   : "358",
            "pid"  : "341",
            "type" : "2",
            "code" : "141081",
            "name" : "侯马市"
        },
        {
            "id"   : "359",
            "pid"  : "341",
            "type" : "2",
            "code" : "141082",
            "name" : "霍州市"
        },
        {
            "id"   : "360",
            "pid"  : "233",
            "type" : "1",
            "code" : "141100",
            "name" : "吕梁市"
        },
        {
            "id"   : "361",
            "pid"  : "360",
            "type" : "2",
            "code" : "141101",
            "name" : "市辖区"
        },
        {
            "id"   : "362",
            "pid"  : "360",
            "type" : "2",
            "code" : "141102",
            "name" : "离石区"
        },
        {
            "id"   : "363",
            "pid"  : "360",
            "type" : "2",
            "code" : "141121",
            "name" : "文水县"
        },
        {
            "id"   : "364",
            "pid"  : "360",
            "type" : "2",
            "code" : "141122",
            "name" : "交城县"
        },
        {
            "id"   : "365",
            "pid"  : "360",
            "type" : "2",
            "code" : "141123",
            "name" : "兴县"
        },
        {
            "id"   : "366",
            "pid"  : "360",
            "type" : "2",
            "code" : "141124",
            "name" : "临县"
        },
        {
            "id"   : "367",
            "pid"  : "360",
            "type" : "2",
            "code" : "141125",
            "name" : "柳林县"
        },
        {
            "id"   : "368",
            "pid"  : "360",
            "type" : "2",
            "code" : "141126",
            "name" : "石楼县"
        },
        {
            "id"   : "369",
            "pid"  : "360",
            "type" : "2",
            "code" : "141127",
            "name" : "岚县"
        },
        {
            "id"   : "370",
            "pid"  : "360",
            "type" : "2",
            "code" : "141128",
            "name" : "方山县"
        },
        {
            "id"   : "371",
            "pid"  : "360",
            "type" : "2",
            "code" : "141129",
            "name" : "中阳县"
        },
        {
            "id"   : "372",
            "pid"  : "360",
            "type" : "2",
            "code" : "141130",
            "name" : "交口县"
        },
        {
            "id"   : "373",
            "pid"  : "360",
            "type" : "2",
            "code" : "141181",
            "name" : "孝义市"
        },
        {
            "id"   : "374",
            "pid"  : "360",
            "type" : "2",
            "code" : "141182",
            "name" : "汾阳市"
        },
        {
            "id"   : "375",
            "pid"  : "0",
            "type" : "0",
            "code" : "150000",
            "name" : "内蒙古自治区"
        },
        {
            "id"   : "376",
            "pid"  : "375",
            "type" : "1",
            "code" : "150100",
            "name" : "呼和浩特市"
        },
        {
            "id"   : "377",
            "pid"  : "376",
            "type" : "2",
            "code" : "150101",
            "name" : "市辖区"
        },
        {
            "id"   : "378",
            "pid"  : "376",
            "type" : "2",
            "code" : "150102",
            "name" : "新城区"
        },
        {
            "id"   : "379",
            "pid"  : "376",
            "type" : "2",
            "code" : "150103",
            "name" : "回民区"
        },
        {
            "id"   : "380",
            "pid"  : "376",
            "type" : "2",
            "code" : "150104",
            "name" : "玉泉区"
        },
        {
            "id"   : "381",
            "pid"  : "376",
            "type" : "2",
            "code" : "150105",
            "name" : "赛罕区"
        },
        {
            "id"   : "382",
            "pid"  : "376",
            "type" : "2",
            "code" : "150121",
            "name" : "土默特左旗"
        },
        {
            "id"   : "383",
            "pid"  : "376",
            "type" : "2",
            "code" : "150122",
            "name" : "托克托县"
        },
        {
            "id"   : "384",
            "pid"  : "376",
            "type" : "2",
            "code" : "150123",
            "name" : "和林格尔县"
        },
        {
            "id"   : "385",
            "pid"  : "376",
            "type" : "2",
            "code" : "150124",
            "name" : "清水河县"
        },
        {
            "id"   : "386",
            "pid"  : "376",
            "type" : "2",
            "code" : "150125",
            "name" : "武川县"
        },
        {
            "id"   : "387",
            "pid"  : "375",
            "type" : "1",
            "code" : "150200",
            "name" : "包头市"
        },
        {
            "id"   : "388",
            "pid"  : "387",
            "type" : "2",
            "code" : "150201",
            "name" : "市辖区"
        },
        {
            "id"   : "389",
            "pid"  : "387",
            "type" : "2",
            "code" : "150202",
            "name" : "东河区"
        },
        {
            "id"   : "390",
            "pid"  : "387",
            "type" : "2",
            "code" : "150203",
            "name" : "昆都仑区"
        },
        {
            "id"   : "391",
            "pid"  : "387",
            "type" : "2",
            "code" : "150204",
            "name" : "青山区"
        },
        {
            "id"   : "392",
            "pid"  : "387",
            "type" : "2",
            "code" : "150205",
            "name" : "石拐区"
        },
        {
            "id"   : "393",
            "pid"  : "387",
            "type" : "2",
            "code" : "150206",
            "name" : "白云鄂博矿区"
        },
        {
            "id"   : "394",
            "pid"  : "387",
            "type" : "2",
            "code" : "150207",
            "name" : "九原区"
        },
        {
            "id"   : "395",
            "pid"  : "387",
            "type" : "2",
            "code" : "150221",
            "name" : "土默特右旗"
        },
        {
            "id"   : "396",
            "pid"  : "387",
            "type" : "2",
            "code" : "150222",
            "name" : "固阳县"
        },
        {
            "id"   : "397",
            "pid"  : "387",
            "type" : "2",
            "code" : "150223",
            "name" : "达尔罕茂明安联合旗"
        },
        {
            "id"   : "398",
            "pid"  : "375",
            "type" : "1",
            "code" : "150300",
            "name" : "乌海市"
        },
        {
            "id"   : "399",
            "pid"  : "398",
            "type" : "2",
            "code" : "150301",
            "name" : "市辖区"
        },
        {
            "id"   : "400",
            "pid"  : "398",
            "type" : "2",
            "code" : "150302",
            "name" : "海勃湾区"
        },
        {
            "id"   : "401",
            "pid"  : "398",
            "type" : "2",
            "code" : "150303",
            "name" : "海南区"
        },
        {
            "id"   : "402",
            "pid"  : "398",
            "type" : "2",
            "code" : "150304",
            "name" : "乌达区"
        },
        {
            "id"   : "403",
            "pid"  : "375",
            "type" : "1",
            "code" : "150400",
            "name" : "赤峰市"
        },
        {
            "id"   : "404",
            "pid"  : "403",
            "type" : "2",
            "code" : "150401",
            "name" : "市辖区"
        },
        {
            "id"   : "405",
            "pid"  : "403",
            "type" : "2",
            "code" : "150402",
            "name" : "红山区"
        },
        {
            "id"   : "406",
            "pid"  : "403",
            "type" : "2",
            "code" : "150403",
            "name" : "元宝山区"
        },
        {
            "id"   : "407",
            "pid"  : "403",
            "type" : "2",
            "code" : "150404",
            "name" : "松山区"
        },
        {
            "id"   : "408",
            "pid"  : "403",
            "type" : "2",
            "code" : "150421",
            "name" : "阿鲁科尔沁旗"
        },
        {
            "id"   : "409",
            "pid"  : "403",
            "type" : "2",
            "code" : "150422",
            "name" : "巴林左旗"
        },
        {
            "id"   : "410",
            "pid"  : "403",
            "type" : "2",
            "code" : "150423",
            "name" : "巴林右旗"
        },
        {
            "id"   : "411",
            "pid"  : "403",
            "type" : "2",
            "code" : "150424",
            "name" : "林西县"
        },
        {
            "id"   : "412",
            "pid"  : "403",
            "type" : "2",
            "code" : "150425",
            "name" : "克什克腾旗"
        },
        {
            "id"   : "413",
            "pid"  : "403",
            "type" : "2",
            "code" : "150426",
            "name" : "翁牛特旗"
        },
        {
            "id"   : "414",
            "pid"  : "403",
            "type" : "2",
            "code" : "150428",
            "name" : "喀喇沁旗"
        },
        {
            "id"   : "415",
            "pid"  : "403",
            "type" : "2",
            "code" : "150429",
            "name" : "宁城县"
        },
        {
            "id"   : "416",
            "pid"  : "403",
            "type" : "2",
            "code" : "150430",
            "name" : "敖汉旗"
        },
        {
            "id"   : "417",
            "pid"  : "375",
            "type" : "1",
            "code" : "150500",
            "name" : "通辽市"
        },
        {
            "id"   : "418",
            "pid"  : "417",
            "type" : "2",
            "code" : "150501",
            "name" : "市辖区"
        },
        {
            "id"   : "419",
            "pid"  : "417",
            "type" : "2",
            "code" : "150502",
            "name" : "科尔沁区"
        },
        {
            "id"   : "420",
            "pid"  : "417",
            "type" : "2",
            "code" : "150521",
            "name" : "科尔沁左翼中旗"
        },
        {
            "id"   : "421",
            "pid"  : "417",
            "type" : "2",
            "code" : "150522",
            "name" : "科尔沁左翼后旗"
        },
        {
            "id"   : "422",
            "pid"  : "417",
            "type" : "2",
            "code" : "150523",
            "name" : "开鲁县"
        },
        {
            "id"   : "423",
            "pid"  : "417",
            "type" : "2",
            "code" : "150524",
            "name" : "库伦旗"
        },
        {
            "id"   : "424",
            "pid"  : "417",
            "type" : "2",
            "code" : "150525",
            "name" : "奈曼旗"
        },
        {
            "id"   : "425",
            "pid"  : "417",
            "type" : "2",
            "code" : "150526",
            "name" : "扎鲁特旗"
        },
        {
            "id"   : "426",
            "pid"  : "417",
            "type" : "2",
            "code" : "150581",
            "name" : "霍林郭勒市"
        },
        {
            "id"   : "427",
            "pid"  : "375",
            "type" : "1",
            "code" : "150600",
            "name" : "鄂尔多斯市"
        },
        {
            "id"   : "428",
            "pid"  : "427",
            "type" : "2",
            "code" : "150601",
            "name" : "市辖区"
        },
        {
            "id"   : "429",
            "pid"  : "427",
            "type" : "2",
            "code" : "150602",
            "name" : "东胜区"
        },
        {
            "id"   : "430",
            "pid"  : "427",
            "type" : "2",
            "code" : "150621",
            "name" : "达拉特旗"
        },
        {
            "id"   : "431",
            "pid"  : "427",
            "type" : "2",
            "code" : "150622",
            "name" : "准格尔旗"
        },
        {
            "id"   : "432",
            "pid"  : "427",
            "type" : "2",
            "code" : "150623",
            "name" : "鄂托克前旗"
        },
        {
            "id"   : "433",
            "pid"  : "427",
            "type" : "2",
            "code" : "150624",
            "name" : "鄂托克旗"
        },
        {
            "id"   : "434",
            "pid"  : "427",
            "type" : "2",
            "code" : "150625",
            "name" : "杭锦旗"
        },
        {
            "id"   : "435",
            "pid"  : "427",
            "type" : "2",
            "code" : "150626",
            "name" : "乌审旗"
        },
        {
            "id"   : "436",
            "pid"  : "427",
            "type" : "2",
            "code" : "150627",
            "name" : "伊金霍洛旗"
        },
        {
            "id"   : "437",
            "pid"  : "375",
            "type" : "1",
            "code" : "150700",
            "name" : "呼伦贝尔市"
        },
        {
            "id"   : "438",
            "pid"  : "437",
            "type" : "2",
            "code" : "150701",
            "name" : "市辖区"
        },
        {
            "id"   : "439",
            "pid"  : "437",
            "type" : "2",
            "code" : "150702",
            "name" : "海拉尔区"
        },
        {
            "id"   : "440",
            "pid"  : "437",
            "type" : "2",
            "code" : "150703",
            "name" : "扎赉诺尔区"
        },
        {
            "id"   : "441",
            "pid"  : "437",
            "type" : "2",
            "code" : "150721",
            "name" : "阿荣旗"
        },
        {
            "id"   : "442",
            "pid"  : "437",
            "type" : "2",
            "code" : "150722",
            "name" : "莫力达瓦达斡尔族自治旗"
        },
        {
            "id"   : "443",
            "pid"  : "437",
            "type" : "2",
            "code" : "150723",
            "name" : "鄂伦春自治旗"
        },
        {
            "id"   : "444",
            "pid"  : "437",
            "type" : "2",
            "code" : "150724",
            "name" : "鄂温克族自治旗"
        },
        {
            "id"   : "445",
            "pid"  : "437",
            "type" : "2",
            "code" : "150725",
            "name" : "陈巴尔虎旗"
        },
        {
            "id"   : "446",
            "pid"  : "437",
            "type" : "2",
            "code" : "150726",
            "name" : "新巴尔虎左旗"
        },
        {
            "id"   : "447",
            "pid"  : "437",
            "type" : "2",
            "code" : "150727",
            "name" : "新巴尔虎右旗"
        },
        {
            "id"   : "448",
            "pid"  : "437",
            "type" : "2",
            "code" : "150781",
            "name" : "满洲里市"
        },
        {
            "id"   : "449",
            "pid"  : "437",
            "type" : "2",
            "code" : "150782",
            "name" : "牙克石市"
        },
        {
            "id"   : "450",
            "pid"  : "437",
            "type" : "2",
            "code" : "150783",
            "name" : "扎兰屯市"
        },
        {
            "id"   : "451",
            "pid"  : "437",
            "type" : "2",
            "code" : "150784",
            "name" : "额尔古纳市"
        },
        {
            "id"   : "452",
            "pid"  : "437",
            "type" : "2",
            "code" : "150785",
            "name" : "根河市"
        },
        {
            "id"   : "453",
            "pid"  : "375",
            "type" : "1",
            "code" : "150800",
            "name" : "巴彦淖尔市"
        },
        {
            "id"   : "454",
            "pid"  : "453",
            "type" : "2",
            "code" : "150801",
            "name" : "市辖区"
        },
        {
            "id"   : "455",
            "pid"  : "453",
            "type" : "2",
            "code" : "150802",
            "name" : "临河区"
        },
        {
            "id"   : "456",
            "pid"  : "453",
            "type" : "2",
            "code" : "150821",
            "name" : "五原县"
        },
        {
            "id"   : "457",
            "pid"  : "453",
            "type" : "2",
            "code" : "150822",
            "name" : "磴口县"
        },
        {
            "id"   : "458",
            "pid"  : "453",
            "type" : "2",
            "code" : "150823",
            "name" : "乌拉特前旗"
        },
        {
            "id"   : "459",
            "pid"  : "453",
            "type" : "2",
            "code" : "150824",
            "name" : "乌拉特中旗"
        },
        {
            "id"   : "460",
            "pid"  : "453",
            "type" : "2",
            "code" : "150825",
            "name" : "乌拉特后旗"
        },
        {
            "id"   : "461",
            "pid"  : "453",
            "type" : "2",
            "code" : "150826",
            "name" : "杭锦后旗"
        },
        {
            "id"   : "462",
            "pid"  : "375",
            "type" : "1",
            "code" : "150900",
            "name" : "乌兰察布市"
        },
        {
            "id"   : "463",
            "pid"  : "462",
            "type" : "2",
            "code" : "150901",
            "name" : "市辖区"
        },
        {
            "id"   : "464",
            "pid"  : "462",
            "type" : "2",
            "code" : "150902",
            "name" : "集宁区"
        },
        {
            "id"   : "465",
            "pid"  : "462",
            "type" : "2",
            "code" : "150921",
            "name" : "卓资县"
        },
        {
            "id"   : "466",
            "pid"  : "462",
            "type" : "2",
            "code" : "150922",
            "name" : "化德县"
        },
        {
            "id"   : "467",
            "pid"  : "462",
            "type" : "2",
            "code" : "150923",
            "name" : "商都县"
        },
        {
            "id"   : "468",
            "pid"  : "462",
            "type" : "2",
            "code" : "150924",
            "name" : "兴和县"
        },
        {
            "id"   : "469",
            "pid"  : "462",
            "type" : "2",
            "code" : "150925",
            "name" : "凉城县"
        },
        {
            "id"   : "470",
            "pid"  : "462",
            "type" : "2",
            "code" : "150926",
            "name" : "察哈尔右翼前旗"
        },
        {
            "id"   : "471",
            "pid"  : "462",
            "type" : "2",
            "code" : "150927",
            "name" : "察哈尔右翼中旗"
        },
        {
            "id"   : "472",
            "pid"  : "462",
            "type" : "2",
            "code" : "150928",
            "name" : "察哈尔右翼后旗"
        },
        {
            "id"   : "473",
            "pid"  : "462",
            "type" : "2",
            "code" : "150929",
            "name" : "四子王旗"
        },
        {
            "id"   : "474",
            "pid"  : "462",
            "type" : "2",
            "code" : "150981",
            "name" : "丰镇市"
        },
        {
            "id"   : "475",
            "pid"  : "375",
            "type" : "1",
            "code" : "152200",
            "name" : "兴安盟"
        },
        {
            "id"   : "476",
            "pid"  : "475",
            "type" : "2",
            "code" : "152201",
            "name" : "乌兰浩特市"
        },
        {
            "id"   : "477",
            "pid"  : "475",
            "type" : "2",
            "code" : "152202",
            "name" : "阿尔山市"
        },
        {
            "id"   : "478",
            "pid"  : "475",
            "type" : "2",
            "code" : "152221",
            "name" : "科尔沁右翼前旗"
        },
        {
            "id"   : "479",
            "pid"  : "475",
            "type" : "2",
            "code" : "152222",
            "name" : "科尔沁右翼中旗"
        },
        {
            "id"   : "480",
            "pid"  : "475",
            "type" : "2",
            "code" : "152223",
            "name" : "扎赉特旗"
        },
        {
            "id"   : "481",
            "pid"  : "475",
            "type" : "2",
            "code" : "152224",
            "name" : "突泉县"
        },
        {
            "id"   : "482",
            "pid"  : "375",
            "type" : "1",
            "code" : "152500",
            "name" : "锡林郭勒盟"
        },
        {
            "id"   : "483",
            "pid"  : "482",
            "type" : "2",
            "code" : "152501",
            "name" : "二连浩特市"
        },
        {
            "id"   : "484",
            "pid"  : "482",
            "type" : "2",
            "code" : "152502",
            "name" : "锡林浩特市"
        },
        {
            "id"   : "485",
            "pid"  : "482",
            "type" : "2",
            "code" : "152522",
            "name" : "阿巴嘎旗"
        },
        {
            "id"   : "486",
            "pid"  : "482",
            "type" : "2",
            "code" : "152523",
            "name" : "苏尼特左旗"
        },
        {
            "id"   : "487",
            "pid"  : "482",
            "type" : "2",
            "code" : "152524",
            "name" : "苏尼特右旗"
        },
        {
            "id"   : "488",
            "pid"  : "482",
            "type" : "2",
            "code" : "152525",
            "name" : "东乌珠穆沁旗"
        },
        {
            "id"   : "489",
            "pid"  : "482",
            "type" : "2",
            "code" : "152526",
            "name" : "西乌珠穆沁旗"
        },
        {
            "id"   : "490",
            "pid"  : "482",
            "type" : "2",
            "code" : "152527",
            "name" : "太仆寺旗"
        },
        {
            "id"   : "491",
            "pid"  : "482",
            "type" : "2",
            "code" : "152528",
            "name" : "镶黄旗"
        },
        {
            "id"   : "492",
            "pid"  : "482",
            "type" : "2",
            "code" : "152529",
            "name" : "正镶白旗"
        },
        {
            "id"   : "493",
            "pid"  : "482",
            "type" : "2",
            "code" : "152530",
            "name" : "正蓝旗"
        },
        {
            "id"   : "494",
            "pid"  : "482",
            "type" : "2",
            "code" : "152531",
            "name" : "多伦县"
        },
        {
            "id"   : "495",
            "pid"  : "375",
            "type" : "1",
            "code" : "152900",
            "name" : "阿拉善盟"
        },
        {
            "id"   : "496",
            "pid"  : "495",
            "type" : "2",
            "code" : "152921",
            "name" : "阿拉善左旗"
        },
        {
            "id"   : "497",
            "pid"  : "495",
            "type" : "2",
            "code" : "152922",
            "name" : "阿拉善右旗"
        },
        {
            "id"   : "498",
            "pid"  : "495",
            "type" : "2",
            "code" : "152923",
            "name" : "额济纳旗"
        },
        {
            "id"   : "499",
            "pid"  : "0",
            "type" : "0",
            "code" : "210000",
            "name" : "辽宁省"
        },
        {
            "id"   : "500",
            "pid"  : "499",
            "type" : "1",
            "code" : "210100",
            "name" : "沈阳市"
        },
        {
            "id"   : "501",
            "pid"  : "500",
            "type" : "2",
            "code" : "210101",
            "name" : "市辖区"
        },
        {
            "id"   : "502",
            "pid"  : "500",
            "type" : "2",
            "code" : "210102",
            "name" : "和平区"
        },
        {
            "id"   : "503",
            "pid"  : "500",
            "type" : "2",
            "code" : "210103",
            "name" : "沈河区"
        },
        {
            "id"   : "504",
            "pid"  : "500",
            "type" : "2",
            "code" : "210104",
            "name" : "大东区"
        },
        {
            "id"   : "505",
            "pid"  : "500",
            "type" : "2",
            "code" : "210105",
            "name" : "皇姑区"
        },
        {
            "id"   : "506",
            "pid"  : "500",
            "type" : "2",
            "code" : "210106",
            "name" : "铁西区"
        },
        {
            "id"   : "507",
            "pid"  : "500",
            "type" : "2",
            "code" : "210111",
            "name" : "苏家屯区"
        },
        {
            "id"   : "508",
            "pid"  : "500",
            "type" : "2",
            "code" : "210112",
            "name" : "浑南区"
        },
        {
            "id"   : "509",
            "pid"  : "500",
            "type" : "2",
            "code" : "210113",
            "name" : "沈北新区"
        },
        {
            "id"   : "510",
            "pid"  : "500",
            "type" : "2",
            "code" : "210114",
            "name" : "于洪区"
        },
        {
            "id"   : "511",
            "pid"  : "500",
            "type" : "2",
            "code" : "210122",
            "name" : "辽中县"
        },
        {
            "id"   : "512",
            "pid"  : "500",
            "type" : "2",
            "code" : "210123",
            "name" : "康平县"
        },
        {
            "id"   : "513",
            "pid"  : "500",
            "type" : "2",
            "code" : "210124",
            "name" : "法库县"
        },
        {
            "id"   : "514",
            "pid"  : "500",
            "type" : "2",
            "code" : "210181",
            "name" : "新民市"
        },
        {
            "id"   : "515",
            "pid"  : "499",
            "type" : "1",
            "code" : "210200",
            "name" : "大连市"
        },
        {
            "id"   : "516",
            "pid"  : "515",
            "type" : "2",
            "code" : "210201",
            "name" : "市辖区"
        },
        {
            "id"   : "517",
            "pid"  : "515",
            "type" : "2",
            "code" : "210202",
            "name" : "中山区"
        },
        {
            "id"   : "518",
            "pid"  : "515",
            "type" : "2",
            "code" : "210203",
            "name" : "西岗区"
        },
        {
            "id"   : "519",
            "pid"  : "515",
            "type" : "2",
            "code" : "210204",
            "name" : "沙河口区"
        },
        {
            "id"   : "520",
            "pid"  : "515",
            "type" : "2",
            "code" : "210211",
            "name" : "甘井子区"
        },
        {
            "id"   : "521",
            "pid"  : "515",
            "type" : "2",
            "code" : "210212",
            "name" : "旅顺口区"
        },
        {
            "id"   : "522",
            "pid"  : "515",
            "type" : "2",
            "code" : "210213",
            "name" : "金州区"
        },
        {
            "id"   : "523",
            "pid"  : "515",
            "type" : "2",
            "code" : "210224",
            "name" : "长海县"
        },
        {
            "id"   : "524",
            "pid"  : "515",
            "type" : "2",
            "code" : "210281",
            "name" : "瓦房店市"
        },
        {
            "id"   : "525",
            "pid"  : "515",
            "type" : "2",
            "code" : "210282",
            "name" : "普兰店市"
        },
        {
            "id"   : "526",
            "pid"  : "515",
            "type" : "2",
            "code" : "210283",
            "name" : "庄河市"
        },
        {
            "id"   : "527",
            "pid"  : "499",
            "type" : "1",
            "code" : "210300",
            "name" : "鞍山市"
        },
        {
            "id"   : "528",
            "pid"  : "527",
            "type" : "2",
            "code" : "210301",
            "name" : "市辖区"
        },
        {
            "id"   : "529",
            "pid"  : "527",
            "type" : "2",
            "code" : "210302",
            "name" : "铁东区"
        },
        {
            "id"   : "530",
            "pid"  : "527",
            "type" : "2",
            "code" : "210303",
            "name" : "铁西区"
        },
        {
            "id"   : "531",
            "pid"  : "527",
            "type" : "2",
            "code" : "210304",
            "name" : "立山区"
        },
        {
            "id"   : "532",
            "pid"  : "527",
            "type" : "2",
            "code" : "210311",
            "name" : "千山区"
        },
        {
            "id"   : "533",
            "pid"  : "527",
            "type" : "2",
            "code" : "210321",
            "name" : "台安县"
        },
        {
            "id"   : "534",
            "pid"  : "527",
            "type" : "2",
            "code" : "210323",
            "name" : "岫岩满族自治县"
        },
        {
            "id"   : "535",
            "pid"  : "527",
            "type" : "2",
            "code" : "210381",
            "name" : "海城市"
        },
        {
            "id"   : "536",
            "pid"  : "499",
            "type" : "1",
            "code" : "210400",
            "name" : "抚顺市"
        },
        {
            "id"   : "537",
            "pid"  : "536",
            "type" : "2",
            "code" : "210401",
            "name" : "市辖区"
        },
        {
            "id"   : "538",
            "pid"  : "536",
            "type" : "2",
            "code" : "210402",
            "name" : "新抚区"
        },
        {
            "id"   : "539",
            "pid"  : "536",
            "type" : "2",
            "code" : "210403",
            "name" : "东洲区"
        },
        {
            "id"   : "540",
            "pid"  : "536",
            "type" : "2",
            "code" : "210404",
            "name" : "望花区"
        },
        {
            "id"   : "541",
            "pid"  : "536",
            "type" : "2",
            "code" : "210411",
            "name" : "顺城区"
        },
        {
            "id"   : "542",
            "pid"  : "536",
            "type" : "2",
            "code" : "210421",
            "name" : "抚顺县"
        },
        {
            "id"   : "543",
            "pid"  : "536",
            "type" : "2",
            "code" : "210422",
            "name" : "新宾满族自治县"
        },
        {
            "id"   : "544",
            "pid"  : "536",
            "type" : "2",
            "code" : "210423",
            "name" : "清原满族自治县"
        },
        {
            "id"   : "545",
            "pid"  : "499",
            "type" : "1",
            "code" : "210500",
            "name" : "本溪市"
        },
        {
            "id"   : "546",
            "pid"  : "545",
            "type" : "2",
            "code" : "210501",
            "name" : "市辖区"
        },
        {
            "id"   : "547",
            "pid"  : "545",
            "type" : "2",
            "code" : "210502",
            "name" : "平山区"
        },
        {
            "id"   : "548",
            "pid"  : "545",
            "type" : "2",
            "code" : "210503",
            "name" : "溪湖区"
        },
        {
            "id"   : "549",
            "pid"  : "545",
            "type" : "2",
            "code" : "210504",
            "name" : "明山区"
        },
        {
            "id"   : "550",
            "pid"  : "545",
            "type" : "2",
            "code" : "210505",
            "name" : "南芬区"
        },
        {
            "id"   : "551",
            "pid"  : "545",
            "type" : "2",
            "code" : "210521",
            "name" : "本溪满族自治县"
        },
        {
            "id"   : "552",
            "pid"  : "545",
            "type" : "2",
            "code" : "210522",
            "name" : "桓仁满族自治县"
        },
        {
            "id"   : "553",
            "pid"  : "499",
            "type" : "1",
            "code" : "210600",
            "name" : "丹东市"
        },
        {
            "id"   : "554",
            "pid"  : "553",
            "type" : "2",
            "code" : "210601",
            "name" : "市辖区"
        },
        {
            "id"   : "555",
            "pid"  : "553",
            "type" : "2",
            "code" : "210602",
            "name" : "元宝区"
        },
        {
            "id"   : "556",
            "pid"  : "553",
            "type" : "2",
            "code" : "210603",
            "name" : "振兴区"
        },
        {
            "id"   : "557",
            "pid"  : "553",
            "type" : "2",
            "code" : "210604",
            "name" : "振安区"
        },
        {
            "id"   : "558",
            "pid"  : "553",
            "type" : "2",
            "code" : "210624",
            "name" : "宽甸满族自治县"
        },
        {
            "id"   : "559",
            "pid"  : "553",
            "type" : "2",
            "code" : "210681",
            "name" : "东港市"
        },
        {
            "id"   : "560",
            "pid"  : "553",
            "type" : "2",
            "code" : "210682",
            "name" : "凤城市"
        },
        {
            "id"   : "561",
            "pid"  : "499",
            "type" : "1",
            "code" : "210700",
            "name" : "锦州市"
        },
        {
            "id"   : "562",
            "pid"  : "561",
            "type" : "2",
            "code" : "210701",
            "name" : "市辖区"
        },
        {
            "id"   : "563",
            "pid"  : "561",
            "type" : "2",
            "code" : "210702",
            "name" : "古塔区"
        },
        {
            "id"   : "564",
            "pid"  : "561",
            "type" : "2",
            "code" : "210703",
            "name" : "凌河区"
        },
        {
            "id"   : "565",
            "pid"  : "561",
            "type" : "2",
            "code" : "210711",
            "name" : "太和区"
        },
        {
            "id"   : "566",
            "pid"  : "561",
            "type" : "2",
            "code" : "210726",
            "name" : "黑山县"
        },
        {
            "id"   : "567",
            "pid"  : "561",
            "type" : "2",
            "code" : "210727",
            "name" : "义县"
        },
        {
            "id"   : "568",
            "pid"  : "561",
            "type" : "2",
            "code" : "210781",
            "name" : "凌海市"
        },
        {
            "id"   : "569",
            "pid"  : "561",
            "type" : "2",
            "code" : "210782",
            "name" : "北镇市"
        },
        {
            "id"   : "570",
            "pid"  : "499",
            "type" : "1",
            "code" : "210800",
            "name" : "营口市"
        },
        {
            "id"   : "571",
            "pid"  : "570",
            "type" : "2",
            "code" : "210801",
            "name" : "市辖区"
        },
        {
            "id"   : "572",
            "pid"  : "570",
            "type" : "2",
            "code" : "210802",
            "name" : "站前区"
        },
        {
            "id"   : "573",
            "pid"  : "570",
            "type" : "2",
            "code" : "210803",
            "name" : "西市区"
        },
        {
            "id"   : "574",
            "pid"  : "570",
            "type" : "2",
            "code" : "210804",
            "name" : "鲅鱼圈区"
        },
        {
            "id"   : "575",
            "pid"  : "570",
            "type" : "2",
            "code" : "210811",
            "name" : "老边区"
        },
        {
            "id"   : "576",
            "pid"  : "570",
            "type" : "2",
            "code" : "210881",
            "name" : "盖州市"
        },
        {
            "id"   : "577",
            "pid"  : "570",
            "type" : "2",
            "code" : "210882",
            "name" : "大石桥市"
        },
        {
            "id"   : "578",
            "pid"  : "499",
            "type" : "1",
            "code" : "210900",
            "name" : "阜新市"
        },
        {
            "id"   : "579",
            "pid"  : "578",
            "type" : "2",
            "code" : "210901",
            "name" : "市辖区"
        },
        {
            "id"   : "580",
            "pid"  : "578",
            "type" : "2",
            "code" : "210902",
            "name" : "海州区"
        },
        {
            "id"   : "581",
            "pid"  : "578",
            "type" : "2",
            "code" : "210903",
            "name" : "新邱区"
        },
        {
            "id"   : "582",
            "pid"  : "578",
            "type" : "2",
            "code" : "210904",
            "name" : "太平区"
        },
        {
            "id"   : "583",
            "pid"  : "578",
            "type" : "2",
            "code" : "210905",
            "name" : "清河门区"
        },
        {
            "id"   : "584",
            "pid"  : "578",
            "type" : "2",
            "code" : "210911",
            "name" : "细河区"
        },
        {
            "id"   : "585",
            "pid"  : "578",
            "type" : "2",
            "code" : "210921",
            "name" : "阜新蒙古族自治县"
        },
        {
            "id"   : "586",
            "pid"  : "578",
            "type" : "2",
            "code" : "210922",
            "name" : "彰武县"
        },
        {
            "id"   : "587",
            "pid"  : "499",
            "type" : "1",
            "code" : "211000",
            "name" : "辽阳市"
        },
        {
            "id"   : "588",
            "pid"  : "587",
            "type" : "2",
            "code" : "211001",
            "name" : "市辖区"
        },
        {
            "id"   : "589",
            "pid"  : "587",
            "type" : "2",
            "code" : "211002",
            "name" : "白塔区"
        },
        {
            "id"   : "590",
            "pid"  : "587",
            "type" : "2",
            "code" : "211003",
            "name" : "文圣区"
        },
        {
            "id"   : "591",
            "pid"  : "587",
            "type" : "2",
            "code" : "211004",
            "name" : "宏伟区"
        },
        {
            "id"   : "592",
            "pid"  : "587",
            "type" : "2",
            "code" : "211005",
            "name" : "弓长岭区"
        },
        {
            "id"   : "593",
            "pid"  : "587",
            "type" : "2",
            "code" : "211011",
            "name" : "太子河区"
        },
        {
            "id"   : "594",
            "pid"  : "587",
            "type" : "2",
            "code" : "211021",
            "name" : "辽阳县"
        },
        {
            "id"   : "595",
            "pid"  : "587",
            "type" : "2",
            "code" : "211081",
            "name" : "灯塔市"
        },
        {
            "id"   : "596",
            "pid"  : "499",
            "type" : "1",
            "code" : "211100",
            "name" : "盘锦市"
        },
        {
            "id"   : "597",
            "pid"  : "596",
            "type" : "2",
            "code" : "211101",
            "name" : "市辖区"
        },
        {
            "id"   : "598",
            "pid"  : "596",
            "type" : "2",
            "code" : "211102",
            "name" : "双台子区"
        },
        {
            "id"   : "599",
            "pid"  : "596",
            "type" : "2",
            "code" : "211103",
            "name" : "兴隆台区"
        },
        {
            "id"   : "600",
            "pid"  : "596",
            "type" : "2",
            "code" : "211121",
            "name" : "大洼县"
        },
        {
            "id"   : "601",
            "pid"  : "596",
            "type" : "2",
            "code" : "211122",
            "name" : "盘山县"
        },
        {
            "id"   : "602",
            "pid"  : "499",
            "type" : "1",
            "code" : "211200",
            "name" : "铁岭市"
        },
        {
            "id"   : "603",
            "pid"  : "602",
            "type" : "2",
            "code" : "211201",
            "name" : "市辖区"
        },
        {
            "id"   : "604",
            "pid"  : "602",
            "type" : "2",
            "code" : "211202",
            "name" : "银州区"
        },
        {
            "id"   : "605",
            "pid"  : "602",
            "type" : "2",
            "code" : "211204",
            "name" : "清河区"
        },
        {
            "id"   : "606",
            "pid"  : "602",
            "type" : "2",
            "code" : "211221",
            "name" : "铁岭县"
        },
        {
            "id"   : "607",
            "pid"  : "602",
            "type" : "2",
            "code" : "211223",
            "name" : "西丰县"
        },
        {
            "id"   : "608",
            "pid"  : "602",
            "type" : "2",
            "code" : "211224",
            "name" : "昌图县"
        },
        {
            "id"   : "609",
            "pid"  : "602",
            "type" : "2",
            "code" : "211281",
            "name" : "调兵山市"
        },
        {
            "id"   : "610",
            "pid"  : "602",
            "type" : "2",
            "code" : "211282",
            "name" : "开原市"
        },
        {
            "id"   : "611",
            "pid"  : "499",
            "type" : "1",
            "code" : "211300",
            "name" : "朝阳市"
        },
        {
            "id"   : "612",
            "pid"  : "611",
            "type" : "2",
            "code" : "211301",
            "name" : "市辖区"
        },
        {
            "id"   : "613",
            "pid"  : "611",
            "type" : "2",
            "code" : "211302",
            "name" : "双塔区"
        },
        {
            "id"   : "614",
            "pid"  : "611",
            "type" : "2",
            "code" : "211303",
            "name" : "龙城区"
        },
        {
            "id"   : "615",
            "pid"  : "611",
            "type" : "2",
            "code" : "211321",
            "name" : "朝阳县"
        },
        {
            "id"   : "616",
            "pid"  : "611",
            "type" : "2",
            "code" : "211322",
            "name" : "建平县"
        },
        {
            "id"   : "617",
            "pid"  : "611",
            "type" : "2",
            "code" : "211324",
            "name" : "喀喇沁左翼蒙古族自治县"
        },
        {
            "id"   : "618",
            "pid"  : "611",
            "type" : "2",
            "code" : "211381",
            "name" : "北票市"
        },
        {
            "id"   : "619",
            "pid"  : "611",
            "type" : "2",
            "code" : "211382",
            "name" : "凌源市"
        },
        {
            "id"   : "620",
            "pid"  : "499",
            "type" : "1",
            "code" : "211400",
            "name" : "葫芦岛市"
        },
        {
            "id"   : "621",
            "pid"  : "620",
            "type" : "2",
            "code" : "211401",
            "name" : "市辖区"
        },
        {
            "id"   : "622",
            "pid"  : "620",
            "type" : "2",
            "code" : "211402",
            "name" : "连山区"
        },
        {
            "id"   : "623",
            "pid"  : "620",
            "type" : "2",
            "code" : "211403",
            "name" : "龙港区"
        },
        {
            "id"   : "624",
            "pid"  : "620",
            "type" : "2",
            "code" : "211404",
            "name" : "南票区"
        },
        {
            "id"   : "625",
            "pid"  : "620",
            "type" : "2",
            "code" : "211421",
            "name" : "绥中县"
        },
        {
            "id"   : "626",
            "pid"  : "620",
            "type" : "2",
            "code" : "211422",
            "name" : "建昌县"
        },
        {
            "id"   : "627",
            "pid"  : "620",
            "type" : "2",
            "code" : "211481",
            "name" : "兴城市"
        },
        {
            "id"   : "628",
            "pid"  : "0",
            "type" : "0",
            "code" : "220000",
            "name" : "吉林省"
        },
        {
            "id"   : "629",
            "pid"  : "628",
            "type" : "1",
            "code" : "220100",
            "name" : "长春市"
        },
        {
            "id"   : "630",
            "pid"  : "629",
            "type" : "2",
            "code" : "220101",
            "name" : "市辖区"
        },
        {
            "id"   : "631",
            "pid"  : "629",
            "type" : "2",
            "code" : "220102",
            "name" : "南关区"
        },
        {
            "id"   : "632",
            "pid"  : "629",
            "type" : "2",
            "code" : "220103",
            "name" : "宽城区"
        },
        {
            "id"   : "633",
            "pid"  : "629",
            "type" : "2",
            "code" : "220104",
            "name" : "朝阳区"
        },
        {
            "id"   : "634",
            "pid"  : "629",
            "type" : "2",
            "code" : "220105",
            "name" : "二道区"
        },
        {
            "id"   : "635",
            "pid"  : "629",
            "type" : "2",
            "code" : "220106",
            "name" : "绿园区"
        },
        {
            "id"   : "636",
            "pid"  : "629",
            "type" : "2",
            "code" : "220112",
            "name" : "双阳区"
        },
        {
            "id"   : "637",
            "pid"  : "629",
            "type" : "2",
            "code" : "220113",
            "name" : "九台区"
        },
        {
            "id"   : "638",
            "pid"  : "629",
            "type" : "2",
            "code" : "220122",
            "name" : "农安县"
        },
        {
            "id"   : "639",
            "pid"  : "629",
            "type" : "2",
            "code" : "220182",
            "name" : "榆树市"
        },
        {
            "id"   : "640",
            "pid"  : "629",
            "type" : "2",
            "code" : "220183",
            "name" : "德惠市"
        },
        {
            "id"   : "641",
            "pid"  : "628",
            "type" : "1",
            "code" : "220200",
            "name" : "吉林市"
        },
        {
            "id"   : "642",
            "pid"  : "641",
            "type" : "2",
            "code" : "220201",
            "name" : "市辖区"
        },
        {
            "id"   : "643",
            "pid"  : "641",
            "type" : "2",
            "code" : "220202",
            "name" : "昌邑区"
        },
        {
            "id"   : "644",
            "pid"  : "641",
            "type" : "2",
            "code" : "220203",
            "name" : "龙潭区"
        },
        {
            "id"   : "645",
            "pid"  : "641",
            "type" : "2",
            "code" : "220204",
            "name" : "船营区"
        },
        {
            "id"   : "646",
            "pid"  : "641",
            "type" : "2",
            "code" : "220211",
            "name" : "丰满区"
        },
        {
            "id"   : "647",
            "pid"  : "641",
            "type" : "2",
            "code" : "220221",
            "name" : "永吉县"
        },
        {
            "id"   : "648",
            "pid"  : "641",
            "type" : "2",
            "code" : "220281",
            "name" : "蛟河市"
        },
        {
            "id"   : "649",
            "pid"  : "641",
            "type" : "2",
            "code" : "220282",
            "name" : "桦甸市"
        },
        {
            "id"   : "650",
            "pid"  : "641",
            "type" : "2",
            "code" : "220283",
            "name" : "舒兰市"
        },
        {
            "id"   : "651",
            "pid"  : "641",
            "type" : "2",
            "code" : "220284",
            "name" : "磐石市"
        },
        {
            "id"   : "652",
            "pid"  : "628",
            "type" : "1",
            "code" : "220300",
            "name" : "四平市"
        },
        {
            "id"   : "653",
            "pid"  : "652",
            "type" : "2",
            "code" : "220301",
            "name" : "市辖区"
        },
        {
            "id"   : "654",
            "pid"  : "652",
            "type" : "2",
            "code" : "220302",
            "name" : "铁西区"
        },
        {
            "id"   : "655",
            "pid"  : "652",
            "type" : "2",
            "code" : "220303",
            "name" : "铁东区"
        },
        {
            "id"   : "656",
            "pid"  : "652",
            "type" : "2",
            "code" : "220322",
            "name" : "梨树县"
        },
        {
            "id"   : "657",
            "pid"  : "652",
            "type" : "2",
            "code" : "220323",
            "name" : "伊通满族自治县"
        },
        {
            "id"   : "658",
            "pid"  : "652",
            "type" : "2",
            "code" : "220381",
            "name" : "公主岭市"
        },
        {
            "id"   : "659",
            "pid"  : "652",
            "type" : "2",
            "code" : "220382",
            "name" : "双辽市"
        },
        {
            "id"   : "660",
            "pid"  : "628",
            "type" : "1",
            "code" : "220400",
            "name" : "辽源市"
        },
        {
            "id"   : "661",
            "pid"  : "660",
            "type" : "2",
            "code" : "220401",
            "name" : "市辖区"
        },
        {
            "id"   : "662",
            "pid"  : "660",
            "type" : "2",
            "code" : "220402",
            "name" : "龙山区"
        },
        {
            "id"   : "663",
            "pid"  : "660",
            "type" : "2",
            "code" : "220403",
            "name" : "西安区"
        },
        {
            "id"   : "664",
            "pid"  : "660",
            "type" : "2",
            "code" : "220421",
            "name" : "东丰县"
        },
        {
            "id"   : "665",
            "pid"  : "660",
            "type" : "2",
            "code" : "220422",
            "name" : "东辽县"
        },
        {
            "id"   : "666",
            "pid"  : "628",
            "type" : "1",
            "code" : "220500",
            "name" : "通化市"
        },
        {
            "id"   : "667",
            "pid"  : "666",
            "type" : "2",
            "code" : "220501",
            "name" : "市辖区"
        },
        {
            "id"   : "668",
            "pid"  : "666",
            "type" : "2",
            "code" : "220502",
            "name" : "东昌区"
        },
        {
            "id"   : "669",
            "pid"  : "666",
            "type" : "2",
            "code" : "220503",
            "name" : "二道江区"
        },
        {
            "id"   : "670",
            "pid"  : "666",
            "type" : "2",
            "code" : "220521",
            "name" : "通化县"
        },
        {
            "id"   : "671",
            "pid"  : "666",
            "type" : "2",
            "code" : "220523",
            "name" : "辉南县"
        },
        {
            "id"   : "672",
            "pid"  : "666",
            "type" : "2",
            "code" : "220524",
            "name" : "柳河县"
        },
        {
            "id"   : "673",
            "pid"  : "666",
            "type" : "2",
            "code" : "220581",
            "name" : "梅河口市"
        },
        {
            "id"   : "674",
            "pid"  : "666",
            "type" : "2",
            "code" : "220582",
            "name" : "集安市"
        },
        {
            "id"   : "675",
            "pid"  : "628",
            "type" : "1",
            "code" : "220600",
            "name" : "白山市"
        },
        {
            "id"   : "676",
            "pid"  : "675",
            "type" : "2",
            "code" : "220601",
            "name" : "市辖区"
        },
        {
            "id"   : "677",
            "pid"  : "675",
            "type" : "2",
            "code" : "220602",
            "name" : "浑江区"
        },
        {
            "id"   : "678",
            "pid"  : "675",
            "type" : "2",
            "code" : "220605",
            "name" : "江源区"
        },
        {
            "id"   : "679",
            "pid"  : "675",
            "type" : "2",
            "code" : "220621",
            "name" : "抚松县"
        },
        {
            "id"   : "680",
            "pid"  : "675",
            "type" : "2",
            "code" : "220622",
            "name" : "靖宇县"
        },
        {
            "id"   : "681",
            "pid"  : "675",
            "type" : "2",
            "code" : "220623",
            "name" : "长白朝鲜族自治县"
        },
        {
            "id"   : "682",
            "pid"  : "675",
            "type" : "2",
            "code" : "220681",
            "name" : "临江市"
        },
        {
            "id"   : "683",
            "pid"  : "628",
            "type" : "1",
            "code" : "220700",
            "name" : "松原市"
        },
        {
            "id"   : "684",
            "pid"  : "683",
            "type" : "2",
            "code" : "220701",
            "name" : "市辖区"
        },
        {
            "id"   : "685",
            "pid"  : "683",
            "type" : "2",
            "code" : "220702",
            "name" : "宁江区"
        },
        {
            "id"   : "686",
            "pid"  : "683",
            "type" : "2",
            "code" : "220721",
            "name" : "前郭尔罗斯蒙古族自治县"
        },
        {
            "id"   : "687",
            "pid"  : "683",
            "type" : "2",
            "code" : "220722",
            "name" : "长岭县"
        },
        {
            "id"   : "688",
            "pid"  : "683",
            "type" : "2",
            "code" : "220723",
            "name" : "乾安县"
        },
        {
            "id"   : "689",
            "pid"  : "683",
            "type" : "2",
            "code" : "220781",
            "name" : "扶余市"
        },
        {
            "id"   : "690",
            "pid"  : "628",
            "type" : "1",
            "code" : "220800",
            "name" : "白城市"
        },
        {
            "id"   : "691",
            "pid"  : "690",
            "type" : "2",
            "code" : "220801",
            "name" : "市辖区"
        },
        {
            "id"   : "692",
            "pid"  : "690",
            "type" : "2",
            "code" : "220802",
            "name" : "洮北区"
        },
        {
            "id"   : "693",
            "pid"  : "690",
            "type" : "2",
            "code" : "220821",
            "name" : "镇赉县"
        },
        {
            "id"   : "694",
            "pid"  : "690",
            "type" : "2",
            "code" : "220822",
            "name" : "通榆县"
        },
        {
            "id"   : "695",
            "pid"  : "690",
            "type" : "2",
            "code" : "220881",
            "name" : "洮南市"
        },
        {
            "id"   : "696",
            "pid"  : "690",
            "type" : "2",
            "code" : "220882",
            "name" : "大安市"
        },
        {
            "id"   : "697",
            "pid"  : "628",
            "type" : "1",
            "code" : "222400",
            "name" : "延边朝鲜族自治州"
        },
        {
            "id"   : "698",
            "pid"  : "697",
            "type" : "2",
            "code" : "222401",
            "name" : "延吉市"
        },
        {
            "id"   : "699",
            "pid"  : "697",
            "type" : "2",
            "code" : "222402",
            "name" : "图们市"
        },
        {
            "id"   : "700",
            "pid"  : "697",
            "type" : "2",
            "code" : "222403",
            "name" : "敦化市"
        },
        {
            "id"   : "701",
            "pid"  : "697",
            "type" : "2",
            "code" : "222404",
            "name" : "珲春市"
        },
        {
            "id"   : "702",
            "pid"  : "697",
            "type" : "2",
            "code" : "222405",
            "name" : "龙井市"
        },
        {
            "id"   : "703",
            "pid"  : "697",
            "type" : "2",
            "code" : "222406",
            "name" : "和龙市"
        },
        {
            "id"   : "704",
            "pid"  : "697",
            "type" : "2",
            "code" : "222424",
            "name" : "汪清县"
        },
        {
            "id"   : "705",
            "pid"  : "697",
            "type" : "2",
            "code" : "222426",
            "name" : "安图县"
        },
        {
            "id"   : "706",
            "pid"  : "0",
            "type" : "0",
            "code" : "230000",
            "name" : "黑龙江省"
        },
        {
            "id"   : "707",
            "pid"  : "706",
            "type" : "1",
            "code" : "230100",
            "name" : "哈尔滨市"
        },
        {
            "id"   : "708",
            "pid"  : "707",
            "type" : "2",
            "code" : "230101",
            "name" : "市辖区"
        },
        {
            "id"   : "709",
            "pid"  : "707",
            "type" : "2",
            "code" : "230102",
            "name" : "道里区"
        },
        {
            "id"   : "710",
            "pid"  : "707",
            "type" : "2",
            "code" : "230103",
            "name" : "南岗区"
        },
        {
            "id"   : "711",
            "pid"  : "707",
            "type" : "2",
            "code" : "230104",
            "name" : "道外区"
        },
        {
            "id"   : "712",
            "pid"  : "707",
            "type" : "2",
            "code" : "230108",
            "name" : "平房区"
        },
        {
            "id"   : "713",
            "pid"  : "707",
            "type" : "2",
            "code" : "230109",
            "name" : "松北区"
        },
        {
            "id"   : "714",
            "pid"  : "707",
            "type" : "2",
            "code" : "230110",
            "name" : "香坊区"
        },
        {
            "id"   : "715",
            "pid"  : "707",
            "type" : "2",
            "code" : "230111",
            "name" : "呼兰区"
        },
        {
            "id"   : "716",
            "pid"  : "707",
            "type" : "2",
            "code" : "230112",
            "name" : "阿城区"
        },
        {
            "id"   : "717",
            "pid"  : "707",
            "type" : "2",
            "code" : "230123",
            "name" : "依兰县"
        },
        {
            "id"   : "718",
            "pid"  : "707",
            "type" : "2",
            "code" : "230124",
            "name" : "方正县"
        },
        {
            "id"   : "719",
            "pid"  : "707",
            "type" : "2",
            "code" : "230125",
            "name" : "宾县"
        },
        {
            "id"   : "720",
            "pid"  : "707",
            "type" : "2",
            "code" : "230126",
            "name" : "巴彦县"
        },
        {
            "id"   : "721",
            "pid"  : "707",
            "type" : "2",
            "code" : "230127",
            "name" : "木兰县"
        },
        {
            "id"   : "722",
            "pid"  : "707",
            "type" : "2",
            "code" : "230128",
            "name" : "通河县"
        },
        {
            "id"   : "723",
            "pid"  : "707",
            "type" : "2",
            "code" : "230129",
            "name" : "延寿县"
        },
        {
            "id"   : "724",
            "pid"  : "707",
            "type" : "2",
            "code" : "230182",
            "name" : "双城市"
        },
        {
            "id"   : "725",
            "pid"  : "707",
            "type" : "2",
            "code" : "230183",
            "name" : "尚志市"
        },
        {
            "id"   : "726",
            "pid"  : "707",
            "type" : "2",
            "code" : "230184",
            "name" : "五常市"
        },
        {
            "id"   : "727",
            "pid"  : "706",
            "type" : "1",
            "code" : "230200",
            "name" : "齐齐哈尔市"
        },
        {
            "id"   : "728",
            "pid"  : "727",
            "type" : "2",
            "code" : "230201",
            "name" : "市辖区"
        },
        {
            "id"   : "729",
            "pid"  : "727",
            "type" : "2",
            "code" : "230202",
            "name" : "龙沙区"
        },
        {
            "id"   : "730",
            "pid"  : "727",
            "type" : "2",
            "code" : "230203",
            "name" : "建华区"
        },
        {
            "id"   : "731",
            "pid"  : "727",
            "type" : "2",
            "code" : "230204",
            "name" : "铁锋区"
        },
        {
            "id"   : "732",
            "pid"  : "727",
            "type" : "2",
            "code" : "230205",
            "name" : "昂昂溪区"
        },
        {
            "id"   : "733",
            "pid"  : "727",
            "type" : "2",
            "code" : "230206",
            "name" : "富拉尔基区"
        },
        {
            "id"   : "734",
            "pid"  : "727",
            "type" : "2",
            "code" : "230207",
            "name" : "碾子山区"
        },
        {
            "id"   : "735",
            "pid"  : "727",
            "type" : "2",
            "code" : "230208",
            "name" : "梅里斯达斡尔族区"
        },
        {
            "id"   : "736",
            "pid"  : "727",
            "type" : "2",
            "code" : "230221",
            "name" : "龙江县"
        },
        {
            "id"   : "737",
            "pid"  : "727",
            "type" : "2",
            "code" : "230223",
            "name" : "依安县"
        },
        {
            "id"   : "738",
            "pid"  : "727",
            "type" : "2",
            "code" : "230224",
            "name" : "泰来县"
        },
        {
            "id"   : "739",
            "pid"  : "727",
            "type" : "2",
            "code" : "230225",
            "name" : "甘南县"
        },
        {
            "id"   : "740",
            "pid"  : "727",
            "type" : "2",
            "code" : "230227",
            "name" : "富裕县"
        },
        {
            "id"   : "741",
            "pid"  : "727",
            "type" : "2",
            "code" : "230229",
            "name" : "克山县"
        },
        {
            "id"   : "742",
            "pid"  : "727",
            "type" : "2",
            "code" : "230230",
            "name" : "克东县"
        },
        {
            "id"   : "743",
            "pid"  : "727",
            "type" : "2",
            "code" : "230231",
            "name" : "拜泉县"
        },
        {
            "id"   : "744",
            "pid"  : "727",
            "type" : "2",
            "code" : "230281",
            "name" : "讷河市"
        },
        {
            "id"   : "745",
            "pid"  : "706",
            "type" : "1",
            "code" : "230300",
            "name" : "鸡西市"
        },
        {
            "id"   : "746",
            "pid"  : "745",
            "type" : "2",
            "code" : "230301",
            "name" : "市辖区"
        },
        {
            "id"   : "747",
            "pid"  : "745",
            "type" : "2",
            "code" : "230302",
            "name" : "鸡冠区"
        },
        {
            "id"   : "748",
            "pid"  : "745",
            "type" : "2",
            "code" : "230303",
            "name" : "恒山区"
        },
        {
            "id"   : "749",
            "pid"  : "745",
            "type" : "2",
            "code" : "230304",
            "name" : "滴道区"
        },
        {
            "id"   : "750",
            "pid"  : "745",
            "type" : "2",
            "code" : "230305",
            "name" : "梨树区"
        },
        {
            "id"   : "751",
            "pid"  : "745",
            "type" : "2",
            "code" : "230306",
            "name" : "城子河区"
        },
        {
            "id"   : "752",
            "pid"  : "745",
            "type" : "2",
            "code" : "230307",
            "name" : "麻山区"
        },
        {
            "id"   : "753",
            "pid"  : "745",
            "type" : "2",
            "code" : "230321",
            "name" : "鸡东县"
        },
        {
            "id"   : "754",
            "pid"  : "745",
            "type" : "2",
            "code" : "230381",
            "name" : "虎林市"
        },
        {
            "id"   : "755",
            "pid"  : "745",
            "type" : "2",
            "code" : "230382",
            "name" : "密山市"
        },
        {
            "id"   : "756",
            "pid"  : "706",
            "type" : "1",
            "code" : "230400",
            "name" : "鹤岗市"
        },
        {
            "id"   : "757",
            "pid"  : "756",
            "type" : "2",
            "code" : "230401",
            "name" : "市辖区"
        },
        {
            "id"   : "758",
            "pid"  : "756",
            "type" : "2",
            "code" : "230402",
            "name" : "向阳区"
        },
        {
            "id"   : "759",
            "pid"  : "756",
            "type" : "2",
            "code" : "230403",
            "name" : "工农区"
        },
        {
            "id"   : "760",
            "pid"  : "756",
            "type" : "2",
            "code" : "230404",
            "name" : "南山区"
        },
        {
            "id"   : "761",
            "pid"  : "756",
            "type" : "2",
            "code" : "230405",
            "name" : "兴安区"
        },
        {
            "id"   : "762",
            "pid"  : "756",
            "type" : "2",
            "code" : "230406",
            "name" : "东山区"
        },
        {
            "id"   : "763",
            "pid"  : "756",
            "type" : "2",
            "code" : "230407",
            "name" : "兴山区"
        },
        {
            "id"   : "764",
            "pid"  : "756",
            "type" : "2",
            "code" : "230421",
            "name" : "萝北县"
        },
        {
            "id"   : "765",
            "pid"  : "756",
            "type" : "2",
            "code" : "230422",
            "name" : "绥滨县"
        },
        {
            "id"   : "766",
            "pid"  : "706",
            "type" : "1",
            "code" : "230500",
            "name" : "双鸭山市"
        },
        {
            "id"   : "767",
            "pid"  : "766",
            "type" : "2",
            "code" : "230501",
            "name" : "市辖区"
        },
        {
            "id"   : "768",
            "pid"  : "766",
            "type" : "2",
            "code" : "230502",
            "name" : "尖山区"
        },
        {
            "id"   : "769",
            "pid"  : "766",
            "type" : "2",
            "code" : "230503",
            "name" : "岭东区"
        },
        {
            "id"   : "770",
            "pid"  : "766",
            "type" : "2",
            "code" : "230505",
            "name" : "四方台区"
        },
        {
            "id"   : "771",
            "pid"  : "766",
            "type" : "2",
            "code" : "230506",
            "name" : "宝山区"
        },
        {
            "id"   : "772",
            "pid"  : "766",
            "type" : "2",
            "code" : "230521",
            "name" : "集贤县"
        },
        {
            "id"   : "773",
            "pid"  : "766",
            "type" : "2",
            "code" : "230522",
            "name" : "友谊县"
        },
        {
            "id"   : "774",
            "pid"  : "766",
            "type" : "2",
            "code" : "230523",
            "name" : "宝清县"
        },
        {
            "id"   : "775",
            "pid"  : "766",
            "type" : "2",
            "code" : "230524",
            "name" : "饶河县"
        },
        {
            "id"   : "776",
            "pid"  : "706",
            "type" : "1",
            "code" : "230600",
            "name" : "大庆市"
        },
        {
            "id"   : "777",
            "pid"  : "776",
            "type" : "2",
            "code" : "230601",
            "name" : "市辖区"
        },
        {
            "id"   : "778",
            "pid"  : "776",
            "type" : "2",
            "code" : "230602",
            "name" : "萨尔图区"
        },
        {
            "id"   : "779",
            "pid"  : "776",
            "type" : "2",
            "code" : "230603",
            "name" : "龙凤区"
        },
        {
            "id"   : "780",
            "pid"  : "776",
            "type" : "2",
            "code" : "230604",
            "name" : "让胡路区"
        },
        {
            "id"   : "781",
            "pid"  : "776",
            "type" : "2",
            "code" : "230605",
            "name" : "红岗区"
        },
        {
            "id"   : "782",
            "pid"  : "776",
            "type" : "2",
            "code" : "230606",
            "name" : "大同区"
        },
        {
            "id"   : "783",
            "pid"  : "776",
            "type" : "2",
            "code" : "230621",
            "name" : "肇州县"
        },
        {
            "id"   : "784",
            "pid"  : "776",
            "type" : "2",
            "code" : "230622",
            "name" : "肇源县"
        },
        {
            "id"   : "785",
            "pid"  : "776",
            "type" : "2",
            "code" : "230623",
            "name" : "林甸县"
        },
        {
            "id"   : "786",
            "pid"  : "776",
            "type" : "2",
            "code" : "230624",
            "name" : "杜尔伯特蒙古族自治县"
        },
        {
            "id"   : "787",
            "pid"  : "706",
            "type" : "1",
            "code" : "230700",
            "name" : "伊春市"
        },
        {
            "id"   : "788",
            "pid"  : "787",
            "type" : "2",
            "code" : "230701",
            "name" : "市辖区"
        },
        {
            "id"   : "789",
            "pid"  : "787",
            "type" : "2",
            "code" : "230702",
            "name" : "伊春区"
        },
        {
            "id"   : "790",
            "pid"  : "787",
            "type" : "2",
            "code" : "230703",
            "name" : "南岔区"
        },
        {
            "id"   : "791",
            "pid"  : "787",
            "type" : "2",
            "code" : "230704",
            "name" : "友好区"
        },
        {
            "id"   : "792",
            "pid"  : "787",
            "type" : "2",
            "code" : "230705",
            "name" : "西林区"
        },
        {
            "id"   : "793",
            "pid"  : "787",
            "type" : "2",
            "code" : "230706",
            "name" : "翠峦区"
        },
        {
            "id"   : "794",
            "pid"  : "787",
            "type" : "2",
            "code" : "230707",
            "name" : "新青区"
        },
        {
            "id"   : "795",
            "pid"  : "787",
            "type" : "2",
            "code" : "230708",
            "name" : "美溪区"
        },
        {
            "id"   : "796",
            "pid"  : "787",
            "type" : "2",
            "code" : "230709",
            "name" : "金山屯区"
        },
        {
            "id"   : "797",
            "pid"  : "787",
            "type" : "2",
            "code" : "230710",
            "name" : "五营区"
        },
        {
            "id"   : "798",
            "pid"  : "787",
            "type" : "2",
            "code" : "230711",
            "name" : "乌马河区"
        },
        {
            "id"   : "799",
            "pid"  : "787",
            "type" : "2",
            "code" : "230712",
            "name" : "汤旺河区"
        },
        {
            "id"   : "800",
            "pid"  : "787",
            "type" : "2",
            "code" : "230713",
            "name" : "带岭区"
        },
        {
            "id"   : "801",
            "pid"  : "787",
            "type" : "2",
            "code" : "230714",
            "name" : "乌伊岭区"
        },
        {
            "id"   : "802",
            "pid"  : "787",
            "type" : "2",
            "code" : "230715",
            "name" : "红星区"
        },
        {
            "id"   : "803",
            "pid"  : "787",
            "type" : "2",
            "code" : "230716",
            "name" : "上甘岭区"
        },
        {
            "id"   : "804",
            "pid"  : "787",
            "type" : "2",
            "code" : "230722",
            "name" : "嘉荫县"
        },
        {
            "id"   : "805",
            "pid"  : "787",
            "type" : "2",
            "code" : "230781",
            "name" : "铁力市"
        },
        {
            "id"   : "806",
            "pid"  : "706",
            "type" : "1",
            "code" : "230800",
            "name" : "佳木斯市"
        },
        {
            "id"   : "807",
            "pid"  : "806",
            "type" : "2",
            "code" : "230801",
            "name" : "市辖区"
        },
        {
            "id"   : "808",
            "pid"  : "806",
            "type" : "2",
            "code" : "230803",
            "name" : "向阳区"
        },
        {
            "id"   : "809",
            "pid"  : "806",
            "type" : "2",
            "code" : "230804",
            "name" : "前进区"
        },
        {
            "id"   : "810",
            "pid"  : "806",
            "type" : "2",
            "code" : "230805",
            "name" : "东风区"
        },
        {
            "id"   : "811",
            "pid"  : "806",
            "type" : "2",
            "code" : "230811",
            "name" : "郊区"
        },
        {
            "id"   : "812",
            "pid"  : "806",
            "type" : "2",
            "code" : "230822",
            "name" : "桦南县"
        },
        {
            "id"   : "813",
            "pid"  : "806",
            "type" : "2",
            "code" : "230826",
            "name" : "桦川县"
        },
        {
            "id"   : "814",
            "pid"  : "806",
            "type" : "2",
            "code" : "230828",
            "name" : "汤原县"
        },
        {
            "id"   : "815",
            "pid"  : "806",
            "type" : "2",
            "code" : "230833",
            "name" : "抚远县"
        },
        {
            "id"   : "816",
            "pid"  : "806",
            "type" : "2",
            "code" : "230881",
            "name" : "同江市"
        },
        {
            "id"   : "817",
            "pid"  : "806",
            "type" : "2",
            "code" : "230882",
            "name" : "富锦市"
        },
        {
            "id"   : "818",
            "pid"  : "706",
            "type" : "1",
            "code" : "230900",
            "name" : "七台河市"
        },
        {
            "id"   : "819",
            "pid"  : "818",
            "type" : "2",
            "code" : "230901",
            "name" : "市辖区"
        },
        {
            "id"   : "820",
            "pid"  : "818",
            "type" : "2",
            "code" : "230902",
            "name" : "新兴区"
        },
        {
            "id"   : "821",
            "pid"  : "818",
            "type" : "2",
            "code" : "230903",
            "name" : "桃山区"
        },
        {
            "id"   : "822",
            "pid"  : "818",
            "type" : "2",
            "code" : "230904",
            "name" : "茄子河区"
        },
        {
            "id"   : "823",
            "pid"  : "818",
            "type" : "2",
            "code" : "230921",
            "name" : "勃利县"
        },
        {
            "id"   : "824",
            "pid"  : "706",
            "type" : "1",
            "code" : "231000",
            "name" : "牡丹江市"
        },
        {
            "id"   : "825",
            "pid"  : "824",
            "type" : "2",
            "code" : "231001",
            "name" : "市辖区"
        },
        {
            "id"   : "826",
            "pid"  : "824",
            "type" : "2",
            "code" : "231002",
            "name" : "东安区"
        },
        {
            "id"   : "827",
            "pid"  : "824",
            "type" : "2",
            "code" : "231003",
            "name" : "阳明区"
        },
        {
            "id"   : "828",
            "pid"  : "824",
            "type" : "2",
            "code" : "231004",
            "name" : "爱民区"
        },
        {
            "id"   : "829",
            "pid"  : "824",
            "type" : "2",
            "code" : "231005",
            "name" : "西安区"
        },
        {
            "id"   : "830",
            "pid"  : "824",
            "type" : "2",
            "code" : "231024",
            "name" : "东宁县"
        },
        {
            "id"   : "831",
            "pid"  : "824",
            "type" : "2",
            "code" : "231025",
            "name" : "林口县"
        },
        {
            "id"   : "832",
            "pid"  : "824",
            "type" : "2",
            "code" : "231081",
            "name" : "绥芬河市"
        },
        {
            "id"   : "833",
            "pid"  : "824",
            "type" : "2",
            "code" : "231083",
            "name" : "海林市"
        },
        {
            "id"   : "834",
            "pid"  : "824",
            "type" : "2",
            "code" : "231084",
            "name" : "宁安市"
        },
        {
            "id"   : "835",
            "pid"  : "824",
            "type" : "2",
            "code" : "231085",
            "name" : "穆棱市"
        },
        {
            "id"   : "836",
            "pid"  : "706",
            "type" : "1",
            "code" : "231100",
            "name" : "黑河市"
        },
        {
            "id"   : "837",
            "pid"  : "836",
            "type" : "2",
            "code" : "231101",
            "name" : "市辖区"
        },
        {
            "id"   : "838",
            "pid"  : "836",
            "type" : "2",
            "code" : "231102",
            "name" : "爱辉区"
        },
        {
            "id"   : "839",
            "pid"  : "836",
            "type" : "2",
            "code" : "231121",
            "name" : "嫩江县"
        },
        {
            "id"   : "840",
            "pid"  : "836",
            "type" : "2",
            "code" : "231123",
            "name" : "逊克县"
        },
        {
            "id"   : "841",
            "pid"  : "836",
            "type" : "2",
            "code" : "231124",
            "name" : "孙吴县"
        },
        {
            "id"   : "842",
            "pid"  : "836",
            "type" : "2",
            "code" : "231181",
            "name" : "北安市"
        },
        {
            "id"   : "843",
            "pid"  : "836",
            "type" : "2",
            "code" : "231182",
            "name" : "五大连池市"
        },
        {
            "id"   : "844",
            "pid"  : "706",
            "type" : "1",
            "code" : "231200",
            "name" : "绥化市"
        },
        {
            "id"   : "845",
            "pid"  : "844",
            "type" : "2",
            "code" : "231201",
            "name" : "市辖区"
        },
        {
            "id"   : "846",
            "pid"  : "844",
            "type" : "2",
            "code" : "231202",
            "name" : "北林区"
        },
        {
            "id"   : "847",
            "pid"  : "844",
            "type" : "2",
            "code" : "231221",
            "name" : "望奎县"
        },
        {
            "id"   : "848",
            "pid"  : "844",
            "type" : "2",
            "code" : "231222",
            "name" : "兰西县"
        },
        {
            "id"   : "849",
            "pid"  : "844",
            "type" : "2",
            "code" : "231223",
            "name" : "青冈县"
        },
        {
            "id"   : "850",
            "pid"  : "844",
            "type" : "2",
            "code" : "231224",
            "name" : "庆安县"
        },
        {
            "id"   : "851",
            "pid"  : "844",
            "type" : "2",
            "code" : "231225",
            "name" : "明水县"
        },
        {
            "id"   : "852",
            "pid"  : "844",
            "type" : "2",
            "code" : "231226",
            "name" : "绥棱县"
        },
        {
            "id"   : "853",
            "pid"  : "844",
            "type" : "2",
            "code" : "231281",
            "name" : "安达市"
        },
        {
            "id"   : "854",
            "pid"  : "844",
            "type" : "2",
            "code" : "231282",
            "name" : "肇东市"
        },
        {
            "id"   : "855",
            "pid"  : "844",
            "type" : "2",
            "code" : "231283",
            "name" : "海伦市"
        },
        {
            "id"   : "856",
            "pid"  : "706",
            "type" : "1",
            "code" : "232700",
            "name" : "大兴安岭地区"
        },
        {
            "id"   : "857",
            "pid"  : "856",
            "type" : "2",
            "code" : "232721",
            "name" : "呼玛县"
        },
        {
            "id"   : "858",
            "pid"  : "856",
            "type" : "2",
            "code" : "232722",
            "name" : "塔河县"
        },
        {
            "id"   : "859",
            "pid"  : "856",
            "type" : "2",
            "code" : "232723",
            "name" : "漠河县"
        },
        {
            "id"   : "860",
            "pid"  : "0",
            "type" : "0",
            "code" : "310000",
            "name" : "上海市"
        },
        {
            "id"   : "861",
            "pid"  : "860",
            "type" : "1",
            "code" : "310100",
            "name" : "市辖区"
        },
        {
            "id"   : "862",
            "pid"  : "861",
            "type" : "2",
            "code" : "310101",
            "name" : "黄浦区"
        },
        {
            "id"   : "863",
            "pid"  : "861",
            "type" : "2",
            "code" : "310104",
            "name" : "徐汇区"
        },
        {
            "id"   : "864",
            "pid"  : "861",
            "type" : "2",
            "code" : "310105",
            "name" : "长宁区"
        },
        {
            "id"   : "865",
            "pid"  : "861",
            "type" : "2",
            "code" : "310106",
            "name" : "静安区"
        },
        {
            "id"   : "866",
            "pid"  : "861",
            "type" : "2",
            "code" : "310107",
            "name" : "普陀区"
        },
        {
            "id"   : "867",
            "pid"  : "861",
            "type" : "2",
            "code" : "310108",
            "name" : "闸北区"
        },
        {
            "id"   : "868",
            "pid"  : "861",
            "type" : "2",
            "code" : "310109",
            "name" : "虹口区"
        },
        {
            "id"   : "869",
            "pid"  : "861",
            "type" : "2",
            "code" : "310110",
            "name" : "杨浦区"
        },
        {
            "id"   : "870",
            "pid"  : "861",
            "type" : "2",
            "code" : "310112",
            "name" : "闵行区"
        },
        {
            "id"   : "871",
            "pid"  : "861",
            "type" : "2",
            "code" : "310113",
            "name" : "宝山区"
        },
        {
            "id"   : "872",
            "pid"  : "861",
            "type" : "2",
            "code" : "310114",
            "name" : "嘉定区"
        },
        {
            "id"   : "873",
            "pid"  : "861",
            "type" : "2",
            "code" : "310115",
            "name" : "浦东新区"
        },
        {
            "id"   : "874",
            "pid"  : "861",
            "type" : "2",
            "code" : "310116",
            "name" : "金山区"
        },
        {
            "id"   : "875",
            "pid"  : "861",
            "type" : "2",
            "code" : "310117",
            "name" : "松江区"
        },
        {
            "id"   : "876",
            "pid"  : "861",
            "type" : "2",
            "code" : "310118",
            "name" : "青浦区"
        },
        {
            "id"   : "877",
            "pid"  : "861",
            "type" : "2",
            "code" : "310120",
            "name" : "奉贤区"
        },
        {
            "id"   : "878",
            "pid"  : "860",
            "type" : "1",
            "code" : "310200",
            "name" : "县"
        },
        {
            "id"   : "879",
            "pid"  : "878",
            "type" : "2",
            "code" : "310230",
            "name" : "崇明县"
        },
        {
            "id"   : "880",
            "pid"  : "0",
            "type" : "0",
            "code" : "320000",
            "name" : "江苏省"
        },
        {
            "id"   : "881",
            "pid"  : "880",
            "type" : "1",
            "code" : "320100",
            "name" : "南京市"
        },
        {
            "id"   : "882",
            "pid"  : "881",
            "type" : "2",
            "code" : "320101",
            "name" : "市辖区"
        },
        {
            "id"   : "883",
            "pid"  : "881",
            "type" : "2",
            "code" : "320102",
            "name" : "玄武区"
        },
        {
            "id"   : "884",
            "pid"  : "881",
            "type" : "2",
            "code" : "320104",
            "name" : "秦淮区"
        },
        {
            "id"   : "885",
            "pid"  : "881",
            "type" : "2",
            "code" : "320105",
            "name" : "建邺区"
        },
        {
            "id"   : "886",
            "pid"  : "881",
            "type" : "2",
            "code" : "320106",
            "name" : "鼓楼区"
        },
        {
            "id"   : "887",
            "pid"  : "881",
            "type" : "2",
            "code" : "320111",
            "name" : "浦口区"
        },
        {
            "id"   : "888",
            "pid"  : "881",
            "type" : "2",
            "code" : "320113",
            "name" : "栖霞区"
        },
        {
            "id"   : "889",
            "pid"  : "881",
            "type" : "2",
            "code" : "320114",
            "name" : "雨花台区"
        },
        {
            "id"   : "890",
            "pid"  : "881",
            "type" : "2",
            "code" : "320115",
            "name" : "江宁区"
        },
        {
            "id"   : "891",
            "pid"  : "881",
            "type" : "2",
            "code" : "320116",
            "name" : "六合区"
        },
        {
            "id"   : "892",
            "pid"  : "881",
            "type" : "2",
            "code" : "320117",
            "name" : "溧水区"
        },
        {
            "id"   : "893",
            "pid"  : "881",
            "type" : "2",
            "code" : "320118",
            "name" : "高淳区"
        },
        {
            "id"   : "894",
            "pid"  : "880",
            "type" : "1",
            "code" : "320200",
            "name" : "无锡市"
        },
        {
            "id"   : "895",
            "pid"  : "894",
            "type" : "2",
            "code" : "320201",
            "name" : "市辖区"
        },
        {
            "id"   : "896",
            "pid"  : "894",
            "type" : "2",
            "code" : "320202",
            "name" : "崇安区"
        },
        {
            "id"   : "897",
            "pid"  : "894",
            "type" : "2",
            "code" : "320203",
            "name" : "南长区"
        },
        {
            "id"   : "898",
            "pid"  : "894",
            "type" : "2",
            "code" : "320204",
            "name" : "北塘区"
        },
        {
            "id"   : "899",
            "pid"  : "894",
            "type" : "2",
            "code" : "320205",
            "name" : "锡山区"
        },
        {
            "id"   : "900",
            "pid"  : "894",
            "type" : "2",
            "code" : "320206",
            "name" : "惠山区"
        },
        {
            "id"   : "901",
            "pid"  : "894",
            "type" : "2",
            "code" : "320211",
            "name" : "滨湖区"
        },
        {
            "id"   : "902",
            "pid"  : "894",
            "type" : "2",
            "code" : "320281",
            "name" : "江阴市"
        },
        {
            "id"   : "903",
            "pid"  : "894",
            "type" : "2",
            "code" : "320282",
            "name" : "宜兴市"
        },
        {
            "id"   : "904",
            "pid"  : "880",
            "type" : "1",
            "code" : "320300",
            "name" : "徐州市"
        },
        {
            "id"   : "905",
            "pid"  : "904",
            "type" : "2",
            "code" : "320301",
            "name" : "市辖区"
        },
        {
            "id"   : "906",
            "pid"  : "904",
            "type" : "2",
            "code" : "320302",
            "name" : "鼓楼区"
        },
        {
            "id"   : "907",
            "pid"  : "904",
            "type" : "2",
            "code" : "320303",
            "name" : "云龙区"
        },
        {
            "id"   : "908",
            "pid"  : "904",
            "type" : "2",
            "code" : "320305",
            "name" : "贾汪区"
        },
        {
            "id"   : "909",
            "pid"  : "904",
            "type" : "2",
            "code" : "320311",
            "name" : "泉山区"
        },
        {
            "id"   : "910",
            "pid"  : "904",
            "type" : "2",
            "code" : "320312",
            "name" : "铜山区"
        },
        {
            "id"   : "911",
            "pid"  : "904",
            "type" : "2",
            "code" : "320321",
            "name" : "丰县"
        },
        {
            "id"   : "912",
            "pid"  : "904",
            "type" : "2",
            "code" : "320322",
            "name" : "沛县"
        },
        {
            "id"   : "913",
            "pid"  : "904",
            "type" : "2",
            "code" : "320324",
            "name" : "睢宁县"
        },
        {
            "id"   : "914",
            "pid"  : "904",
            "type" : "2",
            "code" : "320381",
            "name" : "新沂市"
        },
        {
            "id"   : "915",
            "pid"  : "904",
            "type" : "2",
            "code" : "320382",
            "name" : "邳州市"
        },
        {
            "id"   : "916",
            "pid"  : "880",
            "type" : "1",
            "code" : "320400",
            "name" : "常州市"
        },
        {
            "id"   : "917",
            "pid"  : "916",
            "type" : "2",
            "code" : "320401",
            "name" : "市辖区"
        },
        {
            "id"   : "918",
            "pid"  : "916",
            "type" : "2",
            "code" : "320402",
            "name" : "天宁区"
        },
        {
            "id"   : "919",
            "pid"  : "916",
            "type" : "2",
            "code" : "320404",
            "name" : "钟楼区"
        },
        {
            "id"   : "920",
            "pid"  : "916",
            "type" : "2",
            "code" : "320405",
            "name" : "戚墅堰区"
        },
        {
            "id"   : "921",
            "pid"  : "916",
            "type" : "2",
            "code" : "320411",
            "name" : "新北区"
        },
        {
            "id"   : "922",
            "pid"  : "916",
            "type" : "2",
            "code" : "320412",
            "name" : "武进区"
        },
        {
            "id"   : "923",
            "pid"  : "916",
            "type" : "2",
            "code" : "320481",
            "name" : "溧阳市"
        },
        {
            "id"   : "924",
            "pid"  : "916",
            "type" : "2",
            "code" : "320482",
            "name" : "金坛市"
        },
        {
            "id"   : "925",
            "pid"  : "880",
            "type" : "1",
            "code" : "320500",
            "name" : "苏州市"
        },
        {
            "id"   : "926",
            "pid"  : "925",
            "type" : "2",
            "code" : "320501",
            "name" : "市辖区"
        },
        {
            "id"   : "927",
            "pid"  : "925",
            "type" : "2",
            "code" : "320505",
            "name" : "虎丘区"
        },
        {
            "id"   : "928",
            "pid"  : "925",
            "type" : "2",
            "code" : "320506",
            "name" : "吴中区"
        },
        {
            "id"   : "929",
            "pid"  : "925",
            "type" : "2",
            "code" : "320507",
            "name" : "相城区"
        },
        {
            "id"   : "930",
            "pid"  : "925",
            "type" : "2",
            "code" : "320508",
            "name" : "姑苏区"
        },
        {
            "id"   : "931",
            "pid"  : "925",
            "type" : "2",
            "code" : "320509",
            "name" : "吴江区"
        },
        {
            "id"   : "932",
            "pid"  : "925",
            "type" : "2",
            "code" : "320581",
            "name" : "常熟市"
        },
        {
            "id"   : "933",
            "pid"  : "925",
            "type" : "2",
            "code" : "320582",
            "name" : "张家港市"
        },
        {
            "id"   : "934",
            "pid"  : "925",
            "type" : "2",
            "code" : "320583",
            "name" : "昆山市"
        },
        {
            "id"   : "935",
            "pid"  : "925",
            "type" : "2",
            "code" : "320585",
            "name" : "太仓市"
        },
        {
            "id"   : "936",
            "pid"  : "880",
            "type" : "1",
            "code" : "320600",
            "name" : "南通市"
        },
        {
            "id"   : "937",
            "pid"  : "936",
            "type" : "2",
            "code" : "320601",
            "name" : "市辖区"
        },
        {
            "id"   : "938",
            "pid"  : "936",
            "type" : "2",
            "code" : "320602",
            "name" : "崇川区"
        },
        {
            "id"   : "939",
            "pid"  : "936",
            "type" : "2",
            "code" : "320611",
            "name" : "港闸区"
        },
        {
            "id"   : "940",
            "pid"  : "936",
            "type" : "2",
            "code" : "320612",
            "name" : "通州区"
        },
        {
            "id"   : "941",
            "pid"  : "936",
            "type" : "2",
            "code" : "320621",
            "name" : "海安县"
        },
        {
            "id"   : "942",
            "pid"  : "936",
            "type" : "2",
            "code" : "320623",
            "name" : "如东县"
        },
        {
            "id"   : "943",
            "pid"  : "936",
            "type" : "2",
            "code" : "320681",
            "name" : "启东市"
        },
        {
            "id"   : "944",
            "pid"  : "936",
            "type" : "2",
            "code" : "320682",
            "name" : "如皋市"
        },
        {
            "id"   : "945",
            "pid"  : "936",
            "type" : "2",
            "code" : "320684",
            "name" : "海门市"
        },
        {
            "id"   : "946",
            "pid"  : "880",
            "type" : "1",
            "code" : "320700",
            "name" : "连云港市"
        },
        {
            "id"   : "947",
            "pid"  : "946",
            "type" : "2",
            "code" : "320701",
            "name" : "市辖区"
        },
        {
            "id"   : "948",
            "pid"  : "946",
            "type" : "2",
            "code" : "320703",
            "name" : "连云区"
        },
        {
            "id"   : "949",
            "pid"  : "946",
            "type" : "2",
            "code" : "320706",
            "name" : "海州区"
        },
        {
            "id"   : "950",
            "pid"  : "946",
            "type" : "2",
            "code" : "320707",
            "name" : "赣榆区"
        },
        {
            "id"   : "951",
            "pid"  : "946",
            "type" : "2",
            "code" : "320722",
            "name" : "东海县"
        },
        {
            "id"   : "952",
            "pid"  : "946",
            "type" : "2",
            "code" : "320723",
            "name" : "灌云县"
        },
        {
            "id"   : "953",
            "pid"  : "946",
            "type" : "2",
            "code" : "320724",
            "name" : "灌南县"
        },
        {
            "id"   : "954",
            "pid"  : "880",
            "type" : "1",
            "code" : "320800",
            "name" : "淮安市"
        },
        {
            "id"   : "955",
            "pid"  : "954",
            "type" : "2",
            "code" : "320801",
            "name" : "市辖区"
        },
        {
            "id"   : "956",
            "pid"  : "954",
            "type" : "2",
            "code" : "320802",
            "name" : "清河区"
        },
        {
            "id"   : "957",
            "pid"  : "954",
            "type" : "2",
            "code" : "320803",
            "name" : "淮安区"
        },
        {
            "id"   : "958",
            "pid"  : "954",
            "type" : "2",
            "code" : "320804",
            "name" : "淮阴区"
        },
        {
            "id"   : "959",
            "pid"  : "954",
            "type" : "2",
            "code" : "320811",
            "name" : "清浦区"
        },
        {
            "id"   : "960",
            "pid"  : "954",
            "type" : "2",
            "code" : "320826",
            "name" : "涟水县"
        },
        {
            "id"   : "961",
            "pid"  : "954",
            "type" : "2",
            "code" : "320829",
            "name" : "洪泽县"
        },
        {
            "id"   : "962",
            "pid"  : "954",
            "type" : "2",
            "code" : "320830",
            "name" : "盱眙县"
        },
        {
            "id"   : "963",
            "pid"  : "954",
            "type" : "2",
            "code" : "320831",
            "name" : "金湖县"
        },
        {
            "id"   : "964",
            "pid"  : "880",
            "type" : "1",
            "code" : "320900",
            "name" : "盐城市"
        },
        {
            "id"   : "965",
            "pid"  : "964",
            "type" : "2",
            "code" : "320901",
            "name" : "市辖区"
        },
        {
            "id"   : "966",
            "pid"  : "964",
            "type" : "2",
            "code" : "320902",
            "name" : "亭湖区"
        },
        {
            "id"   : "967",
            "pid"  : "964",
            "type" : "2",
            "code" : "320903",
            "name" : "盐都区"
        },
        {
            "id"   : "968",
            "pid"  : "964",
            "type" : "2",
            "code" : "320921",
            "name" : "响水县"
        },
        {
            "id"   : "969",
            "pid"  : "964",
            "type" : "2",
            "code" : "320922",
            "name" : "滨海县"
        },
        {
            "id"   : "970",
            "pid"  : "964",
            "type" : "2",
            "code" : "320923",
            "name" : "阜宁县"
        },
        {
            "id"   : "971",
            "pid"  : "964",
            "type" : "2",
            "code" : "320924",
            "name" : "射阳县"
        },
        {
            "id"   : "972",
            "pid"  : "964",
            "type" : "2",
            "code" : "320925",
            "name" : "建湖县"
        },
        {
            "id"   : "973",
            "pid"  : "964",
            "type" : "2",
            "code" : "320981",
            "name" : "东台市"
        },
        {
            "id"   : "974",
            "pid"  : "964",
            "type" : "2",
            "code" : "320982",
            "name" : "大丰市"
        },
        {
            "id"   : "975",
            "pid"  : "880",
            "type" : "1",
            "code" : "321000",
            "name" : "扬州市"
        },
        {
            "id"   : "976",
            "pid"  : "975",
            "type" : "2",
            "code" : "321001",
            "name" : "市辖区"
        },
        {
            "id"   : "977",
            "pid"  : "975",
            "type" : "2",
            "code" : "321002",
            "name" : "广陵区"
        },
        {
            "id"   : "978",
            "pid"  : "975",
            "type" : "2",
            "code" : "321003",
            "name" : "邗江区"
        },
        {
            "id"   : "979",
            "pid"  : "975",
            "type" : "2",
            "code" : "321012",
            "name" : "江都区"
        },
        {
            "id"   : "980",
            "pid"  : "975",
            "type" : "2",
            "code" : "321023",
            "name" : "宝应县"
        },
        {
            "id"   : "981",
            "pid"  : "975",
            "type" : "2",
            "code" : "321081",
            "name" : "仪征市"
        },
        {
            "id"   : "982",
            "pid"  : "975",
            "type" : "2",
            "code" : "321084",
            "name" : "高邮市"
        },
        {
            "id"   : "983",
            "pid"  : "880",
            "type" : "1",
            "code" : "321100",
            "name" : "镇江市"
        },
        {
            "id"   : "984",
            "pid"  : "983",
            "type" : "2",
            "code" : "321101",
            "name" : "市辖区"
        },
        {
            "id"   : "985",
            "pid"  : "983",
            "type" : "2",
            "code" : "321102",
            "name" : "京口区"
        },
        {
            "id"   : "986",
            "pid"  : "983",
            "type" : "2",
            "code" : "321111",
            "name" : "润州区"
        },
        {
            "id"   : "987",
            "pid"  : "983",
            "type" : "2",
            "code" : "321112",
            "name" : "丹徒区"
        },
        {
            "id"   : "988",
            "pid"  : "983",
            "type" : "2",
            "code" : "321181",
            "name" : "丹阳市"
        },
        {
            "id"   : "989",
            "pid"  : "983",
            "type" : "2",
            "code" : "321182",
            "name" : "扬中市"
        },
        {
            "id"   : "990",
            "pid"  : "983",
            "type" : "2",
            "code" : "321183",
            "name" : "句容市"
        },
        {
            "id"   : "991",
            "pid"  : "880",
            "type" : "1",
            "code" : "321200",
            "name" : "泰州市"
        },
        {
            "id"   : "992",
            "pid"  : "991",
            "type" : "2",
            "code" : "321201",
            "name" : "市辖区"
        },
        {
            "id"   : "993",
            "pid"  : "991",
            "type" : "2",
            "code" : "321202",
            "name" : "海陵区"
        },
        {
            "id"   : "994",
            "pid"  : "991",
            "type" : "2",
            "code" : "321203",
            "name" : "高港区"
        },
        {
            "id"   : "995",
            "pid"  : "991",
            "type" : "2",
            "code" : "321204",
            "name" : "姜堰区"
        },
        {
            "id"   : "996",
            "pid"  : "991",
            "type" : "2",
            "code" : "321281",
            "name" : "兴化市"
        },
        {
            "id"   : "997",
            "pid"  : "991",
            "type" : "2",
            "code" : "321282",
            "name" : "靖江市"
        },
        {
            "id"   : "998",
            "pid"  : "991",
            "type" : "2",
            "code" : "321283",
            "name" : "泰兴市"
        },
        {
            "id"   : "999",
            "pid"  : "880",
            "type" : "1",
            "code" : "321300",
            "name" : "宿迁市"
        },
        {
            "id"   : "1000",
            "pid"  : "999",
            "type" : "2",
            "code" : "321301",
            "name" : "市辖区"
        },
        {
            "id"   : "1001",
            "pid"  : "999",
            "type" : "2",
            "code" : "321302",
            "name" : "宿城区"
        },
        {
            "id"   : "1002",
            "pid"  : "999",
            "type" : "2",
            "code" : "321311",
            "name" : "宿豫区"
        },
        {
            "id"   : "1003",
            "pid"  : "999",
            "type" : "2",
            "code" : "321322",
            "name" : "沭阳县"
        },
        {
            "id"   : "1004",
            "pid"  : "999",
            "type" : "2",
            "code" : "321323",
            "name" : "泗阳县"
        },
        {
            "id"   : "1005",
            "pid"  : "999",
            "type" : "2",
            "code" : "321324",
            "name" : "泗洪县"
        },
        {
            "id"   : "1006",
            "pid"  : "0",
            "type" : "0",
            "code" : "330000",
            "name" : "浙江省"
        },
        {
            "id"   : "1007",
            "pid"  : "1006",
            "type" : "1",
            "code" : "330100",
            "name" : "杭州市"
        },
        {
            "id"   : "1008",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330101",
            "name" : "市辖区"
        },
        {
            "id"   : "1009",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330102",
            "name" : "上城区"
        },
        {
            "id"   : "1010",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330103",
            "name" : "下城区"
        },
        {
            "id"   : "1011",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330104",
            "name" : "江干区"
        },
        {
            "id"   : "1012",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330105",
            "name" : "拱墅区"
        },
        {
            "id"   : "1013",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330106",
            "name" : "西湖区"
        },
        {
            "id"   : "1014",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330108",
            "name" : "滨江区"
        },
        {
            "id"   : "1015",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330109",
            "name" : "萧山区"
        },
        {
            "id"   : "1016",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330110",
            "name" : "余杭区"
        },
        {
            "id"   : "1017",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330122",
            "name" : "桐庐县"
        },
        {
            "id"   : "1018",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330127",
            "name" : "淳安县"
        },
        {
            "id"   : "1019",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330182",
            "name" : "建德市"
        },
        {
            "id"   : "1020",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330183",
            "name" : "富阳市"
        },
        {
            "id"   : "1021",
            "pid"  : "1007",
            "type" : "2",
            "code" : "330185",
            "name" : "临安市"
        },
        {
            "id"   : "1022",
            "pid"  : "1006",
            "type" : "1",
            "code" : "330200",
            "name" : "宁波市"
        },
        {
            "id"   : "1023",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330201",
            "name" : "市辖区"
        },
        {
            "id"   : "1024",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330203",
            "name" : "海曙区"
        },
        {
            "id"   : "1025",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330204",
            "name" : "江东区"
        },
        {
            "id"   : "1026",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330205",
            "name" : "江北区"
        },
        {
            "id"   : "1027",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330206",
            "name" : "北仑区"
        },
        {
            "id"   : "1028",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330211",
            "name" : "镇海区"
        },
        {
            "id"   : "1029",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330212",
            "name" : "鄞州区"
        },
        {
            "id"   : "1030",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330225",
            "name" : "象山县"
        },
        {
            "id"   : "1031",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330226",
            "name" : "宁海县"
        },
        {
            "id"   : "1032",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330281",
            "name" : "余姚市"
        },
        {
            "id"   : "1033",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330282",
            "name" : "慈溪市"
        },
        {
            "id"   : "1034",
            "pid"  : "1022",
            "type" : "2",
            "code" : "330283",
            "name" : "奉化市"
        },
        {
            "id"   : "1035",
            "pid"  : "1006",
            "type" : "1",
            "code" : "330300",
            "name" : "温州市"
        },
        {
            "id"   : "1036",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330301",
            "name" : "市辖区"
        },
        {
            "id"   : "1037",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330302",
            "name" : "鹿城区"
        },
        {
            "id"   : "1038",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330303",
            "name" : "龙湾区"
        },
        {
            "id"   : "1039",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330304",
            "name" : "瓯海区"
        },
        {
            "id"   : "1040",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330322",
            "name" : "洞头县"
        },
        {
            "id"   : "1041",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330324",
            "name" : "永嘉县"
        },
        {
            "id"   : "1042",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330326",
            "name" : "平阳县"
        },
        {
            "id"   : "1043",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330327",
            "name" : "苍南县"
        },
        {
            "id"   : "1044",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330328",
            "name" : "文成县"
        },
        {
            "id"   : "1045",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330329",
            "name" : "泰顺县"
        },
        {
            "id"   : "1046",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330381",
            "name" : "瑞安市"
        },
        {
            "id"   : "1047",
            "pid"  : "1035",
            "type" : "2",
            "code" : "330382",
            "name" : "乐清市"
        },
        {
            "id"   : "1048",
            "pid"  : "1006",
            "type" : "1",
            "code" : "330400",
            "name" : "嘉兴市"
        },
        {
            "id"   : "1049",
            "pid"  : "1048",
            "type" : "2",
            "code" : "330401",
            "name" : "市辖区"
        },
        {
            "id"   : "1050",
            "pid"  : "1048",
            "type" : "2",
            "code" : "330402",
            "name" : "南湖区"
        },
        {
            "id"   : "1051",
            "pid"  : "1048",
            "type" : "2",
            "code" : "330411",
            "name" : "秀洲区"
        },
        {
            "id"   : "1052",
            "pid"  : "1048",
            "type" : "2",
            "code" : "330421",
            "name" : "嘉善县"
        },
        {
            "id"   : "1053",
            "pid"  : "1048",
            "type" : "2",
            "code" : "330424",
            "name" : "海盐县"
        },
        {
            "id"   : "1054",
            "pid"  : "1048",
            "type" : "2",
            "code" : "330481",
            "name" : "海宁市"
        },
        {
            "id"   : "1055",
            "pid"  : "1048",
            "type" : "2",
            "code" : "330482",
            "name" : "平湖市"
        },
        {
            "id"   : "1056",
            "pid"  : "1048",
            "type" : "2",
            "code" : "330483",
            "name" : "桐乡市"
        },
        {
            "id"   : "1057",
            "pid"  : "1006",
            "type" : "1",
            "code" : "330500",
            "name" : "湖州市"
        },
        {
            "id"   : "1058",
            "pid"  : "1057",
            "type" : "2",
            "code" : "330501",
            "name" : "市辖区"
        },
        {
            "id"   : "1059",
            "pid"  : "1057",
            "type" : "2",
            "code" : "330502",
            "name" : "吴兴区"
        },
        {
            "id"   : "1060",
            "pid"  : "1057",
            "type" : "2",
            "code" : "330503",
            "name" : "南浔区"
        },
        {
            "id"   : "1061",
            "pid"  : "1057",
            "type" : "2",
            "code" : "330521",
            "name" : "德清县"
        },
        {
            "id"   : "1062",
            "pid"  : "1057",
            "type" : "2",
            "code" : "330522",
            "name" : "长兴县"
        },
        {
            "id"   : "1063",
            "pid"  : "1057",
            "type" : "2",
            "code" : "330523",
            "name" : "安吉县"
        },
        {
            "id"   : "1064",
            "pid"  : "1006",
            "type" : "1",
            "code" : "330600",
            "name" : "绍兴市"
        },
        {
            "id"   : "1065",
            "pid"  : "1064",
            "type" : "2",
            "code" : "330601",
            "name" : "市辖区"
        },
        {
            "id"   : "1066",
            "pid"  : "1064",
            "type" : "2",
            "code" : "330602",
            "name" : "越城区"
        },
        {
            "id"   : "1067",
            "pid"  : "1064",
            "type" : "2",
            "code" : "330603",
            "name" : "柯桥区"
        },
        {
            "id"   : "1068",
            "pid"  : "1064",
            "type" : "2",
            "code" : "330604",
            "name" : "上虞区"
        },
        {
            "id"   : "1069",
            "pid"  : "1064",
            "type" : "2",
            "code" : "330624",
            "name" : "新昌县"
        },
        {
            "id"   : "1070",
            "pid"  : "1064",
            "type" : "2",
            "code" : "330681",
            "name" : "诸暨市"
        },
        {
            "id"   : "1071",
            "pid"  : "1064",
            "type" : "2",
            "code" : "330683",
            "name" : "嵊州市"
        },
        {
            "id"   : "1072",
            "pid"  : "1006",
            "type" : "1",
            "code" : "330700",
            "name" : "金华市"
        },
        {
            "id"   : "1073",
            "pid"  : "1072",
            "type" : "2",
            "code" : "330701",
            "name" : "市辖区"
        },
        {
            "id"   : "1074",
            "pid"  : "1072",
            "type" : "2",
            "code" : "330702",
            "name" : "婺城区"
        },
        {
            "id"   : "1075",
            "pid"  : "1072",
            "type" : "2",
            "code" : "330703",
            "name" : "金东区"
        },
        {
            "id"   : "1076",
            "pid"  : "1072",
            "type" : "2",
            "code" : "330723",
            "name" : "武义县"
        },
        {
            "id"   : "1077",
            "pid"  : "1072",
            "type" : "2",
            "code" : "330726",
            "name" : "浦江县"
        },
        {
            "id"   : "1078",
            "pid"  : "1072",
            "type" : "2",
            "code" : "330727",
            "name" : "磐安县"
        },
        {
            "id"   : "1079",
            "pid"  : "1072",
            "type" : "2",
            "code" : "330781",
            "name" : "兰溪市"
        },
        {
            "id"   : "1080",
            "pid"  : "1072",
            "type" : "2",
            "code" : "330782",
            "name" : "义乌市"
        },
        {
            "id"   : "1081",
            "pid"  : "1072",
            "type" : "2",
            "code" : "330783",
            "name" : "东阳市"
        },
        {
            "id"   : "1082",
            "pid"  : "1072",
            "type" : "2",
            "code" : "330784",
            "name" : "永康市"
        },
        {
            "id"   : "1083",
            "pid"  : "1006",
            "type" : "1",
            "code" : "330800",
            "name" : "衢州市"
        },
        {
            "id"   : "1084",
            "pid"  : "1083",
            "type" : "2",
            "code" : "330801",
            "name" : "市辖区"
        },
        {
            "id"   : "1085",
            "pid"  : "1083",
            "type" : "2",
            "code" : "330802",
            "name" : "柯城区"
        },
        {
            "id"   : "1086",
            "pid"  : "1083",
            "type" : "2",
            "code" : "330803",
            "name" : "衢江区"
        },
        {
            "id"   : "1087",
            "pid"  : "1083",
            "type" : "2",
            "code" : "330822",
            "name" : "常山县"
        },
        {
            "id"   : "1088",
            "pid"  : "1083",
            "type" : "2",
            "code" : "330824",
            "name" : "开化县"
        },
        {
            "id"   : "1089",
            "pid"  : "1083",
            "type" : "2",
            "code" : "330825",
            "name" : "龙游县"
        },
        {
            "id"   : "1090",
            "pid"  : "1083",
            "type" : "2",
            "code" : "330881",
            "name" : "江山市"
        },
        {
            "id"   : "1091",
            "pid"  : "1006",
            "type" : "1",
            "code" : "330900",
            "name" : "舟山市"
        },
        {
            "id"   : "1092",
            "pid"  : "1091",
            "type" : "2",
            "code" : "330901",
            "name" : "市辖区"
        },
        {
            "id"   : "1093",
            "pid"  : "1091",
            "type" : "2",
            "code" : "330902",
            "name" : "定海区"
        },
        {
            "id"   : "1094",
            "pid"  : "1091",
            "type" : "2",
            "code" : "330903",
            "name" : "普陀区"
        },
        {
            "id"   : "1095",
            "pid"  : "1091",
            "type" : "2",
            "code" : "330921",
            "name" : "岱山县"
        },
        {
            "id"   : "1096",
            "pid"  : "1091",
            "type" : "2",
            "code" : "330922",
            "name" : "嵊泗县"
        },
        {
            "id"   : "1097",
            "pid"  : "1006",
            "type" : "1",
            "code" : "331000",
            "name" : "台州市"
        },
        {
            "id"   : "1098",
            "pid"  : "1097",
            "type" : "2",
            "code" : "331001",
            "name" : "市辖区"
        },
        {
            "id"   : "1099",
            "pid"  : "1097",
            "type" : "2",
            "code" : "331002",
            "name" : "椒江区"
        },
        {
            "id"   : "1100",
            "pid"  : "1097",
            "type" : "2",
            "code" : "331003",
            "name" : "黄岩区"
        },
        {
            "id"   : "1101",
            "pid"  : "1097",
            "type" : "2",
            "code" : "331004",
            "name" : "路桥区"
        },
        {
            "id"   : "1102",
            "pid"  : "1097",
            "type" : "2",
            "code" : "331021",
            "name" : "玉环县"
        },
        {
            "id"   : "1103",
            "pid"  : "1097",
            "type" : "2",
            "code" : "331022",
            "name" : "三门县"
        },
        {
            "id"   : "1104",
            "pid"  : "1097",
            "type" : "2",
            "code" : "331023",
            "name" : "天台县"
        },
        {
            "id"   : "1105",
            "pid"  : "1097",
            "type" : "2",
            "code" : "331024",
            "name" : "仙居县"
        },
        {
            "id"   : "1106",
            "pid"  : "1097",
            "type" : "2",
            "code" : "331081",
            "name" : "温岭市"
        },
        {
            "id"   : "1107",
            "pid"  : "1097",
            "type" : "2",
            "code" : "331082",
            "name" : "临海市"
        },
        {
            "id"   : "1108",
            "pid"  : "1006",
            "type" : "1",
            "code" : "331100",
            "name" : "丽水市"
        },
        {
            "id"   : "1109",
            "pid"  : "1108",
            "type" : "2",
            "code" : "331101",
            "name" : "市辖区"
        },
        {
            "id"   : "1110",
            "pid"  : "1108",
            "type" : "2",
            "code" : "331102",
            "name" : "莲都区"
        },
        {
            "id"   : "1111",
            "pid"  : "1108",
            "type" : "2",
            "code" : "331121",
            "name" : "青田县"
        },
        {
            "id"   : "1112",
            "pid"  : "1108",
            "type" : "2",
            "code" : "331122",
            "name" : "缙云县"
        },
        {
            "id"   : "1113",
            "pid"  : "1108",
            "type" : "2",
            "code" : "331123",
            "name" : "遂昌县"
        },
        {
            "id"   : "1114",
            "pid"  : "1108",
            "type" : "2",
            "code" : "331124",
            "name" : "松阳县"
        },
        {
            "id"   : "1115",
            "pid"  : "1108",
            "type" : "2",
            "code" : "331125",
            "name" : "云和县"
        },
        {
            "id"   : "1116",
            "pid"  : "1108",
            "type" : "2",
            "code" : "331126",
            "name" : "庆元县"
        },
        {
            "id"   : "1117",
            "pid"  : "1108",
            "type" : "2",
            "code" : "331127",
            "name" : "景宁畲族自治县"
        },
        {
            "id"   : "1118",
            "pid"  : "1108",
            "type" : "2",
            "code" : "331181",
            "name" : "龙泉市"
        },
        {
            "id"   : "1119",
            "pid"  : "0",
            "type" : "0",
            "code" : "340000",
            "name" : "安徽省"
        },
        {
            "id"   : "1120",
            "pid"  : "1119",
            "type" : "1",
            "code" : "340100",
            "name" : "合肥市"
        },
        {
            "id"   : "1121",
            "pid"  : "1120",
            "type" : "2",
            "code" : "340101",
            "name" : "市辖区"
        },
        {
            "id"   : "1122",
            "pid"  : "1120",
            "type" : "2",
            "code" : "340102",
            "name" : "瑶海区"
        },
        {
            "id"   : "1123",
            "pid"  : "1120",
            "type" : "2",
            "code" : "340103",
            "name" : "庐阳区"
        },
        {
            "id"   : "1124",
            "pid"  : "1120",
            "type" : "2",
            "code" : "340104",
            "name" : "蜀山区"
        },
        {
            "id"   : "1125",
            "pid"  : "1120",
            "type" : "2",
            "code" : "340111",
            "name" : "包河区"
        },
        {
            "id"   : "1126",
            "pid"  : "1120",
            "type" : "2",
            "code" : "340121",
            "name" : "长丰县"
        },
        {
            "id"   : "1127",
            "pid"  : "1120",
            "type" : "2",
            "code" : "340122",
            "name" : "肥东县"
        },
        {
            "id"   : "1128",
            "pid"  : "1120",
            "type" : "2",
            "code" : "340123",
            "name" : "肥西县"
        },
        {
            "id"   : "1129",
            "pid"  : "1120",
            "type" : "2",
            "code" : "340124",
            "name" : "庐江县"
        },
        {
            "id"   : "1130",
            "pid"  : "1120",
            "type" : "2",
            "code" : "340181",
            "name" : "巢湖市"
        },
        {
            "id"   : "1131",
            "pid"  : "1119",
            "type" : "1",
            "code" : "340200",
            "name" : "芜湖市"
        },
        {
            "id"   : "1132",
            "pid"  : "1131",
            "type" : "2",
            "code" : "340201",
            "name" : "市辖区"
        },
        {
            "id"   : "1133",
            "pid"  : "1131",
            "type" : "2",
            "code" : "340202",
            "name" : "镜湖区"
        },
        {
            "id"   : "1134",
            "pid"  : "1131",
            "type" : "2",
            "code" : "340203",
            "name" : "弋江区"
        },
        {
            "id"   : "1135",
            "pid"  : "1131",
            "type" : "2",
            "code" : "340207",
            "name" : "鸠江区"
        },
        {
            "id"   : "1136",
            "pid"  : "1131",
            "type" : "2",
            "code" : "340208",
            "name" : "三山区"
        },
        {
            "id"   : "1137",
            "pid"  : "1131",
            "type" : "2",
            "code" : "340221",
            "name" : "芜湖县"
        },
        {
            "id"   : "1138",
            "pid"  : "1131",
            "type" : "2",
            "code" : "340222",
            "name" : "繁昌县"
        },
        {
            "id"   : "1139",
            "pid"  : "1131",
            "type" : "2",
            "code" : "340223",
            "name" : "南陵县"
        },
        {
            "id"   : "1140",
            "pid"  : "1131",
            "type" : "2",
            "code" : "340225",
            "name" : "无为县"
        },
        {
            "id"   : "1141",
            "pid"  : "1119",
            "type" : "1",
            "code" : "340300",
            "name" : "蚌埠市"
        },
        {
            "id"   : "1142",
            "pid"  : "1141",
            "type" : "2",
            "code" : "340301",
            "name" : "市辖区"
        },
        {
            "id"   : "1143",
            "pid"  : "1141",
            "type" : "2",
            "code" : "340302",
            "name" : "龙子湖区"
        },
        {
            "id"   : "1144",
            "pid"  : "1141",
            "type" : "2",
            "code" : "340303",
            "name" : "蚌山区"
        },
        {
            "id"   : "1145",
            "pid"  : "1141",
            "type" : "2",
            "code" : "340304",
            "name" : "禹会区"
        },
        {
            "id"   : "1146",
            "pid"  : "1141",
            "type" : "2",
            "code" : "340311",
            "name" : "淮上区"
        },
        {
            "id"   : "1147",
            "pid"  : "1141",
            "type" : "2",
            "code" : "340321",
            "name" : "怀远县"
        },
        {
            "id"   : "1148",
            "pid"  : "1141",
            "type" : "2",
            "code" : "340322",
            "name" : "五河县"
        },
        {
            "id"   : "1149",
            "pid"  : "1141",
            "type" : "2",
            "code" : "340323",
            "name" : "固镇县"
        },
        {
            "id"   : "1150",
            "pid"  : "1119",
            "type" : "1",
            "code" : "340400",
            "name" : "淮南市"
        },
        {
            "id"   : "1151",
            "pid"  : "1150",
            "type" : "2",
            "code" : "340401",
            "name" : "市辖区"
        },
        {
            "id"   : "1152",
            "pid"  : "1150",
            "type" : "2",
            "code" : "340402",
            "name" : "大通区"
        },
        {
            "id"   : "1153",
            "pid"  : "1150",
            "type" : "2",
            "code" : "340403",
            "name" : "田家庵区"
        },
        {
            "id"   : "1154",
            "pid"  : "1150",
            "type" : "2",
            "code" : "340404",
            "name" : "谢家集区"
        },
        {
            "id"   : "1155",
            "pid"  : "1150",
            "type" : "2",
            "code" : "340405",
            "name" : "八公山区"
        },
        {
            "id"   : "1156",
            "pid"  : "1150",
            "type" : "2",
            "code" : "340406",
            "name" : "潘集区"
        },
        {
            "id"   : "1157",
            "pid"  : "1150",
            "type" : "2",
            "code" : "340421",
            "name" : "凤台县"
        },
        {
            "id"   : "1158",
            "pid"  : "1119",
            "type" : "1",
            "code" : "340500",
            "name" : "马鞍山市"
        },
        {
            "id"   : "1159",
            "pid"  : "1158",
            "type" : "2",
            "code" : "340501",
            "name" : "市辖区"
        },
        {
            "id"   : "1160",
            "pid"  : "1158",
            "type" : "2",
            "code" : "340503",
            "name" : "花山区"
        },
        {
            "id"   : "1161",
            "pid"  : "1158",
            "type" : "2",
            "code" : "340504",
            "name" : "雨山区"
        },
        {
            "id"   : "1162",
            "pid"  : "1158",
            "type" : "2",
            "code" : "340506",
            "name" : "博望区"
        },
        {
            "id"   : "1163",
            "pid"  : "1158",
            "type" : "2",
            "code" : "340521",
            "name" : "当涂县"
        },
        {
            "id"   : "1164",
            "pid"  : "1158",
            "type" : "2",
            "code" : "340522",
            "name" : "含山县"
        },
        {
            "id"   : "1165",
            "pid"  : "1158",
            "type" : "2",
            "code" : "340523",
            "name" : "和县"
        },
        {
            "id"   : "1166",
            "pid"  : "1119",
            "type" : "1",
            "code" : "340600",
            "name" : "淮北市"
        },
        {
            "id"   : "1167",
            "pid"  : "1166",
            "type" : "2",
            "code" : "340601",
            "name" : "市辖区"
        },
        {
            "id"   : "1168",
            "pid"  : "1166",
            "type" : "2",
            "code" : "340602",
            "name" : "杜集区"
        },
        {
            "id"   : "1169",
            "pid"  : "1166",
            "type" : "2",
            "code" : "340603",
            "name" : "相山区"
        },
        {
            "id"   : "1170",
            "pid"  : "1166",
            "type" : "2",
            "code" : "340604",
            "name" : "烈山区"
        },
        {
            "id"   : "1171",
            "pid"  : "1166",
            "type" : "2",
            "code" : "340621",
            "name" : "濉溪县"
        },
        {
            "id"   : "1172",
            "pid"  : "1119",
            "type" : "1",
            "code" : "340700",
            "name" : "铜陵市"
        },
        {
            "id"   : "1173",
            "pid"  : "1172",
            "type" : "2",
            "code" : "340701",
            "name" : "市辖区"
        },
        {
            "id"   : "1174",
            "pid"  : "1172",
            "type" : "2",
            "code" : "340702",
            "name" : "铜官山区"
        },
        {
            "id"   : "1175",
            "pid"  : "1172",
            "type" : "2",
            "code" : "340703",
            "name" : "狮子山区"
        },
        {
            "id"   : "1176",
            "pid"  : "1172",
            "type" : "2",
            "code" : "340711",
            "name" : "郊区"
        },
        {
            "id"   : "1177",
            "pid"  : "1172",
            "type" : "2",
            "code" : "340721",
            "name" : "铜陵县"
        },
        {
            "id"   : "1178",
            "pid"  : "1119",
            "type" : "1",
            "code" : "340800",
            "name" : "安庆市"
        },
        {
            "id"   : "1179",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340801",
            "name" : "市辖区"
        },
        {
            "id"   : "1180",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340802",
            "name" : "迎江区"
        },
        {
            "id"   : "1181",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340803",
            "name" : "大观区"
        },
        {
            "id"   : "1182",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340811",
            "name" : "宜秀区"
        },
        {
            "id"   : "1183",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340822",
            "name" : "怀宁县"
        },
        {
            "id"   : "1184",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340823",
            "name" : "枞阳县"
        },
        {
            "id"   : "1185",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340824",
            "name" : "潜山县"
        },
        {
            "id"   : "1186",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340825",
            "name" : "太湖县"
        },
        {
            "id"   : "1187",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340826",
            "name" : "宿松县"
        },
        {
            "id"   : "1188",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340827",
            "name" : "望江县"
        },
        {
            "id"   : "1189",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340828",
            "name" : "岳西县"
        },
        {
            "id"   : "1190",
            "pid"  : "1178",
            "type" : "2",
            "code" : "340881",
            "name" : "桐城市"
        },
        {
            "id"   : "1191",
            "pid"  : "1119",
            "type" : "1",
            "code" : "341000",
            "name" : "黄山市"
        },
        {
            "id"   : "1192",
            "pid"  : "1191",
            "type" : "2",
            "code" : "341001",
            "name" : "市辖区"
        },
        {
            "id"   : "1193",
            "pid"  : "1191",
            "type" : "2",
            "code" : "341002",
            "name" : "屯溪区"
        },
        {
            "id"   : "1194",
            "pid"  : "1191",
            "type" : "2",
            "code" : "341003",
            "name" : "黄山区"
        },
        {
            "id"   : "1195",
            "pid"  : "1191",
            "type" : "2",
            "code" : "341004",
            "name" : "徽州区"
        },
        {
            "id"   : "1196",
            "pid"  : "1191",
            "type" : "2",
            "code" : "341021",
            "name" : "歙县"
        },
        {
            "id"   : "1197",
            "pid"  : "1191",
            "type" : "2",
            "code" : "341022",
            "name" : "休宁县"
        },
        {
            "id"   : "1198",
            "pid"  : "1191",
            "type" : "2",
            "code" : "341023",
            "name" : "黟县"
        },
        {
            "id"   : "1199",
            "pid"  : "1191",
            "type" : "2",
            "code" : "341024",
            "name" : "祁门县"
        },
        {
            "id"   : "1200",
            "pid"  : "1119",
            "type" : "1",
            "code" : "341100",
            "name" : "滁州市"
        },
        {
            "id"   : "1201",
            "pid"  : "1200",
            "type" : "2",
            "code" : "341101",
            "name" : "市辖区"
        },
        {
            "id"   : "1202",
            "pid"  : "1200",
            "type" : "2",
            "code" : "341102",
            "name" : "琅琊区"
        },
        {
            "id"   : "1203",
            "pid"  : "1200",
            "type" : "2",
            "code" : "341103",
            "name" : "南谯区"
        },
        {
            "id"   : "1204",
            "pid"  : "1200",
            "type" : "2",
            "code" : "341122",
            "name" : "来安县"
        },
        {
            "id"   : "1205",
            "pid"  : "1200",
            "type" : "2",
            "code" : "341124",
            "name" : "全椒县"
        },
        {
            "id"   : "1206",
            "pid"  : "1200",
            "type" : "2",
            "code" : "341125",
            "name" : "定远县"
        },
        {
            "id"   : "1207",
            "pid"  : "1200",
            "type" : "2",
            "code" : "341126",
            "name" : "凤阳县"
        },
        {
            "id"   : "1208",
            "pid"  : "1200",
            "type" : "2",
            "code" : "341181",
            "name" : "天长市"
        },
        {
            "id"   : "1209",
            "pid"  : "1200",
            "type" : "2",
            "code" : "341182",
            "name" : "明光市"
        },
        {
            "id"   : "1210",
            "pid"  : "1119",
            "type" : "1",
            "code" : "341200",
            "name" : "阜阳市"
        },
        {
            "id"   : "1211",
            "pid"  : "1210",
            "type" : "2",
            "code" : "341201",
            "name" : "市辖区"
        },
        {
            "id"   : "1212",
            "pid"  : "1210",
            "type" : "2",
            "code" : "341202",
            "name" : "颍州区"
        },
        {
            "id"   : "1213",
            "pid"  : "1210",
            "type" : "2",
            "code" : "341203",
            "name" : "颍东区"
        },
        {
            "id"   : "1214",
            "pid"  : "1210",
            "type" : "2",
            "code" : "341204",
            "name" : "颍泉区"
        },
        {
            "id"   : "1215",
            "pid"  : "1210",
            "type" : "2",
            "code" : "341221",
            "name" : "临泉县"
        },
        {
            "id"   : "1216",
            "pid"  : "1210",
            "type" : "2",
            "code" : "341222",
            "name" : "太和县"
        },
        {
            "id"   : "1217",
            "pid"  : "1210",
            "type" : "2",
            "code" : "341225",
            "name" : "阜南县"
        },
        {
            "id"   : "1218",
            "pid"  : "1210",
            "type" : "2",
            "code" : "341226",
            "name" : "颍上县"
        },
        {
            "id"   : "1219",
            "pid"  : "1210",
            "type" : "2",
            "code" : "341282",
            "name" : "界首市"
        },
        {
            "id"   : "1220",
            "pid"  : "1119",
            "type" : "1",
            "code" : "341300",
            "name" : "宿州市"
        },
        {
            "id"   : "1221",
            "pid"  : "1220",
            "type" : "2",
            "code" : "341301",
            "name" : "市辖区"
        },
        {
            "id"   : "1222",
            "pid"  : "1220",
            "type" : "2",
            "code" : "341302",
            "name" : "埇桥区"
        },
        {
            "id"   : "1223",
            "pid"  : "1220",
            "type" : "2",
            "code" : "341321",
            "name" : "砀山县"
        },
        {
            "id"   : "1224",
            "pid"  : "1220",
            "type" : "2",
            "code" : "341322",
            "name" : "萧县"
        },
        {
            "id"   : "1225",
            "pid"  : "1220",
            "type" : "2",
            "code" : "341323",
            "name" : "灵璧县"
        },
        {
            "id"   : "1226",
            "pid"  : "1220",
            "type" : "2",
            "code" : "341324",
            "name" : "泗县"
        },
        {
            "id"   : "1227",
            "pid"  : "1119",
            "type" : "1",
            "code" : "341500",
            "name" : "六安市"
        },
        {
            "id"   : "1228",
            "pid"  : "1227",
            "type" : "2",
            "code" : "341501",
            "name" : "市辖区"
        },
        {
            "id"   : "1229",
            "pid"  : "1227",
            "type" : "2",
            "code" : "341502",
            "name" : "金安区"
        },
        {
            "id"   : "1230",
            "pid"  : "1227",
            "type" : "2",
            "code" : "341503",
            "name" : "裕安区"
        },
        {
            "id"   : "1231",
            "pid"  : "1227",
            "type" : "2",
            "code" : "341521",
            "name" : "寿县"
        },
        {
            "id"   : "1232",
            "pid"  : "1227",
            "type" : "2",
            "code" : "341522",
            "name" : "霍邱县"
        },
        {
            "id"   : "1233",
            "pid"  : "1227",
            "type" : "2",
            "code" : "341523",
            "name" : "舒城县"
        },
        {
            "id"   : "1234",
            "pid"  : "1227",
            "type" : "2",
            "code" : "341524",
            "name" : "金寨县"
        },
        {
            "id"   : "1235",
            "pid"  : "1227",
            "type" : "2",
            "code" : "341525",
            "name" : "霍山县"
        },
        {
            "id"   : "1236",
            "pid"  : "1119",
            "type" : "1",
            "code" : "341600",
            "name" : "亳州市"
        },
        {
            "id"   : "1237",
            "pid"  : "1236",
            "type" : "2",
            "code" : "341601",
            "name" : "市辖区"
        },
        {
            "id"   : "1238",
            "pid"  : "1236",
            "type" : "2",
            "code" : "341602",
            "name" : "谯城区"
        },
        {
            "id"   : "1239",
            "pid"  : "1236",
            "type" : "2",
            "code" : "341621",
            "name" : "涡阳县"
        },
        {
            "id"   : "1240",
            "pid"  : "1236",
            "type" : "2",
            "code" : "341622",
            "name" : "蒙城县"
        },
        {
            "id"   : "1241",
            "pid"  : "1236",
            "type" : "2",
            "code" : "341623",
            "name" : "利辛县"
        },
        {
            "id"   : "1242",
            "pid"  : "1119",
            "type" : "1",
            "code" : "341700",
            "name" : "池州市"
        },
        {
            "id"   : "1243",
            "pid"  : "1242",
            "type" : "2",
            "code" : "341701",
            "name" : "市辖区"
        },
        {
            "id"   : "1244",
            "pid"  : "1242",
            "type" : "2",
            "code" : "341702",
            "name" : "贵池区"
        },
        {
            "id"   : "1245",
            "pid"  : "1242",
            "type" : "2",
            "code" : "341721",
            "name" : "东至县"
        },
        {
            "id"   : "1246",
            "pid"  : "1242",
            "type" : "2",
            "code" : "341722",
            "name" : "石台县"
        },
        {
            "id"   : "1247",
            "pid"  : "1242",
            "type" : "2",
            "code" : "341723",
            "name" : "青阳县"
        },
        {
            "id"   : "1248",
            "pid"  : "1119",
            "type" : "1",
            "code" : "341800",
            "name" : "宣城市"
        },
        {
            "id"   : "1249",
            "pid"  : "1248",
            "type" : "2",
            "code" : "341801",
            "name" : "市辖区"
        },
        {
            "id"   : "1250",
            "pid"  : "1248",
            "type" : "2",
            "code" : "341802",
            "name" : "宣州区"
        },
        {
            "id"   : "1251",
            "pid"  : "1248",
            "type" : "2",
            "code" : "341821",
            "name" : "郎溪县"
        },
        {
            "id"   : "1252",
            "pid"  : "1248",
            "type" : "2",
            "code" : "341822",
            "name" : "广德县"
        },
        {
            "id"   : "1253",
            "pid"  : "1248",
            "type" : "2",
            "code" : "341823",
            "name" : "泾县"
        },
        {
            "id"   : "1254",
            "pid"  : "1248",
            "type" : "2",
            "code" : "341824",
            "name" : "绩溪县"
        },
        {
            "id"   : "1255",
            "pid"  : "1248",
            "type" : "2",
            "code" : "341825",
            "name" : "旌德县"
        },
        {
            "id"   : "1256",
            "pid"  : "1248",
            "type" : "2",
            "code" : "341881",
            "name" : "宁国市"
        },
        {
            "id"   : "1257",
            "pid"  : "0",
            "type" : "0",
            "code" : "350000",
            "name" : "福建省"
        },
        {
            "id"   : "1258",
            "pid"  : "1257",
            "type" : "1",
            "code" : "350100",
            "name" : "福州市"
        },
        {
            "id"   : "1259",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350101",
            "name" : "市辖区"
        },
        {
            "id"   : "1260",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350102",
            "name" : "鼓楼区"
        },
        {
            "id"   : "1261",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350103",
            "name" : "台江区"
        },
        {
            "id"   : "1262",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350104",
            "name" : "仓山区"
        },
        {
            "id"   : "1263",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350105",
            "name" : "马尾区"
        },
        {
            "id"   : "1264",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350111",
            "name" : "晋安区"
        },
        {
            "id"   : "1265",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350121",
            "name" : "闽侯县"
        },
        {
            "id"   : "1266",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350122",
            "name" : "连江县"
        },
        {
            "id"   : "1267",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350123",
            "name" : "罗源县"
        },
        {
            "id"   : "1268",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350124",
            "name" : "闽清县"
        },
        {
            "id"   : "1269",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350125",
            "name" : "永泰县"
        },
        {
            "id"   : "1270",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350128",
            "name" : "平潭县"
        },
        {
            "id"   : "1271",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350181",
            "name" : "福清市"
        },
        {
            "id"   : "1272",
            "pid"  : "1258",
            "type" : "2",
            "code" : "350182",
            "name" : "长乐市"
        },
        {
            "id"   : "1273",
            "pid"  : "1257",
            "type" : "1",
            "code" : "350200",
            "name" : "厦门市"
        },
        {
            "id"   : "1274",
            "pid"  : "1273",
            "type" : "2",
            "code" : "350201",
            "name" : "市辖区"
        },
        {
            "id"   : "1275",
            "pid"  : "1273",
            "type" : "2",
            "code" : "350203",
            "name" : "思明区"
        },
        {
            "id"   : "1276",
            "pid"  : "1273",
            "type" : "2",
            "code" : "350205",
            "name" : "海沧区"
        },
        {
            "id"   : "1277",
            "pid"  : "1273",
            "type" : "2",
            "code" : "350206",
            "name" : "湖里区"
        },
        {
            "id"   : "1278",
            "pid"  : "1273",
            "type" : "2",
            "code" : "350211",
            "name" : "集美区"
        },
        {
            "id"   : "1279",
            "pid"  : "1273",
            "type" : "2",
            "code" : "350212",
            "name" : "同安区"
        },
        {
            "id"   : "1280",
            "pid"  : "1273",
            "type" : "2",
            "code" : "350213",
            "name" : "翔安区"
        },
        {
            "id"   : "1281",
            "pid"  : "1257",
            "type" : "1",
            "code" : "350300",
            "name" : "莆田市"
        },
        {
            "id"   : "1282",
            "pid"  : "1281",
            "type" : "2",
            "code" : "350301",
            "name" : "市辖区"
        },
        {
            "id"   : "1283",
            "pid"  : "1281",
            "type" : "2",
            "code" : "350302",
            "name" : "城厢区"
        },
        {
            "id"   : "1284",
            "pid"  : "1281",
            "type" : "2",
            "code" : "350303",
            "name" : "涵江区"
        },
        {
            "id"   : "1285",
            "pid"  : "1281",
            "type" : "2",
            "code" : "350304",
            "name" : "荔城区"
        },
        {
            "id"   : "1286",
            "pid"  : "1281",
            "type" : "2",
            "code" : "350305",
            "name" : "秀屿区"
        },
        {
            "id"   : "1287",
            "pid"  : "1281",
            "type" : "2",
            "code" : "350322",
            "name" : "仙游县"
        },
        {
            "id"   : "1288",
            "pid"  : "1257",
            "type" : "1",
            "code" : "350400",
            "name" : "三明市"
        },
        {
            "id"   : "1289",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350401",
            "name" : "市辖区"
        },
        {
            "id"   : "1290",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350402",
            "name" : "梅列区"
        },
        {
            "id"   : "1291",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350403",
            "name" : "三元区"
        },
        {
            "id"   : "1292",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350421",
            "name" : "明溪县"
        },
        {
            "id"   : "1293",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350423",
            "name" : "清流县"
        },
        {
            "id"   : "1294",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350424",
            "name" : "宁化县"
        },
        {
            "id"   : "1295",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350425",
            "name" : "大田县"
        },
        {
            "id"   : "1296",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350426",
            "name" : "尤溪县"
        },
        {
            "id"   : "1297",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350427",
            "name" : "沙县"
        },
        {
            "id"   : "1298",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350428",
            "name" : "将乐县"
        },
        {
            "id"   : "1299",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350429",
            "name" : "泰宁县"
        },
        {
            "id"   : "1300",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350430",
            "name" : "建宁县"
        },
        {
            "id"   : "1301",
            "pid"  : "1288",
            "type" : "2",
            "code" : "350481",
            "name" : "永安市"
        },
        {
            "id"   : "1302",
            "pid"  : "1257",
            "type" : "1",
            "code" : "350500",
            "name" : "泉州市"
        },
        {
            "id"   : "1303",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350501",
            "name" : "市辖区"
        },
        {
            "id"   : "1304",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350502",
            "name" : "鲤城区"
        },
        {
            "id"   : "1305",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350503",
            "name" : "丰泽区"
        },
        {
            "id"   : "1306",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350504",
            "name" : "洛江区"
        },
        {
            "id"   : "1307",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350505",
            "name" : "泉港区"
        },
        {
            "id"   : "1308",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350521",
            "name" : "惠安县"
        },
        {
            "id"   : "1309",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350524",
            "name" : "安溪县"
        },
        {
            "id"   : "1310",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350525",
            "name" : "永春县"
        },
        {
            "id"   : "1311",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350526",
            "name" : "德化县"
        },
        {
            "id"   : "1312",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350527",
            "name" : "金门县"
        },
        {
            "id"   : "1313",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350581",
            "name" : "石狮市"
        },
        {
            "id"   : "1314",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350582",
            "name" : "晋江市"
        },
        {
            "id"   : "1315",
            "pid"  : "1302",
            "type" : "2",
            "code" : "350583",
            "name" : "南安市"
        },
        {
            "id"   : "1316",
            "pid"  : "1257",
            "type" : "1",
            "code" : "350600",
            "name" : "漳州市"
        },
        {
            "id"   : "1317",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350601",
            "name" : "市辖区"
        },
        {
            "id"   : "1318",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350602",
            "name" : "芗城区"
        },
        {
            "id"   : "1319",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350603",
            "name" : "龙文区"
        },
        {
            "id"   : "1320",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350622",
            "name" : "云霄县"
        },
        {
            "id"   : "1321",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350623",
            "name" : "漳浦县"
        },
        {
            "id"   : "1322",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350624",
            "name" : "诏安县"
        },
        {
            "id"   : "1323",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350625",
            "name" : "长泰县"
        },
        {
            "id"   : "1324",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350626",
            "name" : "东山县"
        },
        {
            "id"   : "1325",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350627",
            "name" : "南靖县"
        },
        {
            "id"   : "1326",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350628",
            "name" : "平和县"
        },
        {
            "id"   : "1327",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350629",
            "name" : "华安县"
        },
        {
            "id"   : "1328",
            "pid"  : "1316",
            "type" : "2",
            "code" : "350681",
            "name" : "龙海市"
        },
        {
            "id"   : "1329",
            "pid"  : "1257",
            "type" : "1",
            "code" : "350700",
            "name" : "南平市"
        },
        {
            "id"   : "1330",
            "pid"  : "1329",
            "type" : "2",
            "code" : "350701",
            "name" : "市辖区"
        },
        {
            "id"   : "1331",
            "pid"  : "1329",
            "type" : "2",
            "code" : "350702",
            "name" : "延平区"
        },
        {
            "id"   : "1332",
            "pid"  : "1329",
            "type" : "2",
            "code" : "350721",
            "name" : "顺昌县"
        },
        {
            "id"   : "1333",
            "pid"  : "1329",
            "type" : "2",
            "code" : "350722",
            "name" : "浦城县"
        },
        {
            "id"   : "1334",
            "pid"  : "1329",
            "type" : "2",
            "code" : "350723",
            "name" : "光泽县"
        },
        {
            "id"   : "1335",
            "pid"  : "1329",
            "type" : "2",
            "code" : "350724",
            "name" : "松溪县"
        },
        {
            "id"   : "1336",
            "pid"  : "1329",
            "type" : "2",
            "code" : "350725",
            "name" : "政和县"
        },
        {
            "id"   : "1337",
            "pid"  : "1329",
            "type" : "2",
            "code" : "350781",
            "name" : "邵武市"
        },
        {
            "id"   : "1338",
            "pid"  : "1329",
            "type" : "2",
            "code" : "350782",
            "name" : "武夷山市"
        },
        {
            "id"   : "1339",
            "pid"  : "1329",
            "type" : "2",
            "code" : "350783",
            "name" : "建瓯市"
        },
        {
            "id"   : "1340",
            "pid"  : "1329",
            "type" : "2",
            "code" : "350784",
            "name" : "建阳市"
        },
        {
            "id"   : "1341",
            "pid"  : "1257",
            "type" : "1",
            "code" : "350800",
            "name" : "龙岩市"
        },
        {
            "id"   : "1342",
            "pid"  : "1341",
            "type" : "2",
            "code" : "350801",
            "name" : "市辖区"
        },
        {
            "id"   : "1343",
            "pid"  : "1341",
            "type" : "2",
            "code" : "350802",
            "name" : "新罗区"
        },
        {
            "id"   : "1344",
            "pid"  : "1341",
            "type" : "2",
            "code" : "350821",
            "name" : "长汀县"
        },
        {
            "id"   : "1345",
            "pid"  : "1341",
            "type" : "2",
            "code" : "350822",
            "name" : "永定县"
        },
        {
            "id"   : "1346",
            "pid"  : "1341",
            "type" : "2",
            "code" : "350823",
            "name" : "上杭县"
        },
        {
            "id"   : "1347",
            "pid"  : "1341",
            "type" : "2",
            "code" : "350824",
            "name" : "武平县"
        },
        {
            "id"   : "1348",
            "pid"  : "1341",
            "type" : "2",
            "code" : "350825",
            "name" : "连城县"
        },
        {
            "id"   : "1349",
            "pid"  : "1341",
            "type" : "2",
            "code" : "350881",
            "name" : "漳平市"
        },
        {
            "id"   : "1350",
            "pid"  : "1257",
            "type" : "1",
            "code" : "350900",
            "name" : "宁德市"
        },
        {
            "id"   : "1351",
            "pid"  : "1350",
            "type" : "2",
            "code" : "350901",
            "name" : "市辖区"
        },
        {
            "id"   : "1352",
            "pid"  : "1350",
            "type" : "2",
            "code" : "350902",
            "name" : "蕉城区"
        },
        {
            "id"   : "1353",
            "pid"  : "1350",
            "type" : "2",
            "code" : "350921",
            "name" : "霞浦县"
        },
        {
            "id"   : "1354",
            "pid"  : "1350",
            "type" : "2",
            "code" : "350922",
            "name" : "古田县"
        },
        {
            "id"   : "1355",
            "pid"  : "1350",
            "type" : "2",
            "code" : "350923",
            "name" : "屏南县"
        },
        {
            "id"   : "1356",
            "pid"  : "1350",
            "type" : "2",
            "code" : "350924",
            "name" : "寿宁县"
        },
        {
            "id"   : "1357",
            "pid"  : "1350",
            "type" : "2",
            "code" : "350925",
            "name" : "周宁县"
        },
        {
            "id"   : "1358",
            "pid"  : "1350",
            "type" : "2",
            "code" : "350926",
            "name" : "柘荣县"
        },
        {
            "id"   : "1359",
            "pid"  : "1350",
            "type" : "2",
            "code" : "350981",
            "name" : "福安市"
        },
        {
            "id"   : "1360",
            "pid"  : "1350",
            "type" : "2",
            "code" : "350982",
            "name" : "福鼎市"
        },
        {
            "id"   : "1361",
            "pid"  : "0",
            "type" : "0",
            "code" : "360000",
            "name" : "江西省"
        },
        {
            "id"   : "1362",
            "pid"  : "1361",
            "type" : "1",
            "code" : "360100",
            "name" : "南昌市"
        },
        {
            "id"   : "1363",
            "pid"  : "1362",
            "type" : "2",
            "code" : "360101",
            "name" : "市辖区"
        },
        {
            "id"   : "1364",
            "pid"  : "1362",
            "type" : "2",
            "code" : "360102",
            "name" : "东湖区"
        },
        {
            "id"   : "1365",
            "pid"  : "1362",
            "type" : "2",
            "code" : "360103",
            "name" : "西湖区"
        },
        {
            "id"   : "1366",
            "pid"  : "1362",
            "type" : "2",
            "code" : "360104",
            "name" : "青云谱区"
        },
        {
            "id"   : "1367",
            "pid"  : "1362",
            "type" : "2",
            "code" : "360105",
            "name" : "湾里区"
        },
        {
            "id"   : "1368",
            "pid"  : "1362",
            "type" : "2",
            "code" : "360111",
            "name" : "青山湖区"
        },
        {
            "id"   : "1369",
            "pid"  : "1362",
            "type" : "2",
            "code" : "360121",
            "name" : "南昌县"
        },
        {
            "id"   : "1370",
            "pid"  : "1362",
            "type" : "2",
            "code" : "360122",
            "name" : "新建县"
        },
        {
            "id"   : "1371",
            "pid"  : "1362",
            "type" : "2",
            "code" : "360123",
            "name" : "安义县"
        },
        {
            "id"   : "1372",
            "pid"  : "1362",
            "type" : "2",
            "code" : "360124",
            "name" : "进贤县"
        },
        {
            "id"   : "1373",
            "pid"  : "1361",
            "type" : "1",
            "code" : "360200",
            "name" : "景德镇市"
        },
        {
            "id"   : "1374",
            "pid"  : "1373",
            "type" : "2",
            "code" : "360201",
            "name" : "市辖区"
        },
        {
            "id"   : "1375",
            "pid"  : "1373",
            "type" : "2",
            "code" : "360202",
            "name" : "昌江区"
        },
        {
            "id"   : "1376",
            "pid"  : "1373",
            "type" : "2",
            "code" : "360203",
            "name" : "珠山区"
        },
        {
            "id"   : "1377",
            "pid"  : "1373",
            "type" : "2",
            "code" : "360222",
            "name" : "浮梁县"
        },
        {
            "id"   : "1378",
            "pid"  : "1373",
            "type" : "2",
            "code" : "360281",
            "name" : "乐平市"
        },
        {
            "id"   : "1379",
            "pid"  : "1361",
            "type" : "1",
            "code" : "360300",
            "name" : "萍乡市"
        },
        {
            "id"   : "1380",
            "pid"  : "1379",
            "type" : "2",
            "code" : "360301",
            "name" : "市辖区"
        },
        {
            "id"   : "1381",
            "pid"  : "1379",
            "type" : "2",
            "code" : "360302",
            "name" : "安源区"
        },
        {
            "id"   : "1382",
            "pid"  : "1379",
            "type" : "2",
            "code" : "360313",
            "name" : "湘东区"
        },
        {
            "id"   : "1383",
            "pid"  : "1379",
            "type" : "2",
            "code" : "360321",
            "name" : "莲花县"
        },
        {
            "id"   : "1384",
            "pid"  : "1379",
            "type" : "2",
            "code" : "360322",
            "name" : "上栗县"
        },
        {
            "id"   : "1385",
            "pid"  : "1379",
            "type" : "2",
            "code" : "360323",
            "name" : "芦溪县"
        },
        {
            "id"   : "1386",
            "pid"  : "1361",
            "type" : "1",
            "code" : "360400",
            "name" : "九江市"
        },
        {
            "id"   : "1387",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360401",
            "name" : "市辖区"
        },
        {
            "id"   : "1388",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360402",
            "name" : "庐山区"
        },
        {
            "id"   : "1389",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360403",
            "name" : "浔阳区"
        },
        {
            "id"   : "1390",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360421",
            "name" : "九江县"
        },
        {
            "id"   : "1391",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360423",
            "name" : "武宁县"
        },
        {
            "id"   : "1392",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360424",
            "name" : "修水县"
        },
        {
            "id"   : "1393",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360425",
            "name" : "永修县"
        },
        {
            "id"   : "1394",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360426",
            "name" : "德安县"
        },
        {
            "id"   : "1395",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360427",
            "name" : "星子县"
        },
        {
            "id"   : "1396",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360428",
            "name" : "都昌县"
        },
        {
            "id"   : "1397",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360429",
            "name" : "湖口县"
        },
        {
            "id"   : "1398",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360430",
            "name" : "彭泽县"
        },
        {
            "id"   : "1399",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360481",
            "name" : "瑞昌市"
        },
        {
            "id"   : "1400",
            "pid"  : "1386",
            "type" : "2",
            "code" : "360482",
            "name" : "共青城市"
        },
        {
            "id"   : "1401",
            "pid"  : "1361",
            "type" : "1",
            "code" : "360500",
            "name" : "新余市"
        },
        {
            "id"   : "1402",
            "pid"  : "1401",
            "type" : "2",
            "code" : "360501",
            "name" : "市辖区"
        },
        {
            "id"   : "1403",
            "pid"  : "1401",
            "type" : "2",
            "code" : "360502",
            "name" : "渝水区"
        },
        {
            "id"   : "1404",
            "pid"  : "1401",
            "type" : "2",
            "code" : "360521",
            "name" : "分宜县"
        },
        {
            "id"   : "1405",
            "pid"  : "1361",
            "type" : "1",
            "code" : "360600",
            "name" : "鹰潭市"
        },
        {
            "id"   : "1406",
            "pid"  : "1405",
            "type" : "2",
            "code" : "360601",
            "name" : "市辖区"
        },
        {
            "id"   : "1407",
            "pid"  : "1405",
            "type" : "2",
            "code" : "360602",
            "name" : "月湖区"
        },
        {
            "id"   : "1408",
            "pid"  : "1405",
            "type" : "2",
            "code" : "360622",
            "name" : "余江县"
        },
        {
            "id"   : "1409",
            "pid"  : "1405",
            "type" : "2",
            "code" : "360681",
            "name" : "贵溪市"
        },
        {
            "id"   : "1410",
            "pid"  : "1361",
            "type" : "1",
            "code" : "360700",
            "name" : "赣州市"
        },
        {
            "id"   : "1411",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360701",
            "name" : "市辖区"
        },
        {
            "id"   : "1412",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360702",
            "name" : "章贡区"
        },
        {
            "id"   : "1413",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360703",
            "name" : "南康区"
        },
        {
            "id"   : "1414",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360721",
            "name" : "赣县"
        },
        {
            "id"   : "1415",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360722",
            "name" : "信丰县"
        },
        {
            "id"   : "1416",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360723",
            "name" : "大余县"
        },
        {
            "id"   : "1417",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360724",
            "name" : "上犹县"
        },
        {
            "id"   : "1418",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360725",
            "name" : "崇义县"
        },
        {
            "id"   : "1419",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360726",
            "name" : "安远县"
        },
        {
            "id"   : "1420",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360727",
            "name" : "龙南县"
        },
        {
            "id"   : "1421",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360728",
            "name" : "定南县"
        },
        {
            "id"   : "1422",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360729",
            "name" : "全南县"
        },
        {
            "id"   : "1423",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360730",
            "name" : "宁都县"
        },
        {
            "id"   : "1424",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360731",
            "name" : "于都县"
        },
        {
            "id"   : "1425",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360732",
            "name" : "兴国县"
        },
        {
            "id"   : "1426",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360733",
            "name" : "会昌县"
        },
        {
            "id"   : "1427",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360734",
            "name" : "寻乌县"
        },
        {
            "id"   : "1428",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360735",
            "name" : "石城县"
        },
        {
            "id"   : "1429",
            "pid"  : "1410",
            "type" : "2",
            "code" : "360781",
            "name" : "瑞金市"
        },
        {
            "id"   : "1430",
            "pid"  : "1361",
            "type" : "1",
            "code" : "360800",
            "name" : "吉安市"
        },
        {
            "id"   : "1431",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360801",
            "name" : "市辖区"
        },
        {
            "id"   : "1432",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360802",
            "name" : "吉州区"
        },
        {
            "id"   : "1433",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360803",
            "name" : "青原区"
        },
        {
            "id"   : "1434",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360821",
            "name" : "吉安县"
        },
        {
            "id"   : "1435",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360822",
            "name" : "吉水县"
        },
        {
            "id"   : "1436",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360823",
            "name" : "峡江县"
        },
        {
            "id"   : "1437",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360824",
            "name" : "新干县"
        },
        {
            "id"   : "1438",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360825",
            "name" : "永丰县"
        },
        {
            "id"   : "1439",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360826",
            "name" : "泰和县"
        },
        {
            "id"   : "1440",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360827",
            "name" : "遂川县"
        },
        {
            "id"   : "1441",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360828",
            "name" : "万安县"
        },
        {
            "id"   : "1442",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360829",
            "name" : "安福县"
        },
        {
            "id"   : "1443",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360830",
            "name" : "永新县"
        },
        {
            "id"   : "1444",
            "pid"  : "1430",
            "type" : "2",
            "code" : "360881",
            "name" : "井冈山市"
        },
        {
            "id"   : "1445",
            "pid"  : "1361",
            "type" : "1",
            "code" : "360900",
            "name" : "宜春市"
        },
        {
            "id"   : "1446",
            "pid"  : "1445",
            "type" : "2",
            "code" : "360901",
            "name" : "市辖区"
        },
        {
            "id"   : "1447",
            "pid"  : "1445",
            "type" : "2",
            "code" : "360902",
            "name" : "袁州区"
        },
        {
            "id"   : "1448",
            "pid"  : "1445",
            "type" : "2",
            "code" : "360921",
            "name" : "奉新县"
        },
        {
            "id"   : "1449",
            "pid"  : "1445",
            "type" : "2",
            "code" : "360922",
            "name" : "万载县"
        },
        {
            "id"   : "1450",
            "pid"  : "1445",
            "type" : "2",
            "code" : "360923",
            "name" : "上高县"
        },
        {
            "id"   : "1451",
            "pid"  : "1445",
            "type" : "2",
            "code" : "360924",
            "name" : "宜丰县"
        },
        {
            "id"   : "1452",
            "pid"  : "1445",
            "type" : "2",
            "code" : "360925",
            "name" : "靖安县"
        },
        {
            "id"   : "1453",
            "pid"  : "1445",
            "type" : "2",
            "code" : "360926",
            "name" : "铜鼓县"
        },
        {
            "id"   : "1454",
            "pid"  : "1445",
            "type" : "2",
            "code" : "360981",
            "name" : "丰城市"
        },
        {
            "id"   : "1455",
            "pid"  : "1445",
            "type" : "2",
            "code" : "360982",
            "name" : "樟树市"
        },
        {
            "id"   : "1456",
            "pid"  : "1445",
            "type" : "2",
            "code" : "360983",
            "name" : "高安市"
        },
        {
            "id"   : "1457",
            "pid"  : "1361",
            "type" : "1",
            "code" : "361000",
            "name" : "抚州市"
        },
        {
            "id"   : "1458",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361001",
            "name" : "市辖区"
        },
        {
            "id"   : "1459",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361002",
            "name" : "临川区"
        },
        {
            "id"   : "1460",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361021",
            "name" : "南城县"
        },
        {
            "id"   : "1461",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361022",
            "name" : "黎川县"
        },
        {
            "id"   : "1462",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361023",
            "name" : "南丰县"
        },
        {
            "id"   : "1463",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361024",
            "name" : "崇仁县"
        },
        {
            "id"   : "1464",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361025",
            "name" : "乐安县"
        },
        {
            "id"   : "1465",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361026",
            "name" : "宜黄县"
        },
        {
            "id"   : "1466",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361027",
            "name" : "金溪县"
        },
        {
            "id"   : "1467",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361028",
            "name" : "资溪县"
        },
        {
            "id"   : "1468",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361029",
            "name" : "东乡县"
        },
        {
            "id"   : "1469",
            "pid"  : "1457",
            "type" : "2",
            "code" : "361030",
            "name" : "广昌县"
        },
        {
            "id"   : "1470",
            "pid"  : "1361",
            "type" : "1",
            "code" : "361100",
            "name" : "上饶市"
        },
        {
            "id"   : "1471",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361101",
            "name" : "市辖区"
        },
        {
            "id"   : "1472",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361102",
            "name" : "信州区"
        },
        {
            "id"   : "1473",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361121",
            "name" : "上饶县"
        },
        {
            "id"   : "1474",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361122",
            "name" : "广丰县"
        },
        {
            "id"   : "1475",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361123",
            "name" : "玉山县"
        },
        {
            "id"   : "1476",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361124",
            "name" : "铅山县"
        },
        {
            "id"   : "1477",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361125",
            "name" : "横峰县"
        },
        {
            "id"   : "1478",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361126",
            "name" : "弋阳县"
        },
        {
            "id"   : "1479",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361127",
            "name" : "余干县"
        },
        {
            "id"   : "1480",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361128",
            "name" : "鄱阳县"
        },
        {
            "id"   : "1481",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361129",
            "name" : "万年县"
        },
        {
            "id"   : "1482",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361130",
            "name" : "婺源县"
        },
        {
            "id"   : "1483",
            "pid"  : "1470",
            "type" : "2",
            "code" : "361181",
            "name" : "德兴市"
        },
        {
            "id"   : "1484",
            "pid"  : "0",
            "type" : "0",
            "code" : "370000",
            "name" : "山东省"
        },
        {
            "id"   : "1485",
            "pid"  : "1484",
            "type" : "1",
            "code" : "370100",
            "name" : "济南市"
        },
        {
            "id"   : "1486",
            "pid"  : "1485",
            "type" : "2",
            "code" : "370101",
            "name" : "市辖区"
        },
        {
            "id"   : "1487",
            "pid"  : "1485",
            "type" : "2",
            "code" : "370102",
            "name" : "历下区"
        },
        {
            "id"   : "1488",
            "pid"  : "1485",
            "type" : "2",
            "code" : "370103",
            "name" : "市中区"
        },
        {
            "id"   : "1489",
            "pid"  : "1485",
            "type" : "2",
            "code" : "370104",
            "name" : "槐荫区"
        },
        {
            "id"   : "1490",
            "pid"  : "1485",
            "type" : "2",
            "code" : "370105",
            "name" : "天桥区"
        },
        {
            "id"   : "1491",
            "pid"  : "1485",
            "type" : "2",
            "code" : "370112",
            "name" : "历城区"
        },
        {
            "id"   : "1492",
            "pid"  : "1485",
            "type" : "2",
            "code" : "370113",
            "name" : "长清区"
        },
        {
            "id"   : "1493",
            "pid"  : "1485",
            "type" : "2",
            "code" : "370124",
            "name" : "平阴县"
        },
        {
            "id"   : "1494",
            "pid"  : "1485",
            "type" : "2",
            "code" : "370125",
            "name" : "济阳县"
        },
        {
            "id"   : "1495",
            "pid"  : "1485",
            "type" : "2",
            "code" : "370126",
            "name" : "商河县"
        },
        {
            "id"   : "1496",
            "pid"  : "1485",
            "type" : "2",
            "code" : "370181",
            "name" : "章丘市"
        },
        {
            "id"   : "1497",
            "pid"  : "1484",
            "type" : "1",
            "code" : "370200",
            "name" : "青岛市"
        },
        {
            "id"   : "1498",
            "pid"  : "1497",
            "type" : "2",
            "code" : "370201",
            "name" : "市辖区"
        },
        {
            "id"   : "1499",
            "pid"  : "1497",
            "type" : "2",
            "code" : "370202",
            "name" : "市南区"
        },
        {
            "id"   : "1500",
            "pid"  : "1497",
            "type" : "2",
            "code" : "370203",
            "name" : "市北区"
        },
        {
            "id"   : "1501",
            "pid"  : "1497",
            "type" : "2",
            "code" : "370211",
            "name" : "黄岛区"
        },
        {
            "id"   : "1502",
            "pid"  : "1497",
            "type" : "2",
            "code" : "370212",
            "name" : "崂山区"
        },
        {
            "id"   : "1503",
            "pid"  : "1497",
            "type" : "2",
            "code" : "370213",
            "name" : "李沧区"
        },
        {
            "id"   : "1504",
            "pid"  : "1497",
            "type" : "2",
            "code" : "370214",
            "name" : "城阳区"
        },
        {
            "id"   : "1505",
            "pid"  : "1497",
            "type" : "2",
            "code" : "370281",
            "name" : "胶州市"
        },
        {
            "id"   : "1506",
            "pid"  : "1497",
            "type" : "2",
            "code" : "370282",
            "name" : "即墨市"
        },
        {
            "id"   : "1507",
            "pid"  : "1497",
            "type" : "2",
            "code" : "370283",
            "name" : "平度市"
        },
        {
            "id"   : "1508",
            "pid"  : "1497",
            "type" : "2",
            "code" : "370285",
            "name" : "莱西市"
        },
        {
            "id"   : "1509",
            "pid"  : "1484",
            "type" : "1",
            "code" : "370300",
            "name" : "淄博市"
        },
        {
            "id"   : "1510",
            "pid"  : "1509",
            "type" : "2",
            "code" : "370301",
            "name" : "市辖区"
        },
        {
            "id"   : "1511",
            "pid"  : "1509",
            "type" : "2",
            "code" : "370302",
            "name" : "淄川区"
        },
        {
            "id"   : "1512",
            "pid"  : "1509",
            "type" : "2",
            "code" : "370303",
            "name" : "张店区"
        },
        {
            "id"   : "1513",
            "pid"  : "1509",
            "type" : "2",
            "code" : "370304",
            "name" : "博山区"
        },
        {
            "id"   : "1514",
            "pid"  : "1509",
            "type" : "2",
            "code" : "370305",
            "name" : "临淄区"
        },
        {
            "id"   : "1515",
            "pid"  : "1509",
            "type" : "2",
            "code" : "370306",
            "name" : "周村区"
        },
        {
            "id"   : "1516",
            "pid"  : "1509",
            "type" : "2",
            "code" : "370321",
            "name" : "桓台县"
        },
        {
            "id"   : "1517",
            "pid"  : "1509",
            "type" : "2",
            "code" : "370322",
            "name" : "高青县"
        },
        {
            "id"   : "1518",
            "pid"  : "1509",
            "type" : "2",
            "code" : "370323",
            "name" : "沂源县"
        },
        {
            "id"   : "1519",
            "pid"  : "1484",
            "type" : "1",
            "code" : "370400",
            "name" : "枣庄市"
        },
        {
            "id"   : "1520",
            "pid"  : "1519",
            "type" : "2",
            "code" : "370401",
            "name" : "市辖区"
        },
        {
            "id"   : "1521",
            "pid"  : "1519",
            "type" : "2",
            "code" : "370402",
            "name" : "市中区"
        },
        {
            "id"   : "1522",
            "pid"  : "1519",
            "type" : "2",
            "code" : "370403",
            "name" : "薛城区"
        },
        {
            "id"   : "1523",
            "pid"  : "1519",
            "type" : "2",
            "code" : "370404",
            "name" : "峄城区"
        },
        {
            "id"   : "1524",
            "pid"  : "1519",
            "type" : "2",
            "code" : "370405",
            "name" : "台儿庄区"
        },
        {
            "id"   : "1525",
            "pid"  : "1519",
            "type" : "2",
            "code" : "370406",
            "name" : "山亭区"
        },
        {
            "id"   : "1526",
            "pid"  : "1519",
            "type" : "2",
            "code" : "370481",
            "name" : "滕州市"
        },
        {
            "id"   : "1527",
            "pid"  : "1484",
            "type" : "1",
            "code" : "370500",
            "name" : "东营市"
        },
        {
            "id"   : "1528",
            "pid"  : "1527",
            "type" : "2",
            "code" : "370501",
            "name" : "市辖区"
        },
        {
            "id"   : "1529",
            "pid"  : "1527",
            "type" : "2",
            "code" : "370502",
            "name" : "东营区"
        },
        {
            "id"   : "1530",
            "pid"  : "1527",
            "type" : "2",
            "code" : "370503",
            "name" : "河口区"
        },
        {
            "id"   : "1531",
            "pid"  : "1527",
            "type" : "2",
            "code" : "370521",
            "name" : "垦利县"
        },
        {
            "id"   : "1532",
            "pid"  : "1527",
            "type" : "2",
            "code" : "370522",
            "name" : "利津县"
        },
        {
            "id"   : "1533",
            "pid"  : "1527",
            "type" : "2",
            "code" : "370523",
            "name" : "广饶县"
        },
        {
            "id"   : "1534",
            "pid"  : "1484",
            "type" : "1",
            "code" : "370600",
            "name" : "烟台市"
        },
        {
            "id"   : "1535",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370601",
            "name" : "市辖区"
        },
        {
            "id"   : "1536",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370602",
            "name" : "芝罘区"
        },
        {
            "id"   : "1537",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370611",
            "name" : "福山区"
        },
        {
            "id"   : "1538",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370612",
            "name" : "牟平区"
        },
        {
            "id"   : "1539",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370613",
            "name" : "莱山区"
        },
        {
            "id"   : "1540",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370634",
            "name" : "长岛县"
        },
        {
            "id"   : "1541",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370681",
            "name" : "龙口市"
        },
        {
            "id"   : "1542",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370682",
            "name" : "莱阳市"
        },
        {
            "id"   : "1543",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370683",
            "name" : "莱州市"
        },
        {
            "id"   : "1544",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370684",
            "name" : "蓬莱市"
        },
        {
            "id"   : "1545",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370685",
            "name" : "招远市"
        },
        {
            "id"   : "1546",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370686",
            "name" : "栖霞市"
        },
        {
            "id"   : "1547",
            "pid"  : "1534",
            "type" : "2",
            "code" : "370687",
            "name" : "海阳市"
        },
        {
            "id"   : "1548",
            "pid"  : "1484",
            "type" : "1",
            "code" : "370700",
            "name" : "潍坊市"
        },
        {
            "id"   : "1549",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370701",
            "name" : "市辖区"
        },
        {
            "id"   : "1550",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370702",
            "name" : "潍城区"
        },
        {
            "id"   : "1551",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370703",
            "name" : "寒亭区"
        },
        {
            "id"   : "1552",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370704",
            "name" : "坊子区"
        },
        {
            "id"   : "1553",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370705",
            "name" : "奎文区"
        },
        {
            "id"   : "1554",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370724",
            "name" : "临朐县"
        },
        {
            "id"   : "1555",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370725",
            "name" : "昌乐县"
        },
        {
            "id"   : "1556",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370781",
            "name" : "青州市"
        },
        {
            "id"   : "1557",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370782",
            "name" : "诸城市"
        },
        {
            "id"   : "1558",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370783",
            "name" : "寿光市"
        },
        {
            "id"   : "1559",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370784",
            "name" : "安丘市"
        },
        {
            "id"   : "1560",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370785",
            "name" : "高密市"
        },
        {
            "id"   : "1561",
            "pid"  : "1548",
            "type" : "2",
            "code" : "370786",
            "name" : "昌邑市"
        },
        {
            "id"   : "1562",
            "pid"  : "1484",
            "type" : "1",
            "code" : "370800",
            "name" : "济宁市"
        },
        {
            "id"   : "1563",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370801",
            "name" : "市辖区"
        },
        {
            "id"   : "1564",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370811",
            "name" : "任城区"
        },
        {
            "id"   : "1565",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370812",
            "name" : "兖州区"
        },
        {
            "id"   : "1566",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370826",
            "name" : "微山县"
        },
        {
            "id"   : "1567",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370827",
            "name" : "鱼台县"
        },
        {
            "id"   : "1568",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370828",
            "name" : "金乡县"
        },
        {
            "id"   : "1569",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370829",
            "name" : "嘉祥县"
        },
        {
            "id"   : "1570",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370830",
            "name" : "汶上县"
        },
        {
            "id"   : "1571",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370831",
            "name" : "泗水县"
        },
        {
            "id"   : "1572",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370832",
            "name" : "梁山县"
        },
        {
            "id"   : "1573",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370881",
            "name" : "曲阜市"
        },
        {
            "id"   : "1574",
            "pid"  : "1562",
            "type" : "2",
            "code" : "370883",
            "name" : "邹城市"
        },
        {
            "id"   : "1575",
            "pid"  : "1484",
            "type" : "1",
            "code" : "370900",
            "name" : "泰安市"
        },
        {
            "id"   : "1576",
            "pid"  : "1575",
            "type" : "2",
            "code" : "370901",
            "name" : "市辖区"
        },
        {
            "id"   : "1577",
            "pid"  : "1575",
            "type" : "2",
            "code" : "370902",
            "name" : "泰山区"
        },
        {
            "id"   : "1578",
            "pid"  : "1575",
            "type" : "2",
            "code" : "370911",
            "name" : "岱岳区"
        },
        {
            "id"   : "1579",
            "pid"  : "1575",
            "type" : "2",
            "code" : "370921",
            "name" : "宁阳县"
        },
        {
            "id"   : "1580",
            "pid"  : "1575",
            "type" : "2",
            "code" : "370923",
            "name" : "东平县"
        },
        {
            "id"   : "1581",
            "pid"  : "1575",
            "type" : "2",
            "code" : "370982",
            "name" : "新泰市"
        },
        {
            "id"   : "1582",
            "pid"  : "1575",
            "type" : "2",
            "code" : "370983",
            "name" : "肥城市"
        },
        {
            "id"   : "1583",
            "pid"  : "1484",
            "type" : "1",
            "code" : "371000",
            "name" : "威海市"
        },
        {
            "id"   : "1584",
            "pid"  : "1583",
            "type" : "2",
            "code" : "371001",
            "name" : "市辖区"
        },
        {
            "id"   : "1585",
            "pid"  : "1583",
            "type" : "2",
            "code" : "371002",
            "name" : "环翠区"
        },
        {
            "id"   : "1586",
            "pid"  : "1583",
            "type" : "2",
            "code" : "371003",
            "name" : "文登区"
        },
        {
            "id"   : "1587",
            "pid"  : "1583",
            "type" : "2",
            "code" : "371082",
            "name" : "荣成市"
        },
        {
            "id"   : "1588",
            "pid"  : "1583",
            "type" : "2",
            "code" : "371083",
            "name" : "乳山市"
        },
        {
            "id"   : "1589",
            "pid"  : "1484",
            "type" : "1",
            "code" : "371100",
            "name" : "日照市"
        },
        {
            "id"   : "1590",
            "pid"  : "1589",
            "type" : "2",
            "code" : "371101",
            "name" : "市辖区"
        },
        {
            "id"   : "1591",
            "pid"  : "1589",
            "type" : "2",
            "code" : "371102",
            "name" : "东港区"
        },
        {
            "id"   : "1592",
            "pid"  : "1589",
            "type" : "2",
            "code" : "371103",
            "name" : "岚山区"
        },
        {
            "id"   : "1593",
            "pid"  : "1589",
            "type" : "2",
            "code" : "371121",
            "name" : "五莲县"
        },
        {
            "id"   : "1594",
            "pid"  : "1589",
            "type" : "2",
            "code" : "371122",
            "name" : "莒县"
        },
        {
            "id"   : "1595",
            "pid"  : "1484",
            "type" : "1",
            "code" : "371200",
            "name" : "莱芜市"
        },
        {
            "id"   : "1596",
            "pid"  : "1595",
            "type" : "2",
            "code" : "371201",
            "name" : "市辖区"
        },
        {
            "id"   : "1597",
            "pid"  : "1595",
            "type" : "2",
            "code" : "371202",
            "name" : "莱城区"
        },
        {
            "id"   : "1598",
            "pid"  : "1595",
            "type" : "2",
            "code" : "371203",
            "name" : "钢城区"
        },
        {
            "id"   : "1599",
            "pid"  : "1484",
            "type" : "1",
            "code" : "371300",
            "name" : "临沂市"
        },
        {
            "id"   : "1600",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371301",
            "name" : "市辖区"
        },
        {
            "id"   : "1601",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371302",
            "name" : "兰山区"
        },
        {
            "id"   : "1602",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371311",
            "name" : "罗庄区"
        },
        {
            "id"   : "1603",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371312",
            "name" : "河东区"
        },
        {
            "id"   : "1604",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371321",
            "name" : "沂南县"
        },
        {
            "id"   : "1605",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371322",
            "name" : "郯城县"
        },
        {
            "id"   : "1606",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371323",
            "name" : "沂水县"
        },
        {
            "id"   : "1607",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371324",
            "name" : "兰陵县"
        },
        {
            "id"   : "1608",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371325",
            "name" : "费县"
        },
        {
            "id"   : "1609",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371326",
            "name" : "平邑县"
        },
        {
            "id"   : "1610",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371327",
            "name" : "莒南县"
        },
        {
            "id"   : "1611",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371328",
            "name" : "蒙阴县"
        },
        {
            "id"   : "1612",
            "pid"  : "1599",
            "type" : "2",
            "code" : "371329",
            "name" : "临沭县"
        },
        {
            "id"   : "1613",
            "pid"  : "1484",
            "type" : "1",
            "code" : "371400",
            "name" : "德州市"
        },
        {
            "id"   : "1614",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371401",
            "name" : "市辖区"
        },
        {
            "id"   : "1615",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371402",
            "name" : "德城区"
        },
        {
            "id"   : "1616",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371403",
            "name" : "陵城区"
        },
        {
            "id"   : "1617",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371422",
            "name" : "宁津县"
        },
        {
            "id"   : "1618",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371423",
            "name" : "庆云县"
        },
        {
            "id"   : "1619",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371424",
            "name" : "临邑县"
        },
        {
            "id"   : "1620",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371425",
            "name" : "齐河县"
        },
        {
            "id"   : "1621",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371426",
            "name" : "平原县"
        },
        {
            "id"   : "1622",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371427",
            "name" : "夏津县"
        },
        {
            "id"   : "1623",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371428",
            "name" : "武城县"
        },
        {
            "id"   : "1624",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371481",
            "name" : "乐陵市"
        },
        {
            "id"   : "1625",
            "pid"  : "1613",
            "type" : "2",
            "code" : "371482",
            "name" : "禹城市"
        },
        {
            "id"   : "1626",
            "pid"  : "1484",
            "type" : "1",
            "code" : "371500",
            "name" : "聊城市"
        },
        {
            "id"   : "1627",
            "pid"  : "1626",
            "type" : "2",
            "code" : "371501",
            "name" : "市辖区"
        },
        {
            "id"   : "1628",
            "pid"  : "1626",
            "type" : "2",
            "code" : "371502",
            "name" : "东昌府区"
        },
        {
            "id"   : "1629",
            "pid"  : "1626",
            "type" : "2",
            "code" : "371521",
            "name" : "阳谷县"
        },
        {
            "id"   : "1630",
            "pid"  : "1626",
            "type" : "2",
            "code" : "371522",
            "name" : "莘县"
        },
        {
            "id"   : "1631",
            "pid"  : "1626",
            "type" : "2",
            "code" : "371523",
            "name" : "茌平县"
        },
        {
            "id"   : "1632",
            "pid"  : "1626",
            "type" : "2",
            "code" : "371524",
            "name" : "东阿县"
        },
        {
            "id"   : "1633",
            "pid"  : "1626",
            "type" : "2",
            "code" : "371525",
            "name" : "冠县"
        },
        {
            "id"   : "1634",
            "pid"  : "1626",
            "type" : "2",
            "code" : "371526",
            "name" : "高唐县"
        },
        {
            "id"   : "1635",
            "pid"  : "1626",
            "type" : "2",
            "code" : "371581",
            "name" : "临清市"
        },
        {
            "id"   : "1636",
            "pid"  : "1484",
            "type" : "1",
            "code" : "371600",
            "name" : "滨州市"
        },
        {
            "id"   : "1637",
            "pid"  : "1636",
            "type" : "2",
            "code" : "371601",
            "name" : "市辖区"
        },
        {
            "id"   : "1638",
            "pid"  : "1636",
            "type" : "2",
            "code" : "371602",
            "name" : "滨城区"
        },
        {
            "id"   : "1639",
            "pid"  : "1636",
            "type" : "2",
            "code" : "371603",
            "name" : "沾化区"
        },
        {
            "id"   : "1640",
            "pid"  : "1636",
            "type" : "2",
            "code" : "371621",
            "name" : "惠民县"
        },
        {
            "id"   : "1641",
            "pid"  : "1636",
            "type" : "2",
            "code" : "371622",
            "name" : "阳信县"
        },
        {
            "id"   : "1642",
            "pid"  : "1636",
            "type" : "2",
            "code" : "371623",
            "name" : "无棣县"
        },
        {
            "id"   : "1643",
            "pid"  : "1636",
            "type" : "2",
            "code" : "371625",
            "name" : "博兴县"
        },
        {
            "id"   : "1644",
            "pid"  : "1636",
            "type" : "2",
            "code" : "371626",
            "name" : "邹平县"
        },
        {
            "id"   : "1645",
            "pid"  : "1484",
            "type" : "1",
            "code" : "371700",
            "name" : "菏泽市"
        },
        {
            "id"   : "1646",
            "pid"  : "1645",
            "type" : "2",
            "code" : "371701",
            "name" : "市辖区"
        },
        {
            "id"   : "1647",
            "pid"  : "1645",
            "type" : "2",
            "code" : "371702",
            "name" : "牡丹区"
        },
        {
            "id"   : "1648",
            "pid"  : "1645",
            "type" : "2",
            "code" : "371721",
            "name" : "曹县"
        },
        {
            "id"   : "1649",
            "pid"  : "1645",
            "type" : "2",
            "code" : "371722",
            "name" : "单县"
        },
        {
            "id"   : "1650",
            "pid"  : "1645",
            "type" : "2",
            "code" : "371723",
            "name" : "成武县"
        },
        {
            "id"   : "1651",
            "pid"  : "1645",
            "type" : "2",
            "code" : "371724",
            "name" : "巨野县"
        },
        {
            "id"   : "1652",
            "pid"  : "1645",
            "type" : "2",
            "code" : "371725",
            "name" : "郓城县"
        },
        {
            "id"   : "1653",
            "pid"  : "1645",
            "type" : "2",
            "code" : "371726",
            "name" : "鄄城县"
        },
        {
            "id"   : "1654",
            "pid"  : "1645",
            "type" : "2",
            "code" : "371727",
            "name" : "定陶县"
        },
        {
            "id"   : "1655",
            "pid"  : "1645",
            "type" : "2",
            "code" : "371728",
            "name" : "东明县"
        },
        {
            "id"   : "1656",
            "pid"  : "0",
            "type" : "0",
            "code" : "410000",
            "name" : "河南省"
        },
        {
            "id"   : "1657",
            "pid"  : "1656",
            "type" : "1",
            "code" : "410100",
            "name" : "郑州市"
        },
        {
            "id"   : "1658",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410101",
            "name" : "市辖区"
        },
        {
            "id"   : "1659",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410102",
            "name" : "中原区"
        },
        {
            "id"   : "1660",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410103",
            "name" : "二七区"
        },
        {
            "id"   : "1661",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410104",
            "name" : "管城回族区"
        },
        {
            "id"   : "1662",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410105",
            "name" : "金水区"
        },
        {
            "id"   : "1663",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410106",
            "name" : "上街区"
        },
        {
            "id"   : "1664",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410108",
            "name" : "惠济区"
        },
        {
            "id"   : "1665",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410122",
            "name" : "中牟县"
        },
        {
            "id"   : "1666",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410181",
            "name" : "巩义市"
        },
        {
            "id"   : "1667",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410182",
            "name" : "荥阳市"
        },
        {
            "id"   : "1668",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410183",
            "name" : "新密市"
        },
        {
            "id"   : "1669",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410184",
            "name" : "新郑市"
        },
        {
            "id"   : "1670",
            "pid"  : "1657",
            "type" : "2",
            "code" : "410185",
            "name" : "登封市"
        },
        {
            "id"   : "1671",
            "pid"  : "1656",
            "type" : "1",
            "code" : "410200",
            "name" : "开封市"
        },
        {
            "id"   : "1672",
            "pid"  : "1671",
            "type" : "2",
            "code" : "410201",
            "name" : "市辖区"
        },
        {
            "id"   : "1673",
            "pid"  : "1671",
            "type" : "2",
            "code" : "410202",
            "name" : "龙亭区"
        },
        {
            "id"   : "1674",
            "pid"  : "1671",
            "type" : "2",
            "code" : "410203",
            "name" : "顺河回族区"
        },
        {
            "id"   : "1675",
            "pid"  : "1671",
            "type" : "2",
            "code" : "410204",
            "name" : "鼓楼区"
        },
        {
            "id"   : "1676",
            "pid"  : "1671",
            "type" : "2",
            "code" : "410205",
            "name" : "禹王台区"
        },
        {
            "id"   : "1677",
            "pid"  : "1671",
            "type" : "2",
            "code" : "410211",
            "name" : "金明区"
        },
        {
            "id"   : "1678",
            "pid"  : "1671",
            "type" : "2",
            "code" : "410221",
            "name" : "杞县"
        },
        {
            "id"   : "1679",
            "pid"  : "1671",
            "type" : "2",
            "code" : "410222",
            "name" : "通许县"
        },
        {
            "id"   : "1680",
            "pid"  : "1671",
            "type" : "2",
            "code" : "410223",
            "name" : "尉氏县"
        },
        {
            "id"   : "1681",
            "pid"  : "1671",
            "type" : "2",
            "code" : "410224",
            "name" : "开封县"
        },
        {
            "id"   : "1682",
            "pid"  : "1671",
            "type" : "2",
            "code" : "410225",
            "name" : "兰考县"
        },
        {
            "id"   : "1683",
            "pid"  : "1656",
            "type" : "1",
            "code" : "410300",
            "name" : "洛阳市"
        },
        {
            "id"   : "1684",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410301",
            "name" : "市辖区"
        },
        {
            "id"   : "1685",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410302",
            "name" : "老城区"
        },
        {
            "id"   : "1686",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410303",
            "name" : "西工区"
        },
        {
            "id"   : "1687",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410304",
            "name" : "瀍河回族区"
        },
        {
            "id"   : "1688",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410305",
            "name" : "涧西区"
        },
        {
            "id"   : "1689",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410306",
            "name" : "吉利区"
        },
        {
            "id"   : "1690",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410311",
            "name" : "洛龙区"
        },
        {
            "id"   : "1691",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410322",
            "name" : "孟津县"
        },
        {
            "id"   : "1692",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410323",
            "name" : "新安县"
        },
        {
            "id"   : "1693",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410324",
            "name" : "栾川县"
        },
        {
            "id"   : "1694",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410325",
            "name" : "嵩县"
        },
        {
            "id"   : "1695",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410326",
            "name" : "汝阳县"
        },
        {
            "id"   : "1696",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410327",
            "name" : "宜阳县"
        },
        {
            "id"   : "1697",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410328",
            "name" : "洛宁县"
        },
        {
            "id"   : "1698",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410329",
            "name" : "伊川县"
        },
        {
            "id"   : "1699",
            "pid"  : "1683",
            "type" : "2",
            "code" : "410381",
            "name" : "偃师市"
        },
        {
            "id"   : "1700",
            "pid"  : "1656",
            "type" : "1",
            "code" : "410400",
            "name" : "平顶山市"
        },
        {
            "id"   : "1701",
            "pid"  : "1700",
            "type" : "2",
            "code" : "410401",
            "name" : "市辖区"
        },
        {
            "id"   : "1702",
            "pid"  : "1700",
            "type" : "2",
            "code" : "410402",
            "name" : "新华区"
        },
        {
            "id"   : "1703",
            "pid"  : "1700",
            "type" : "2",
            "code" : "410403",
            "name" : "卫东区"
        },
        {
            "id"   : "1704",
            "pid"  : "1700",
            "type" : "2",
            "code" : "410404",
            "name" : "石龙区"
        },
        {
            "id"   : "1705",
            "pid"  : "1700",
            "type" : "2",
            "code" : "410411",
            "name" : "湛河区"
        },
        {
            "id"   : "1706",
            "pid"  : "1700",
            "type" : "2",
            "code" : "410421",
            "name" : "宝丰县"
        },
        {
            "id"   : "1707",
            "pid"  : "1700",
            "type" : "2",
            "code" : "410422",
            "name" : "叶县"
        },
        {
            "id"   : "1708",
            "pid"  : "1700",
            "type" : "2",
            "code" : "410423",
            "name" : "鲁山县"
        },
        {
            "id"   : "1709",
            "pid"  : "1700",
            "type" : "2",
            "code" : "410425",
            "name" : "郏县"
        },
        {
            "id"   : "1710",
            "pid"  : "1700",
            "type" : "2",
            "code" : "410481",
            "name" : "舞钢市"
        },
        {
            "id"   : "1711",
            "pid"  : "1700",
            "type" : "2",
            "code" : "410482",
            "name" : "汝州市"
        },
        {
            "id"   : "1712",
            "pid"  : "1656",
            "type" : "1",
            "code" : "410500",
            "name" : "安阳市"
        },
        {
            "id"   : "1713",
            "pid"  : "1712",
            "type" : "2",
            "code" : "410501",
            "name" : "市辖区"
        },
        {
            "id"   : "1714",
            "pid"  : "1712",
            "type" : "2",
            "code" : "410502",
            "name" : "文峰区"
        },
        {
            "id"   : "1715",
            "pid"  : "1712",
            "type" : "2",
            "code" : "410503",
            "name" : "北关区"
        },
        {
            "id"   : "1716",
            "pid"  : "1712",
            "type" : "2",
            "code" : "410505",
            "name" : "殷都区"
        },
        {
            "id"   : "1717",
            "pid"  : "1712",
            "type" : "2",
            "code" : "410506",
            "name" : "龙安区"
        },
        {
            "id"   : "1718",
            "pid"  : "1712",
            "type" : "2",
            "code" : "410522",
            "name" : "安阳县"
        },
        {
            "id"   : "1719",
            "pid"  : "1712",
            "type" : "2",
            "code" : "410523",
            "name" : "汤阴县"
        },
        {
            "id"   : "1720",
            "pid"  : "1712",
            "type" : "2",
            "code" : "410526",
            "name" : "滑县"
        },
        {
            "id"   : "1721",
            "pid"  : "1712",
            "type" : "2",
            "code" : "410527",
            "name" : "内黄县"
        },
        {
            "id"   : "1722",
            "pid"  : "1712",
            "type" : "2",
            "code" : "410581",
            "name" : "林州市"
        },
        {
            "id"   : "1723",
            "pid"  : "1656",
            "type" : "1",
            "code" : "410600",
            "name" : "鹤壁市"
        },
        {
            "id"   : "1724",
            "pid"  : "1723",
            "type" : "2",
            "code" : "410601",
            "name" : "市辖区"
        },
        {
            "id"   : "1725",
            "pid"  : "1723",
            "type" : "2",
            "code" : "410602",
            "name" : "鹤山区"
        },
        {
            "id"   : "1726",
            "pid"  : "1723",
            "type" : "2",
            "code" : "410603",
            "name" : "山城区"
        },
        {
            "id"   : "1727",
            "pid"  : "1723",
            "type" : "2",
            "code" : "410611",
            "name" : "淇滨区"
        },
        {
            "id"   : "1728",
            "pid"  : "1723",
            "type" : "2",
            "code" : "410621",
            "name" : "浚县"
        },
        {
            "id"   : "1729",
            "pid"  : "1723",
            "type" : "2",
            "code" : "410622",
            "name" : "淇县"
        },
        {
            "id"   : "1730",
            "pid"  : "1656",
            "type" : "1",
            "code" : "410700",
            "name" : "新乡市"
        },
        {
            "id"   : "1731",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410701",
            "name" : "市辖区"
        },
        {
            "id"   : "1732",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410702",
            "name" : "红旗区"
        },
        {
            "id"   : "1733",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410703",
            "name" : "卫滨区"
        },
        {
            "id"   : "1734",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410704",
            "name" : "凤泉区"
        },
        {
            "id"   : "1735",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410711",
            "name" : "牧野区"
        },
        {
            "id"   : "1736",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410721",
            "name" : "新乡县"
        },
        {
            "id"   : "1737",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410724",
            "name" : "获嘉县"
        },
        {
            "id"   : "1738",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410725",
            "name" : "原阳县"
        },
        {
            "id"   : "1739",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410726",
            "name" : "延津县"
        },
        {
            "id"   : "1740",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410727",
            "name" : "封丘县"
        },
        {
            "id"   : "1741",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410728",
            "name" : "长垣县"
        },
        {
            "id"   : "1742",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410781",
            "name" : "卫辉市"
        },
        {
            "id"   : "1743",
            "pid"  : "1730",
            "type" : "2",
            "code" : "410782",
            "name" : "辉县市"
        },
        {
            "id"   : "1744",
            "pid"  : "1656",
            "type" : "1",
            "code" : "410800",
            "name" : "焦作市"
        },
        {
            "id"   : "1745",
            "pid"  : "1744",
            "type" : "2",
            "code" : "410801",
            "name" : "市辖区"
        },
        {
            "id"   : "1746",
            "pid"  : "1744",
            "type" : "2",
            "code" : "410802",
            "name" : "解放区"
        },
        {
            "id"   : "1747",
            "pid"  : "1744",
            "type" : "2",
            "code" : "410803",
            "name" : "中站区"
        },
        {
            "id"   : "1748",
            "pid"  : "1744",
            "type" : "2",
            "code" : "410804",
            "name" : "马村区"
        },
        {
            "id"   : "1749",
            "pid"  : "1744",
            "type" : "2",
            "code" : "410811",
            "name" : "山阳区"
        },
        {
            "id"   : "1750",
            "pid"  : "1744",
            "type" : "2",
            "code" : "410821",
            "name" : "修武县"
        },
        {
            "id"   : "1751",
            "pid"  : "1744",
            "type" : "2",
            "code" : "410822",
            "name" : "博爱县"
        },
        {
            "id"   : "1752",
            "pid"  : "1744",
            "type" : "2",
            "code" : "410823",
            "name" : "武陟县"
        },
        {
            "id"   : "1753",
            "pid"  : "1744",
            "type" : "2",
            "code" : "410825",
            "name" : "温县"
        },
        {
            "id"   : "1754",
            "pid"  : "1744",
            "type" : "2",
            "code" : "410882",
            "name" : "沁阳市"
        },
        {
            "id"   : "1755",
            "pid"  : "1744",
            "type" : "2",
            "code" : "410883",
            "name" : "孟州市"
        },
        {
            "id"   : "1756",
            "pid"  : "1656",
            "type" : "1",
            "code" : "410900",
            "name" : "濮阳市"
        },
        {
            "id"   : "1757",
            "pid"  : "1756",
            "type" : "2",
            "code" : "410901",
            "name" : "市辖区"
        },
        {
            "id"   : "1758",
            "pid"  : "1756",
            "type" : "2",
            "code" : "410902",
            "name" : "华龙区"
        },
        {
            "id"   : "1759",
            "pid"  : "1756",
            "type" : "2",
            "code" : "410922",
            "name" : "清丰县"
        },
        {
            "id"   : "1760",
            "pid"  : "1756",
            "type" : "2",
            "code" : "410923",
            "name" : "南乐县"
        },
        {
            "id"   : "1761",
            "pid"  : "1756",
            "type" : "2",
            "code" : "410926",
            "name" : "范县"
        },
        {
            "id"   : "1762",
            "pid"  : "1756",
            "type" : "2",
            "code" : "410927",
            "name" : "台前县"
        },
        {
            "id"   : "1763",
            "pid"  : "1756",
            "type" : "2",
            "code" : "410928",
            "name" : "濮阳县"
        },
        {
            "id"   : "1764",
            "pid"  : "1656",
            "type" : "1",
            "code" : "411000",
            "name" : "许昌市"
        },
        {
            "id"   : "1765",
            "pid"  : "1764",
            "type" : "2",
            "code" : "411001",
            "name" : "市辖区"
        },
        {
            "id"   : "1766",
            "pid"  : "1764",
            "type" : "2",
            "code" : "411002",
            "name" : "魏都区"
        },
        {
            "id"   : "1767",
            "pid"  : "1764",
            "type" : "2",
            "code" : "411023",
            "name" : "许昌县"
        },
        {
            "id"   : "1768",
            "pid"  : "1764",
            "type" : "2",
            "code" : "411024",
            "name" : "鄢陵县"
        },
        {
            "id"   : "1769",
            "pid"  : "1764",
            "type" : "2",
            "code" : "411025",
            "name" : "襄城县"
        },
        {
            "id"   : "1770",
            "pid"  : "1764",
            "type" : "2",
            "code" : "411081",
            "name" : "禹州市"
        },
        {
            "id"   : "1771",
            "pid"  : "1764",
            "type" : "2",
            "code" : "411082",
            "name" : "长葛市"
        },
        {
            "id"   : "1772",
            "pid"  : "1656",
            "type" : "1",
            "code" : "411100",
            "name" : "漯河市"
        },
        {
            "id"   : "1773",
            "pid"  : "1772",
            "type" : "2",
            "code" : "411101",
            "name" : "市辖区"
        },
        {
            "id"   : "1774",
            "pid"  : "1772",
            "type" : "2",
            "code" : "411102",
            "name" : "源汇区"
        },
        {
            "id"   : "1775",
            "pid"  : "1772",
            "type" : "2",
            "code" : "411103",
            "name" : "郾城区"
        },
        {
            "id"   : "1776",
            "pid"  : "1772",
            "type" : "2",
            "code" : "411104",
            "name" : "召陵区"
        },
        {
            "id"   : "1777",
            "pid"  : "1772",
            "type" : "2",
            "code" : "411121",
            "name" : "舞阳县"
        },
        {
            "id"   : "1778",
            "pid"  : "1772",
            "type" : "2",
            "code" : "411122",
            "name" : "临颍县"
        },
        {
            "id"   : "1779",
            "pid"  : "1656",
            "type" : "1",
            "code" : "411200",
            "name" : "三门峡市"
        },
        {
            "id"   : "1780",
            "pid"  : "1779",
            "type" : "2",
            "code" : "411201",
            "name" : "市辖区"
        },
        {
            "id"   : "1781",
            "pid"  : "1779",
            "type" : "2",
            "code" : "411202",
            "name" : "湖滨区"
        },
        {
            "id"   : "1782",
            "pid"  : "1779",
            "type" : "2",
            "code" : "411221",
            "name" : "渑池县"
        },
        {
            "id"   : "1783",
            "pid"  : "1779",
            "type" : "2",
            "code" : "411222",
            "name" : "陕县"
        },
        {
            "id"   : "1784",
            "pid"  : "1779",
            "type" : "2",
            "code" : "411224",
            "name" : "卢氏县"
        },
        {
            "id"   : "1785",
            "pid"  : "1779",
            "type" : "2",
            "code" : "411281",
            "name" : "义马市"
        },
        {
            "id"   : "1786",
            "pid"  : "1779",
            "type" : "2",
            "code" : "411282",
            "name" : "灵宝市"
        },
        {
            "id"   : "1787",
            "pid"  : "1656",
            "type" : "1",
            "code" : "411300",
            "name" : "南阳市"
        },
        {
            "id"   : "1788",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411301",
            "name" : "市辖区"
        },
        {
            "id"   : "1789",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411302",
            "name" : "宛城区"
        },
        {
            "id"   : "1790",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411303",
            "name" : "卧龙区"
        },
        {
            "id"   : "1791",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411321",
            "name" : "南召县"
        },
        {
            "id"   : "1792",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411322",
            "name" : "方城县"
        },
        {
            "id"   : "1793",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411323",
            "name" : "西峡县"
        },
        {
            "id"   : "1794",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411324",
            "name" : "镇平县"
        },
        {
            "id"   : "1795",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411325",
            "name" : "内乡县"
        },
        {
            "id"   : "1796",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411326",
            "name" : "淅川县"
        },
        {
            "id"   : "1797",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411327",
            "name" : "社旗县"
        },
        {
            "id"   : "1798",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411328",
            "name" : "唐河县"
        },
        {
            "id"   : "1799",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411329",
            "name" : "新野县"
        },
        {
            "id"   : "1800",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411330",
            "name" : "桐柏县"
        },
        {
            "id"   : "1801",
            "pid"  : "1787",
            "type" : "2",
            "code" : "411381",
            "name" : "邓州市"
        },
        {
            "id"   : "1802",
            "pid"  : "1656",
            "type" : "1",
            "code" : "411400",
            "name" : "商丘市"
        },
        {
            "id"   : "1803",
            "pid"  : "1802",
            "type" : "2",
            "code" : "411401",
            "name" : "市辖区"
        },
        {
            "id"   : "1804",
            "pid"  : "1802",
            "type" : "2",
            "code" : "411402",
            "name" : "梁园区"
        },
        {
            "id"   : "1805",
            "pid"  : "1802",
            "type" : "2",
            "code" : "411403",
            "name" : "睢阳区"
        },
        {
            "id"   : "1806",
            "pid"  : "1802",
            "type" : "2",
            "code" : "411421",
            "name" : "民权县"
        },
        {
            "id"   : "1807",
            "pid"  : "1802",
            "type" : "2",
            "code" : "411422",
            "name" : "睢县"
        },
        {
            "id"   : "1808",
            "pid"  : "1802",
            "type" : "2",
            "code" : "411423",
            "name" : "宁陵县"
        },
        {
            "id"   : "1809",
            "pid"  : "1802",
            "type" : "2",
            "code" : "411424",
            "name" : "柘城县"
        },
        {
            "id"   : "1810",
            "pid"  : "1802",
            "type" : "2",
            "code" : "411425",
            "name" : "虞城县"
        },
        {
            "id"   : "1811",
            "pid"  : "1802",
            "type" : "2",
            "code" : "411426",
            "name" : "夏邑县"
        },
        {
            "id"   : "1812",
            "pid"  : "1802",
            "type" : "2",
            "code" : "411481",
            "name" : "永城市"
        },
        {
            "id"   : "1813",
            "pid"  : "1656",
            "type" : "1",
            "code" : "411500",
            "name" : "信阳市"
        },
        {
            "id"   : "1814",
            "pid"  : "1813",
            "type" : "2",
            "code" : "411501",
            "name" : "市辖区"
        },
        {
            "id"   : "1815",
            "pid"  : "1813",
            "type" : "2",
            "code" : "411502",
            "name" : "浉河区"
        },
        {
            "id"   : "1816",
            "pid"  : "1813",
            "type" : "2",
            "code" : "411503",
            "name" : "平桥区"
        },
        {
            "id"   : "1817",
            "pid"  : "1813",
            "type" : "2",
            "code" : "411521",
            "name" : "罗山县"
        },
        {
            "id"   : "1818",
            "pid"  : "1813",
            "type" : "2",
            "code" : "411522",
            "name" : "光山县"
        },
        {
            "id"   : "1819",
            "pid"  : "1813",
            "type" : "2",
            "code" : "411523",
            "name" : "新县"
        },
        {
            "id"   : "1820",
            "pid"  : "1813",
            "type" : "2",
            "code" : "411524",
            "name" : "商城县"
        },
        {
            "id"   : "1821",
            "pid"  : "1813",
            "type" : "2",
            "code" : "411525",
            "name" : "固始县"
        },
        {
            "id"   : "1822",
            "pid"  : "1813",
            "type" : "2",
            "code" : "411526",
            "name" : "潢川县"
        },
        {
            "id"   : "1823",
            "pid"  : "1813",
            "type" : "2",
            "code" : "411527",
            "name" : "淮滨县"
        },
        {
            "id"   : "1824",
            "pid"  : "1813",
            "type" : "2",
            "code" : "411528",
            "name" : "息县"
        },
        {
            "id"   : "1825",
            "pid"  : "1656",
            "type" : "1",
            "code" : "411600",
            "name" : "周口市"
        },
        {
            "id"   : "1826",
            "pid"  : "1825",
            "type" : "2",
            "code" : "411601",
            "name" : "市辖区"
        },
        {
            "id"   : "1827",
            "pid"  : "1825",
            "type" : "2",
            "code" : "411602",
            "name" : "川汇区"
        },
        {
            "id"   : "1828",
            "pid"  : "1825",
            "type" : "2",
            "code" : "411621",
            "name" : "扶沟县"
        },
        {
            "id"   : "1829",
            "pid"  : "1825",
            "type" : "2",
            "code" : "411622",
            "name" : "西华县"
        },
        {
            "id"   : "1830",
            "pid"  : "1825",
            "type" : "2",
            "code" : "411623",
            "name" : "商水县"
        },
        {
            "id"   : "1831",
            "pid"  : "1825",
            "type" : "2",
            "code" : "411624",
            "name" : "沈丘县"
        },
        {
            "id"   : "1832",
            "pid"  : "1825",
            "type" : "2",
            "code" : "411625",
            "name" : "郸城县"
        },
        {
            "id"   : "1833",
            "pid"  : "1825",
            "type" : "2",
            "code" : "411626",
            "name" : "淮阳县"
        },
        {
            "id"   : "1834",
            "pid"  : "1825",
            "type" : "2",
            "code" : "411627",
            "name" : "太康县"
        },
        {
            "id"   : "1835",
            "pid"  : "1825",
            "type" : "2",
            "code" : "411628",
            "name" : "鹿邑县"
        },
        {
            "id"   : "1836",
            "pid"  : "1825",
            "type" : "2",
            "code" : "411681",
            "name" : "项城市"
        },
        {
            "id"   : "1837",
            "pid"  : "1656",
            "type" : "1",
            "code" : "411700",
            "name" : "驻马店市"
        },
        {
            "id"   : "1838",
            "pid"  : "1837",
            "type" : "2",
            "code" : "411701",
            "name" : "市辖区"
        },
        {
            "id"   : "1839",
            "pid"  : "1837",
            "type" : "2",
            "code" : "411702",
            "name" : "驿城区"
        },
        {
            "id"   : "1840",
            "pid"  : "1837",
            "type" : "2",
            "code" : "411721",
            "name" : "西平县"
        },
        {
            "id"   : "1841",
            "pid"  : "1837",
            "type" : "2",
            "code" : "411722",
            "name" : "上蔡县"
        },
        {
            "id"   : "1842",
            "pid"  : "1837",
            "type" : "2",
            "code" : "411723",
            "name" : "平舆县"
        },
        {
            "id"   : "1843",
            "pid"  : "1837",
            "type" : "2",
            "code" : "411724",
            "name" : "正阳县"
        },
        {
            "id"   : "1844",
            "pid"  : "1837",
            "type" : "2",
            "code" : "411725",
            "name" : "确山县"
        },
        {
            "id"   : "1845",
            "pid"  : "1837",
            "type" : "2",
            "code" : "411726",
            "name" : "泌阳县"
        },
        {
            "id"   : "1846",
            "pid"  : "1837",
            "type" : "2",
            "code" : "411727",
            "name" : "汝南县"
        },
        {
            "id"   : "1847",
            "pid"  : "1837",
            "type" : "2",
            "code" : "411728",
            "name" : "遂平县"
        },
        {
            "id"   : "1848",
            "pid"  : "1837",
            "type" : "2",
            "code" : "411729",
            "name" : "新蔡县"
        },
        {
            "id"   : "1849",
            "pid"  : "1656",
            "type" : "1",
            "code" : "419000",
            "name" : "省直辖县级行政区划"
        },
        {
            "id"   : "1850",
            "pid"  : "1849",
            "type" : "2",
            "code" : "419001",
            "name" : "济源市"
        },
        {
            "id"   : "1851",
            "pid"  : "0",
            "type" : "0",
            "code" : "420000",
            "name" : "湖北省"
        },
        {
            "id"   : "1852",
            "pid"  : "1851",
            "type" : "1",
            "code" : "420100",
            "name" : "武汉市"
        },
        {
            "id"   : "1853",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420101",
            "name" : "市辖区"
        },
        {
            "id"   : "1854",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420102",
            "name" : "江岸区"
        },
        {
            "id"   : "1855",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420103",
            "name" : "江汉区"
        },
        {
            "id"   : "1856",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420104",
            "name" : "硚口区"
        },
        {
            "id"   : "1857",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420105",
            "name" : "汉阳区"
        },
        {
            "id"   : "1858",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420106",
            "name" : "武昌区"
        },
        {
            "id"   : "1859",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420107",
            "name" : "青山区"
        },
        {
            "id"   : "1860",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420111",
            "name" : "洪山区"
        },
        {
            "id"   : "1861",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420112",
            "name" : "东西湖区"
        },
        {
            "id"   : "1862",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420113",
            "name" : "汉南区"
        },
        {
            "id"   : "1863",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420114",
            "name" : "蔡甸区"
        },
        {
            "id"   : "1864",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420115",
            "name" : "江夏区"
        },
        {
            "id"   : "1865",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420116",
            "name" : "黄陂区"
        },
        {
            "id"   : "1866",
            "pid"  : "1852",
            "type" : "2",
            "code" : "420117",
            "name" : "新洲区"
        },
        {
            "id"   : "1867",
            "pid"  : "1851",
            "type" : "1",
            "code" : "420200",
            "name" : "黄石市"
        },
        {
            "id"   : "1868",
            "pid"  : "1867",
            "type" : "2",
            "code" : "420201",
            "name" : "市辖区"
        },
        {
            "id"   : "1869",
            "pid"  : "1867",
            "type" : "2",
            "code" : "420202",
            "name" : "黄石港区"
        },
        {
            "id"   : "1870",
            "pid"  : "1867",
            "type" : "2",
            "code" : "420203",
            "name" : "西塞山区"
        },
        {
            "id"   : "1871",
            "pid"  : "1867",
            "type" : "2",
            "code" : "420204",
            "name" : "下陆区"
        },
        {
            "id"   : "1872",
            "pid"  : "1867",
            "type" : "2",
            "code" : "420205",
            "name" : "铁山区"
        },
        {
            "id"   : "1873",
            "pid"  : "1867",
            "type" : "2",
            "code" : "420222",
            "name" : "阳新县"
        },
        {
            "id"   : "1874",
            "pid"  : "1867",
            "type" : "2",
            "code" : "420281",
            "name" : "大冶市"
        },
        {
            "id"   : "1875",
            "pid"  : "1851",
            "type" : "1",
            "code" : "420300",
            "name" : "十堰市"
        },
        {
            "id"   : "1876",
            "pid"  : "1875",
            "type" : "2",
            "code" : "420301",
            "name" : "市辖区"
        },
        {
            "id"   : "1877",
            "pid"  : "1875",
            "type" : "2",
            "code" : "420302",
            "name" : "茅箭区"
        },
        {
            "id"   : "1878",
            "pid"  : "1875",
            "type" : "2",
            "code" : "420303",
            "name" : "张湾区"
        },
        {
            "id"   : "1879",
            "pid"  : "1875",
            "type" : "2",
            "code" : "420304",
            "name" : "郧阳区"
        },
        {
            "id"   : "1880",
            "pid"  : "1875",
            "type" : "2",
            "code" : "420322",
            "name" : "郧西县"
        },
        {
            "id"   : "1881",
            "pid"  : "1875",
            "type" : "2",
            "code" : "420323",
            "name" : "竹山县"
        },
        {
            "id"   : "1882",
            "pid"  : "1875",
            "type" : "2",
            "code" : "420324",
            "name" : "竹溪县"
        },
        {
            "id"   : "1883",
            "pid"  : "1875",
            "type" : "2",
            "code" : "420325",
            "name" : "房县"
        },
        {
            "id"   : "1884",
            "pid"  : "1875",
            "type" : "2",
            "code" : "420381",
            "name" : "丹江口市"
        },
        {
            "id"   : "1885",
            "pid"  : "1851",
            "type" : "1",
            "code" : "420500",
            "name" : "宜昌市"
        },
        {
            "id"   : "1886",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420501",
            "name" : "市辖区"
        },
        {
            "id"   : "1887",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420502",
            "name" : "西陵区"
        },
        {
            "id"   : "1888",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420503",
            "name" : "伍家岗区"
        },
        {
            "id"   : "1889",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420504",
            "name" : "点军区"
        },
        {
            "id"   : "1890",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420505",
            "name" : "猇亭区"
        },
        {
            "id"   : "1891",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420506",
            "name" : "夷陵区"
        },
        {
            "id"   : "1892",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420525",
            "name" : "远安县"
        },
        {
            "id"   : "1893",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420526",
            "name" : "兴山县"
        },
        {
            "id"   : "1894",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420527",
            "name" : "秭归县"
        },
        {
            "id"   : "1895",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420528",
            "name" : "长阳土家族自治县"
        },
        {
            "id"   : "1896",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420529",
            "name" : "五峰土家族自治县"
        },
        {
            "id"   : "1897",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420581",
            "name" : "宜都市"
        },
        {
            "id"   : "1898",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420582",
            "name" : "当阳市"
        },
        {
            "id"   : "1899",
            "pid"  : "1885",
            "type" : "2",
            "code" : "420583",
            "name" : "枝江市"
        },
        {
            "id"   : "1900",
            "pid"  : "1851",
            "type" : "1",
            "code" : "420600",
            "name" : "襄阳市"
        },
        {
            "id"   : "1901",
            "pid"  : "1900",
            "type" : "2",
            "code" : "420601",
            "name" : "市辖区"
        },
        {
            "id"   : "1902",
            "pid"  : "1900",
            "type" : "2",
            "code" : "420602",
            "name" : "襄城区"
        },
        {
            "id"   : "1903",
            "pid"  : "1900",
            "type" : "2",
            "code" : "420606",
            "name" : "樊城区"
        },
        {
            "id"   : "1904",
            "pid"  : "1900",
            "type" : "2",
            "code" : "420607",
            "name" : "襄州区"
        },
        {
            "id"   : "1905",
            "pid"  : "1900",
            "type" : "2",
            "code" : "420624",
            "name" : "南漳县"
        },
        {
            "id"   : "1906",
            "pid"  : "1900",
            "type" : "2",
            "code" : "420625",
            "name" : "谷城县"
        },
        {
            "id"   : "1907",
            "pid"  : "1900",
            "type" : "2",
            "code" : "420626",
            "name" : "保康县"
        },
        {
            "id"   : "1908",
            "pid"  : "1900",
            "type" : "2",
            "code" : "420682",
            "name" : "老河口市"
        },
        {
            "id"   : "1909",
            "pid"  : "1900",
            "type" : "2",
            "code" : "420683",
            "name" : "枣阳市"
        },
        {
            "id"   : "1910",
            "pid"  : "1900",
            "type" : "2",
            "code" : "420684",
            "name" : "宜城市"
        },
        {
            "id"   : "1911",
            "pid"  : "1851",
            "type" : "1",
            "code" : "420700",
            "name" : "鄂州市"
        },
        {
            "id"   : "1912",
            "pid"  : "1911",
            "type" : "2",
            "code" : "420701",
            "name" : "市辖区"
        },
        {
            "id"   : "1913",
            "pid"  : "1911",
            "type" : "2",
            "code" : "420702",
            "name" : "梁子湖区"
        },
        {
            "id"   : "1914",
            "pid"  : "1911",
            "type" : "2",
            "code" : "420703",
            "name" : "华容区"
        },
        {
            "id"   : "1915",
            "pid"  : "1911",
            "type" : "2",
            "code" : "420704",
            "name" : "鄂城区"
        },
        {
            "id"   : "1916",
            "pid"  : "1851",
            "type" : "1",
            "code" : "420800",
            "name" : "荆门市"
        },
        {
            "id"   : "1917",
            "pid"  : "1916",
            "type" : "2",
            "code" : "420801",
            "name" : "市辖区"
        },
        {
            "id"   : "1918",
            "pid"  : "1916",
            "type" : "2",
            "code" : "420802",
            "name" : "东宝区"
        },
        {
            "id"   : "1919",
            "pid"  : "1916",
            "type" : "2",
            "code" : "420804",
            "name" : "掇刀区"
        },
        {
            "id"   : "1920",
            "pid"  : "1916",
            "type" : "2",
            "code" : "420821",
            "name" : "京山县"
        },
        {
            "id"   : "1921",
            "pid"  : "1916",
            "type" : "2",
            "code" : "420822",
            "name" : "沙洋县"
        },
        {
            "id"   : "1922",
            "pid"  : "1916",
            "type" : "2",
            "code" : "420881",
            "name" : "钟祥市"
        },
        {
            "id"   : "1923",
            "pid"  : "1851",
            "type" : "1",
            "code" : "420900",
            "name" : "孝感市"
        },
        {
            "id"   : "1924",
            "pid"  : "1923",
            "type" : "2",
            "code" : "420901",
            "name" : "市辖区"
        },
        {
            "id"   : "1925",
            "pid"  : "1923",
            "type" : "2",
            "code" : "420902",
            "name" : "孝南区"
        },
        {
            "id"   : "1926",
            "pid"  : "1923",
            "type" : "2",
            "code" : "420921",
            "name" : "孝昌县"
        },
        {
            "id"   : "1927",
            "pid"  : "1923",
            "type" : "2",
            "code" : "420922",
            "name" : "大悟县"
        },
        {
            "id"   : "1928",
            "pid"  : "1923",
            "type" : "2",
            "code" : "420923",
            "name" : "云梦县"
        },
        {
            "id"   : "1929",
            "pid"  : "1923",
            "type" : "2",
            "code" : "420981",
            "name" : "应城市"
        },
        {
            "id"   : "1930",
            "pid"  : "1923",
            "type" : "2",
            "code" : "420982",
            "name" : "安陆市"
        },
        {
            "id"   : "1931",
            "pid"  : "1923",
            "type" : "2",
            "code" : "420984",
            "name" : "汉川市"
        },
        {
            "id"   : "1932",
            "pid"  : "1851",
            "type" : "1",
            "code" : "421000",
            "name" : "荆州市"
        },
        {
            "id"   : "1933",
            "pid"  : "1932",
            "type" : "2",
            "code" : "421001",
            "name" : "市辖区"
        },
        {
            "id"   : "1934",
            "pid"  : "1932",
            "type" : "2",
            "code" : "421002",
            "name" : "沙市区"
        },
        {
            "id"   : "1935",
            "pid"  : "1932",
            "type" : "2",
            "code" : "421003",
            "name" : "荆州区"
        },
        {
            "id"   : "1936",
            "pid"  : "1932",
            "type" : "2",
            "code" : "421022",
            "name" : "公安县"
        },
        {
            "id"   : "1937",
            "pid"  : "1932",
            "type" : "2",
            "code" : "421023",
            "name" : "监利县"
        },
        {
            "id"   : "1938",
            "pid"  : "1932",
            "type" : "2",
            "code" : "421024",
            "name" : "江陵县"
        },
        {
            "id"   : "1939",
            "pid"  : "1932",
            "type" : "2",
            "code" : "421081",
            "name" : "石首市"
        },
        {
            "id"   : "1940",
            "pid"  : "1932",
            "type" : "2",
            "code" : "421083",
            "name" : "洪湖市"
        },
        {
            "id"   : "1941",
            "pid"  : "1932",
            "type" : "2",
            "code" : "421087",
            "name" : "松滋市"
        },
        {
            "id"   : "1942",
            "pid"  : "1851",
            "type" : "1",
            "code" : "421100",
            "name" : "黄冈市"
        },
        {
            "id"   : "1943",
            "pid"  : "1942",
            "type" : "2",
            "code" : "421101",
            "name" : "市辖区"
        },
        {
            "id"   : "1944",
            "pid"  : "1942",
            "type" : "2",
            "code" : "421102",
            "name" : "黄州区"
        },
        {
            "id"   : "1945",
            "pid"  : "1942",
            "type" : "2",
            "code" : "421121",
            "name" : "团风县"
        },
        {
            "id"   : "1946",
            "pid"  : "1942",
            "type" : "2",
            "code" : "421122",
            "name" : "红安县"
        },
        {
            "id"   : "1947",
            "pid"  : "1942",
            "type" : "2",
            "code" : "421123",
            "name" : "罗田县"
        },
        {
            "id"   : "1948",
            "pid"  : "1942",
            "type" : "2",
            "code" : "421124",
            "name" : "英山县"
        },
        {
            "id"   : "1949",
            "pid"  : "1942",
            "type" : "2",
            "code" : "421125",
            "name" : "浠水县"
        },
        {
            "id"   : "1950",
            "pid"  : "1942",
            "type" : "2",
            "code" : "421126",
            "name" : "蕲春县"
        },
        {
            "id"   : "1951",
            "pid"  : "1942",
            "type" : "2",
            "code" : "421127",
            "name" : "黄梅县"
        },
        {
            "id"   : "1952",
            "pid"  : "1942",
            "type" : "2",
            "code" : "421181",
            "name" : "麻城市"
        },
        {
            "id"   : "1953",
            "pid"  : "1942",
            "type" : "2",
            "code" : "421182",
            "name" : "武穴市"
        },
        {
            "id"   : "1954",
            "pid"  : "1851",
            "type" : "1",
            "code" : "421200",
            "name" : "咸宁市"
        },
        {
            "id"   : "1955",
            "pid"  : "1954",
            "type" : "2",
            "code" : "421201",
            "name" : "市辖区"
        },
        {
            "id"   : "1956",
            "pid"  : "1954",
            "type" : "2",
            "code" : "421202",
            "name" : "咸安区"
        },
        {
            "id"   : "1957",
            "pid"  : "1954",
            "type" : "2",
            "code" : "421221",
            "name" : "嘉鱼县"
        },
        {
            "id"   : "1958",
            "pid"  : "1954",
            "type" : "2",
            "code" : "421222",
            "name" : "通城县"
        },
        {
            "id"   : "1959",
            "pid"  : "1954",
            "type" : "2",
            "code" : "421223",
            "name" : "崇阳县"
        },
        {
            "id"   : "1960",
            "pid"  : "1954",
            "type" : "2",
            "code" : "421224",
            "name" : "通山县"
        },
        {
            "id"   : "1961",
            "pid"  : "1954",
            "type" : "2",
            "code" : "421281",
            "name" : "赤壁市"
        },
        {
            "id"   : "1962",
            "pid"  : "1851",
            "type" : "1",
            "code" : "421300",
            "name" : "随州市"
        },
        {
            "id"   : "1963",
            "pid"  : "1962",
            "type" : "2",
            "code" : "421301",
            "name" : "市辖区"
        },
        {
            "id"   : "1964",
            "pid"  : "1962",
            "type" : "2",
            "code" : "421303",
            "name" : "曾都区"
        },
        {
            "id"   : "1965",
            "pid"  : "1962",
            "type" : "2",
            "code" : "421321",
            "name" : "随县"
        },
        {
            "id"   : "1966",
            "pid"  : "1962",
            "type" : "2",
            "code" : "421381",
            "name" : "广水市"
        },
        {
            "id"   : "1967",
            "pid"  : "1851",
            "type" : "1",
            "code" : "422800",
            "name" : "恩施土家族苗族自治州"
        },
        {
            "id"   : "1968",
            "pid"  : "1967",
            "type" : "2",
            "code" : "422801",
            "name" : "恩施市"
        },
        {
            "id"   : "1969",
            "pid"  : "1967",
            "type" : "2",
            "code" : "422802",
            "name" : "利川市"
        },
        {
            "id"   : "1970",
            "pid"  : "1967",
            "type" : "2",
            "code" : "422822",
            "name" : "建始县"
        },
        {
            "id"   : "1971",
            "pid"  : "1967",
            "type" : "2",
            "code" : "422823",
            "name" : "巴东县"
        },
        {
            "id"   : "1972",
            "pid"  : "1967",
            "type" : "2",
            "code" : "422825",
            "name" : "宣恩县"
        },
        {
            "id"   : "1973",
            "pid"  : "1967",
            "type" : "2",
            "code" : "422826",
            "name" : "咸丰县"
        },
        {
            "id"   : "1974",
            "pid"  : "1967",
            "type" : "2",
            "code" : "422827",
            "name" : "来凤县"
        },
        {
            "id"   : "1975",
            "pid"  : "1967",
            "type" : "2",
            "code" : "422828",
            "name" : "鹤峰县"
        },
        {
            "id"   : "1976",
            "pid"  : "1851",
            "type" : "1",
            "code" : "429000",
            "name" : "省直辖县级行政区划"
        },
        {
            "id"   : "1977",
            "pid"  : "1976",
            "type" : "2",
            "code" : "429004",
            "name" : "仙桃市"
        },
        {
            "id"   : "1978",
            "pid"  : "1976",
            "type" : "2",
            "code" : "429005",
            "name" : "潜江市"
        },
        {
            "id"   : "1979",
            "pid"  : "1976",
            "type" : "2",
            "code" : "429006",
            "name" : "天门市"
        },
        {
            "id"   : "1980",
            "pid"  : "1976",
            "type" : "2",
            "code" : "429021",
            "name" : "神农架林区"
        },
        {
            "id"   : "1981",
            "pid"  : "0",
            "type" : "0",
            "code" : "430000",
            "name" : "湖南省"
        },
        {
            "id"   : "1982",
            "pid"  : "1981",
            "type" : "1",
            "code" : "430100",
            "name" : "长沙市"
        },
        {
            "id"   : "1983",
            "pid"  : "1982",
            "type" : "2",
            "code" : "430101",
            "name" : "市辖区"
        },
        {
            "id"   : "1984",
            "pid"  : "1982",
            "type" : "2",
            "code" : "430102",
            "name" : "芙蓉区"
        },
        {
            "id"   : "1985",
            "pid"  : "1982",
            "type" : "2",
            "code" : "430103",
            "name" : "天心区"
        },
        {
            "id"   : "1986",
            "pid"  : "1982",
            "type" : "2",
            "code" : "430104",
            "name" : "岳麓区"
        },
        {
            "id"   : "1987",
            "pid"  : "1982",
            "type" : "2",
            "code" : "430105",
            "name" : "开福区"
        },
        {
            "id"   : "1988",
            "pid"  : "1982",
            "type" : "2",
            "code" : "430111",
            "name" : "雨花区"
        },
        {
            "id"   : "1989",
            "pid"  : "1982",
            "type" : "2",
            "code" : "430112",
            "name" : "望城区"
        },
        {
            "id"   : "1990",
            "pid"  : "1982",
            "type" : "2",
            "code" : "430121",
            "name" : "长沙县"
        },
        {
            "id"   : "1991",
            "pid"  : "1982",
            "type" : "2",
            "code" : "430124",
            "name" : "宁乡县"
        },
        {
            "id"   : "1992",
            "pid"  : "1982",
            "type" : "2",
            "code" : "430181",
            "name" : "浏阳市"
        },
        {
            "id"   : "1993",
            "pid"  : "1981",
            "type" : "1",
            "code" : "430200",
            "name" : "株洲市"
        },
        {
            "id"   : "1994",
            "pid"  : "1993",
            "type" : "2",
            "code" : "430201",
            "name" : "市辖区"
        },
        {
            "id"   : "1995",
            "pid"  : "1993",
            "type" : "2",
            "code" : "430202",
            "name" : "荷塘区"
        },
        {
            "id"   : "1996",
            "pid"  : "1993",
            "type" : "2",
            "code" : "430203",
            "name" : "芦淞区"
        },
        {
            "id"   : "1997",
            "pid"  : "1993",
            "type" : "2",
            "code" : "430204",
            "name" : "石峰区"
        },
        {
            "id"   : "1998",
            "pid"  : "1993",
            "type" : "2",
            "code" : "430211",
            "name" : "天元区"
        },
        {
            "id"   : "1999",
            "pid"  : "1993",
            "type" : "2",
            "code" : "430221",
            "name" : "株洲县"
        },
        {
            "id"   : "2000",
            "pid"  : "1993",
            "type" : "2",
            "code" : "430223",
            "name" : "攸县"
        },
        {
            "id"   : "2001",
            "pid"  : "1993",
            "type" : "2",
            "code" : "430224",
            "name" : "茶陵县"
        },
        {
            "id"   : "2002",
            "pid"  : "1993",
            "type" : "2",
            "code" : "430225",
            "name" : "炎陵县"
        },
        {
            "id"   : "2003",
            "pid"  : "1993",
            "type" : "2",
            "code" : "430281",
            "name" : "醴陵市"
        },
        {
            "id"   : "2004",
            "pid"  : "1981",
            "type" : "1",
            "code" : "430300",
            "name" : "湘潭市"
        },
        {
            "id"   : "2005",
            "pid"  : "2004",
            "type" : "2",
            "code" : "430301",
            "name" : "市辖区"
        },
        {
            "id"   : "2006",
            "pid"  : "2004",
            "type" : "2",
            "code" : "430302",
            "name" : "雨湖区"
        },
        {
            "id"   : "2007",
            "pid"  : "2004",
            "type" : "2",
            "code" : "430304",
            "name" : "岳塘区"
        },
        {
            "id"   : "2008",
            "pid"  : "2004",
            "type" : "2",
            "code" : "430321",
            "name" : "湘潭县"
        },
        {
            "id"   : "2009",
            "pid"  : "2004",
            "type" : "2",
            "code" : "430381",
            "name" : "湘乡市"
        },
        {
            "id"   : "2010",
            "pid"  : "2004",
            "type" : "2",
            "code" : "430382",
            "name" : "韶山市"
        },
        {
            "id"   : "2011",
            "pid"  : "1981",
            "type" : "1",
            "code" : "430400",
            "name" : "衡阳市"
        },
        {
            "id"   : "2012",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430401",
            "name" : "市辖区"
        },
        {
            "id"   : "2013",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430405",
            "name" : "珠晖区"
        },
        {
            "id"   : "2014",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430406",
            "name" : "雁峰区"
        },
        {
            "id"   : "2015",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430407",
            "name" : "石鼓区"
        },
        {
            "id"   : "2016",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430408",
            "name" : "蒸湘区"
        },
        {
            "id"   : "2017",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430412",
            "name" : "南岳区"
        },
        {
            "id"   : "2018",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430421",
            "name" : "衡阳县"
        },
        {
            "id"   : "2019",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430422",
            "name" : "衡南县"
        },
        {
            "id"   : "2020",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430423",
            "name" : "衡山县"
        },
        {
            "id"   : "2021",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430424",
            "name" : "衡东县"
        },
        {
            "id"   : "2022",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430426",
            "name" : "祁东县"
        },
        {
            "id"   : "2023",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430481",
            "name" : "耒阳市"
        },
        {
            "id"   : "2024",
            "pid"  : "2011",
            "type" : "2",
            "code" : "430482",
            "name" : "常宁市"
        },
        {
            "id"   : "2025",
            "pid"  : "1981",
            "type" : "1",
            "code" : "430500",
            "name" : "邵阳市"
        },
        {
            "id"   : "2026",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430501",
            "name" : "市辖区"
        },
        {
            "id"   : "2027",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430502",
            "name" : "双清区"
        },
        {
            "id"   : "2028",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430503",
            "name" : "大祥区"
        },
        {
            "id"   : "2029",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430511",
            "name" : "北塔区"
        },
        {
            "id"   : "2030",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430521",
            "name" : "邵东县"
        },
        {
            "id"   : "2031",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430522",
            "name" : "新邵县"
        },
        {
            "id"   : "2032",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430523",
            "name" : "邵阳县"
        },
        {
            "id"   : "2033",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430524",
            "name" : "隆回县"
        },
        {
            "id"   : "2034",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430525",
            "name" : "洞口县"
        },
        {
            "id"   : "2035",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430527",
            "name" : "绥宁县"
        },
        {
            "id"   : "2036",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430528",
            "name" : "新宁县"
        },
        {
            "id"   : "2037",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430529",
            "name" : "城步苗族自治县"
        },
        {
            "id"   : "2038",
            "pid"  : "2025",
            "type" : "2",
            "code" : "430581",
            "name" : "武冈市"
        },
        {
            "id"   : "2039",
            "pid"  : "1981",
            "type" : "1",
            "code" : "430600",
            "name" : "岳阳市"
        },
        {
            "id"   : "2040",
            "pid"  : "2039",
            "type" : "2",
            "code" : "430601",
            "name" : "市辖区"
        },
        {
            "id"   : "2041",
            "pid"  : "2039",
            "type" : "2",
            "code" : "430602",
            "name" : "岳阳楼区"
        },
        {
            "id"   : "2042",
            "pid"  : "2039",
            "type" : "2",
            "code" : "430603",
            "name" : "云溪区"
        },
        {
            "id"   : "2043",
            "pid"  : "2039",
            "type" : "2",
            "code" : "430611",
            "name" : "君山区"
        },
        {
            "id"   : "2044",
            "pid"  : "2039",
            "type" : "2",
            "code" : "430621",
            "name" : "岳阳县"
        },
        {
            "id"   : "2045",
            "pid"  : "2039",
            "type" : "2",
            "code" : "430623",
            "name" : "华容县"
        },
        {
            "id"   : "2046",
            "pid"  : "2039",
            "type" : "2",
            "code" : "430624",
            "name" : "湘阴县"
        },
        {
            "id"   : "2047",
            "pid"  : "2039",
            "type" : "2",
            "code" : "430626",
            "name" : "平江县"
        },
        {
            "id"   : "2048",
            "pid"  : "2039",
            "type" : "2",
            "code" : "430681",
            "name" : "汨罗市"
        },
        {
            "id"   : "2049",
            "pid"  : "2039",
            "type" : "2",
            "code" : "430682",
            "name" : "临湘市"
        },
        {
            "id"   : "2050",
            "pid"  : "1981",
            "type" : "1",
            "code" : "430700",
            "name" : "常德市"
        },
        {
            "id"   : "2051",
            "pid"  : "2050",
            "type" : "2",
            "code" : "430701",
            "name" : "市辖区"
        },
        {
            "id"   : "2052",
            "pid"  : "2050",
            "type" : "2",
            "code" : "430702",
            "name" : "武陵区"
        },
        {
            "id"   : "2053",
            "pid"  : "2050",
            "type" : "2",
            "code" : "430703",
            "name" : "鼎城区"
        },
        {
            "id"   : "2054",
            "pid"  : "2050",
            "type" : "2",
            "code" : "430721",
            "name" : "安乡县"
        },
        {
            "id"   : "2055",
            "pid"  : "2050",
            "type" : "2",
            "code" : "430722",
            "name" : "汉寿县"
        },
        {
            "id"   : "2056",
            "pid"  : "2050",
            "type" : "2",
            "code" : "430723",
            "name" : "澧县"
        },
        {
            "id"   : "2057",
            "pid"  : "2050",
            "type" : "2",
            "code" : "430724",
            "name" : "临澧县"
        },
        {
            "id"   : "2058",
            "pid"  : "2050",
            "type" : "2",
            "code" : "430725",
            "name" : "桃源县"
        },
        {
            "id"   : "2059",
            "pid"  : "2050",
            "type" : "2",
            "code" : "430726",
            "name" : "石门县"
        },
        {
            "id"   : "2060",
            "pid"  : "2050",
            "type" : "2",
            "code" : "430781",
            "name" : "津市市"
        },
        {
            "id"   : "2061",
            "pid"  : "1981",
            "type" : "1",
            "code" : "430800",
            "name" : "张家界市"
        },
        {
            "id"   : "2062",
            "pid"  : "2061",
            "type" : "2",
            "code" : "430801",
            "name" : "市辖区"
        },
        {
            "id"   : "2063",
            "pid"  : "2061",
            "type" : "2",
            "code" : "430802",
            "name" : "永定区"
        },
        {
            "id"   : "2064",
            "pid"  : "2061",
            "type" : "2",
            "code" : "430811",
            "name" : "武陵源区"
        },
        {
            "id"   : "2065",
            "pid"  : "2061",
            "type" : "2",
            "code" : "430821",
            "name" : "慈利县"
        },
        {
            "id"   : "2066",
            "pid"  : "2061",
            "type" : "2",
            "code" : "430822",
            "name" : "桑植县"
        },
        {
            "id"   : "2067",
            "pid"  : "1981",
            "type" : "1",
            "code" : "430900",
            "name" : "益阳市"
        },
        {
            "id"   : "2068",
            "pid"  : "2067",
            "type" : "2",
            "code" : "430901",
            "name" : "市辖区"
        },
        {
            "id"   : "2069",
            "pid"  : "2067",
            "type" : "2",
            "code" : "430902",
            "name" : "资阳区"
        },
        {
            "id"   : "2070",
            "pid"  : "2067",
            "type" : "2",
            "code" : "430903",
            "name" : "赫山区"
        },
        {
            "id"   : "2071",
            "pid"  : "2067",
            "type" : "2",
            "code" : "430921",
            "name" : "南县"
        },
        {
            "id"   : "2072",
            "pid"  : "2067",
            "type" : "2",
            "code" : "430922",
            "name" : "桃江县"
        },
        {
            "id"   : "2073",
            "pid"  : "2067",
            "type" : "2",
            "code" : "430923",
            "name" : "安化县"
        },
        {
            "id"   : "2074",
            "pid"  : "2067",
            "type" : "2",
            "code" : "430981",
            "name" : "沅江市"
        },
        {
            "id"   : "2075",
            "pid"  : "1981",
            "type" : "1",
            "code" : "431000",
            "name" : "郴州市"
        },
        {
            "id"   : "2076",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431001",
            "name" : "市辖区"
        },
        {
            "id"   : "2077",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431002",
            "name" : "北湖区"
        },
        {
            "id"   : "2078",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431003",
            "name" : "苏仙区"
        },
        {
            "id"   : "2079",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431021",
            "name" : "桂阳县"
        },
        {
            "id"   : "2080",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431022",
            "name" : "宜章县"
        },
        {
            "id"   : "2081",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431023",
            "name" : "永兴县"
        },
        {
            "id"   : "2082",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431024",
            "name" : "嘉禾县"
        },
        {
            "id"   : "2083",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431025",
            "name" : "临武县"
        },
        {
            "id"   : "2084",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431026",
            "name" : "汝城县"
        },
        {
            "id"   : "2085",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431027",
            "name" : "桂东县"
        },
        {
            "id"   : "2086",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431028",
            "name" : "安仁县"
        },
        {
            "id"   : "2087",
            "pid"  : "2075",
            "type" : "2",
            "code" : "431081",
            "name" : "资兴市"
        },
        {
            "id"   : "2088",
            "pid"  : "1981",
            "type" : "1",
            "code" : "431100",
            "name" : "永州市"
        },
        {
            "id"   : "2089",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431101",
            "name" : "市辖区"
        },
        {
            "id"   : "2090",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431102",
            "name" : "零陵区"
        },
        {
            "id"   : "2091",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431103",
            "name" : "冷水滩区"
        },
        {
            "id"   : "2092",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431121",
            "name" : "祁阳县"
        },
        {
            "id"   : "2093",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431122",
            "name" : "东安县"
        },
        {
            "id"   : "2094",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431123",
            "name" : "双牌县"
        },
        {
            "id"   : "2095",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431124",
            "name" : "道县"
        },
        {
            "id"   : "2096",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431125",
            "name" : "江永县"
        },
        {
            "id"   : "2097",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431126",
            "name" : "宁远县"
        },
        {
            "id"   : "2098",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431127",
            "name" : "蓝山县"
        },
        {
            "id"   : "2099",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431128",
            "name" : "新田县"
        },
        {
            "id"   : "2100",
            "pid"  : "2088",
            "type" : "2",
            "code" : "431129",
            "name" : "江华瑶族自治县"
        },
        {
            "id"   : "2101",
            "pid"  : "1981",
            "type" : "1",
            "code" : "431200",
            "name" : "怀化市"
        },
        {
            "id"   : "2102",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431201",
            "name" : "市辖区"
        },
        {
            "id"   : "2103",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431202",
            "name" : "鹤城区"
        },
        {
            "id"   : "2104",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431221",
            "name" : "中方县"
        },
        {
            "id"   : "2105",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431222",
            "name" : "沅陵县"
        },
        {
            "id"   : "2106",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431223",
            "name" : "辰溪县"
        },
        {
            "id"   : "2107",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431224",
            "name" : "溆浦县"
        },
        {
            "id"   : "2108",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431225",
            "name" : "会同县"
        },
        {
            "id"   : "2109",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431226",
            "name" : "麻阳苗族自治县"
        },
        {
            "id"   : "2110",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431227",
            "name" : "新晃侗族自治县"
        },
        {
            "id"   : "2111",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431228",
            "name" : "芷江侗族自治县"
        },
        {
            "id"   : "2112",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431229",
            "name" : "靖州苗族侗族自治县"
        },
        {
            "id"   : "2113",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431230",
            "name" : "通道侗族自治县"
        },
        {
            "id"   : "2114",
            "pid"  : "2101",
            "type" : "2",
            "code" : "431281",
            "name" : "洪江市"
        },
        {
            "id"   : "2115",
            "pid"  : "1981",
            "type" : "1",
            "code" : "431300",
            "name" : "娄底市"
        },
        {
            "id"   : "2116",
            "pid"  : "2115",
            "type" : "2",
            "code" : "431301",
            "name" : "市辖区"
        },
        {
            "id"   : "2117",
            "pid"  : "2115",
            "type" : "2",
            "code" : "431302",
            "name" : "娄星区"
        },
        {
            "id"   : "2118",
            "pid"  : "2115",
            "type" : "2",
            "code" : "431321",
            "name" : "双峰县"
        },
        {
            "id"   : "2119",
            "pid"  : "2115",
            "type" : "2",
            "code" : "431322",
            "name" : "新化县"
        },
        {
            "id"   : "2120",
            "pid"  : "2115",
            "type" : "2",
            "code" : "431381",
            "name" : "冷水江市"
        },
        {
            "id"   : "2121",
            "pid"  : "2115",
            "type" : "2",
            "code" : "431382",
            "name" : "涟源市"
        },
        {
            "id"   : "2122",
            "pid"  : "1981",
            "type" : "1",
            "code" : "433100",
            "name" : "湘西土家族苗族自治州"
        },
        {
            "id"   : "2123",
            "pid"  : "2122",
            "type" : "2",
            "code" : "433101",
            "name" : "吉首市"
        },
        {
            "id"   : "2124",
            "pid"  : "2122",
            "type" : "2",
            "code" : "433122",
            "name" : "泸溪县"
        },
        {
            "id"   : "2125",
            "pid"  : "2122",
            "type" : "2",
            "code" : "433123",
            "name" : "凤凰县"
        },
        {
            "id"   : "2126",
            "pid"  : "2122",
            "type" : "2",
            "code" : "433124",
            "name" : "花垣县"
        },
        {
            "id"   : "2127",
            "pid"  : "2122",
            "type" : "2",
            "code" : "433125",
            "name" : "保靖县"
        },
        {
            "id"   : "2128",
            "pid"  : "2122",
            "type" : "2",
            "code" : "433126",
            "name" : "古丈县"
        },
        {
            "id"   : "2129",
            "pid"  : "2122",
            "type" : "2",
            "code" : "433127",
            "name" : "永顺县"
        },
        {
            "id"   : "2130",
            "pid"  : "2122",
            "type" : "2",
            "code" : "433130",
            "name" : "龙山县"
        },
        {
            "id"   : "2131",
            "pid"  : "0",
            "type" : "0",
            "code" : "440000",
            "name" : "广东省"
        },
        {
            "id"   : "2132",
            "pid"  : "2131",
            "type" : "1",
            "code" : "440100",
            "name" : "广州市"
        },
        {
            "id"   : "2133",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440101",
            "name" : "市辖区"
        },
        {
            "id"   : "2134",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440103",
            "name" : "荔湾区"
        },
        {
            "id"   : "2135",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440104",
            "name" : "越秀区"
        },
        {
            "id"   : "2136",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440105",
            "name" : "海珠区"
        },
        {
            "id"   : "2137",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440106",
            "name" : "天河区"
        },
        {
            "id"   : "2138",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440111",
            "name" : "白云区"
        },
        {
            "id"   : "2139",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440112",
            "name" : "黄埔区"
        },
        {
            "id"   : "2140",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440113",
            "name" : "番禺区"
        },
        {
            "id"   : "2141",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440114",
            "name" : "花都区"
        },
        {
            "id"   : "2142",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440115",
            "name" : "南沙区"
        },
        {
            "id"   : "2143",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440116",
            "name" : "萝岗区"
        },
        {
            "id"   : "2144",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440117",
            "name" : "从化区"
        },
        {
            "id"   : "2145",
            "pid"  : "2132",
            "type" : "2",
            "code" : "440118",
            "name" : "增城区"
        },
        {
            "id"   : "2146",
            "pid"  : "2131",
            "type" : "1",
            "code" : "440200",
            "name" : "韶关市"
        },
        {
            "id"   : "2147",
            "pid"  : "2146",
            "type" : "2",
            "code" : "440201",
            "name" : "市辖区"
        },
        {
            "id"   : "2148",
            "pid"  : "2146",
            "type" : "2",
            "code" : "440203",
            "name" : "武江区"
        },
        {
            "id"   : "2149",
            "pid"  : "2146",
            "type" : "2",
            "code" : "440204",
            "name" : "浈江区"
        },
        {
            "id"   : "2150",
            "pid"  : "2146",
            "type" : "2",
            "code" : "440205",
            "name" : "曲江区"
        },
        {
            "id"   : "2151",
            "pid"  : "2146",
            "type" : "2",
            "code" : "440222",
            "name" : "始兴县"
        },
        {
            "id"   : "2152",
            "pid"  : "2146",
            "type" : "2",
            "code" : "440224",
            "name" : "仁化县"
        },
        {
            "id"   : "2153",
            "pid"  : "2146",
            "type" : "2",
            "code" : "440229",
            "name" : "翁源县"
        },
        {
            "id"   : "2154",
            "pid"  : "2146",
            "type" : "2",
            "code" : "440232",
            "name" : "乳源瑶族自治县"
        },
        {
            "id"   : "2155",
            "pid"  : "2146",
            "type" : "2",
            "code" : "440233",
            "name" : "新丰县"
        },
        {
            "id"   : "2156",
            "pid"  : "2146",
            "type" : "2",
            "code" : "440281",
            "name" : "乐昌市"
        },
        {
            "id"   : "2157",
            "pid"  : "2146",
            "type" : "2",
            "code" : "440282",
            "name" : "南雄市"
        },
        {
            "id"   : "2158",
            "pid"  : "2131",
            "type" : "1",
            "code" : "440300",
            "name" : "深圳市"
        },
        {
            "id"   : "2159",
            "pid"  : "2158",
            "type" : "2",
            "code" : "440301",
            "name" : "市辖区"
        },
        {
            "id"   : "2160",
            "pid"  : "2158",
            "type" : "2",
            "code" : "440303",
            "name" : "罗湖区"
        },
        {
            "id"   : "2161",
            "pid"  : "2158",
            "type" : "2",
            "code" : "440304",
            "name" : "福田区"
        },
        {
            "id"   : "2162",
            "pid"  : "2158",
            "type" : "2",
            "code" : "440305",
            "name" : "南山区"
        },
        {
            "id"   : "2163",
            "pid"  : "2158",
            "type" : "2",
            "code" : "440306",
            "name" : "宝安区"
        },
        {
            "id"   : "2164",
            "pid"  : "2158",
            "type" : "2",
            "code" : "440307",
            "name" : "龙岗区"
        },
        {
            "id"   : "2165",
            "pid"  : "2158",
            "type" : "2",
            "code" : "440308",
            "name" : "盐田区"
        },
        {
            "id"   : "2166",
            "pid"  : "2131",
            "type" : "1",
            "code" : "440400",
            "name" : "珠海市"
        },
        {
            "id"   : "2167",
            "pid"  : "2166",
            "type" : "2",
            "code" : "440401",
            "name" : "市辖区"
        },
        {
            "id"   : "2168",
            "pid"  : "2166",
            "type" : "2",
            "code" : "440402",
            "name" : "香洲区"
        },
        {
            "id"   : "2169",
            "pid"  : "2166",
            "type" : "2",
            "code" : "440403",
            "name" : "斗门区"
        },
        {
            "id"   : "2170",
            "pid"  : "2166",
            "type" : "2",
            "code" : "440404",
            "name" : "金湾区"
        },
        {
            "id"   : "2171",
            "pid"  : "2131",
            "type" : "1",
            "code" : "440500",
            "name" : "汕头市"
        },
        {
            "id"   : "2172",
            "pid"  : "2171",
            "type" : "2",
            "code" : "440501",
            "name" : "市辖区"
        },
        {
            "id"   : "2173",
            "pid"  : "2171",
            "type" : "2",
            "code" : "440507",
            "name" : "龙湖区"
        },
        {
            "id"   : "2174",
            "pid"  : "2171",
            "type" : "2",
            "code" : "440511",
            "name" : "金平区"
        },
        {
            "id"   : "2175",
            "pid"  : "2171",
            "type" : "2",
            "code" : "440512",
            "name" : "濠江区"
        },
        {
            "id"   : "2176",
            "pid"  : "2171",
            "type" : "2",
            "code" : "440513",
            "name" : "潮阳区"
        },
        {
            "id"   : "2177",
            "pid"  : "2171",
            "type" : "2",
            "code" : "440514",
            "name" : "潮南区"
        },
        {
            "id"   : "2178",
            "pid"  : "2171",
            "type" : "2",
            "code" : "440515",
            "name" : "澄海区"
        },
        {
            "id"   : "2179",
            "pid"  : "2171",
            "type" : "2",
            "code" : "440523",
            "name" : "南澳县"
        },
        {
            "id"   : "2180",
            "pid"  : "2131",
            "type" : "1",
            "code" : "440600",
            "name" : "佛山市"
        },
        {
            "id"   : "2181",
            "pid"  : "2180",
            "type" : "2",
            "code" : "440601",
            "name" : "市辖区"
        },
        {
            "id"   : "2182",
            "pid"  : "2180",
            "type" : "2",
            "code" : "440604",
            "name" : "禅城区"
        },
        {
            "id"   : "2183",
            "pid"  : "2180",
            "type" : "2",
            "code" : "440605",
            "name" : "南海区"
        },
        {
            "id"   : "2184",
            "pid"  : "2180",
            "type" : "2",
            "code" : "440606",
            "name" : "顺德区"
        },
        {
            "id"   : "2185",
            "pid"  : "2180",
            "type" : "2",
            "code" : "440607",
            "name" : "三水区"
        },
        {
            "id"   : "2186",
            "pid"  : "2180",
            "type" : "2",
            "code" : "440608",
            "name" : "高明区"
        },
        {
            "id"   : "2187",
            "pid"  : "2131",
            "type" : "1",
            "code" : "440700",
            "name" : "江门市"
        },
        {
            "id"   : "2188",
            "pid"  : "2187",
            "type" : "2",
            "code" : "440701",
            "name" : "市辖区"
        },
        {
            "id"   : "2189",
            "pid"  : "2187",
            "type" : "2",
            "code" : "440703",
            "name" : "蓬江区"
        },
        {
            "id"   : "2190",
            "pid"  : "2187",
            "type" : "2",
            "code" : "440704",
            "name" : "江海区"
        },
        {
            "id"   : "2191",
            "pid"  : "2187",
            "type" : "2",
            "code" : "440705",
            "name" : "新会区"
        },
        {
            "id"   : "2192",
            "pid"  : "2187",
            "type" : "2",
            "code" : "440781",
            "name" : "台山市"
        },
        {
            "id"   : "2193",
            "pid"  : "2187",
            "type" : "2",
            "code" : "440783",
            "name" : "开平市"
        },
        {
            "id"   : "2194",
            "pid"  : "2187",
            "type" : "2",
            "code" : "440784",
            "name" : "鹤山市"
        },
        {
            "id"   : "2195",
            "pid"  : "2187",
            "type" : "2",
            "code" : "440785",
            "name" : "恩平市"
        },
        {
            "id"   : "2196",
            "pid"  : "2131",
            "type" : "1",
            "code" : "440800",
            "name" : "湛江市"
        },
        {
            "id"   : "2197",
            "pid"  : "2196",
            "type" : "2",
            "code" : "440801",
            "name" : "市辖区"
        },
        {
            "id"   : "2198",
            "pid"  : "2196",
            "type" : "2",
            "code" : "440802",
            "name" : "赤坎区"
        },
        {
            "id"   : "2199",
            "pid"  : "2196",
            "type" : "2",
            "code" : "440803",
            "name" : "霞山区"
        },
        {
            "id"   : "2200",
            "pid"  : "2196",
            "type" : "2",
            "code" : "440804",
            "name" : "坡头区"
        },
        {
            "id"   : "2201",
            "pid"  : "2196",
            "type" : "2",
            "code" : "440811",
            "name" : "麻章区"
        },
        {
            "id"   : "2202",
            "pid"  : "2196",
            "type" : "2",
            "code" : "440823",
            "name" : "遂溪县"
        },
        {
            "id"   : "2203",
            "pid"  : "2196",
            "type" : "2",
            "code" : "440825",
            "name" : "徐闻县"
        },
        {
            "id"   : "2204",
            "pid"  : "2196",
            "type" : "2",
            "code" : "440881",
            "name" : "廉江市"
        },
        {
            "id"   : "2205",
            "pid"  : "2196",
            "type" : "2",
            "code" : "440882",
            "name" : "雷州市"
        },
        {
            "id"   : "2206",
            "pid"  : "2196",
            "type" : "2",
            "code" : "440883",
            "name" : "吴川市"
        },
        {
            "id"   : "2207",
            "pid"  : "2131",
            "type" : "1",
            "code" : "440900",
            "name" : "茂名市"
        },
        {
            "id"   : "2208",
            "pid"  : "2207",
            "type" : "2",
            "code" : "440901",
            "name" : "市辖区"
        },
        {
            "id"   : "2209",
            "pid"  : "2207",
            "type" : "2",
            "code" : "440902",
            "name" : "茂南区"
        },
        {
            "id"   : "2210",
            "pid"  : "2207",
            "type" : "2",
            "code" : "440904",
            "name" : "电白区"
        },
        {
            "id"   : "2211",
            "pid"  : "2207",
            "type" : "2",
            "code" : "440981",
            "name" : "高州市"
        },
        {
            "id"   : "2212",
            "pid"  : "2207",
            "type" : "2",
            "code" : "440982",
            "name" : "化州市"
        },
        {
            "id"   : "2213",
            "pid"  : "2207",
            "type" : "2",
            "code" : "440983",
            "name" : "信宜市"
        },
        {
            "id"   : "2214",
            "pid"  : "2131",
            "type" : "1",
            "code" : "441200",
            "name" : "肇庆市"
        },
        {
            "id"   : "2215",
            "pid"  : "2214",
            "type" : "2",
            "code" : "441201",
            "name" : "市辖区"
        },
        {
            "id"   : "2216",
            "pid"  : "2214",
            "type" : "2",
            "code" : "441202",
            "name" : "端州区"
        },
        {
            "id"   : "2217",
            "pid"  : "2214",
            "type" : "2",
            "code" : "441203",
            "name" : "鼎湖区"
        },
        {
            "id"   : "2218",
            "pid"  : "2214",
            "type" : "2",
            "code" : "441223",
            "name" : "广宁县"
        },
        {
            "id"   : "2219",
            "pid"  : "2214",
            "type" : "2",
            "code" : "441224",
            "name" : "怀集县"
        },
        {
            "id"   : "2220",
            "pid"  : "2214",
            "type" : "2",
            "code" : "441225",
            "name" : "封开县"
        },
        {
            "id"   : "2221",
            "pid"  : "2214",
            "type" : "2",
            "code" : "441226",
            "name" : "德庆县"
        },
        {
            "id"   : "2222",
            "pid"  : "2214",
            "type" : "2",
            "code" : "441283",
            "name" : "高要市"
        },
        {
            "id"   : "2223",
            "pid"  : "2214",
            "type" : "2",
            "code" : "441284",
            "name" : "四会市"
        },
        {
            "id"   : "2224",
            "pid"  : "2131",
            "type" : "1",
            "code" : "441300",
            "name" : "惠州市"
        },
        {
            "id"   : "2225",
            "pid"  : "2224",
            "type" : "2",
            "code" : "441301",
            "name" : "市辖区"
        },
        {
            "id"   : "2226",
            "pid"  : "2224",
            "type" : "2",
            "code" : "441302",
            "name" : "惠城区"
        },
        {
            "id"   : "2227",
            "pid"  : "2224",
            "type" : "2",
            "code" : "441303",
            "name" : "惠阳区"
        },
        {
            "id"   : "2228",
            "pid"  : "2224",
            "type" : "2",
            "code" : "441322",
            "name" : "博罗县"
        },
        {
            "id"   : "2229",
            "pid"  : "2224",
            "type" : "2",
            "code" : "441323",
            "name" : "惠东县"
        },
        {
            "id"   : "2230",
            "pid"  : "2224",
            "type" : "2",
            "code" : "441324",
            "name" : "龙门县"
        },
        {
            "id"   : "2231",
            "pid"  : "2131",
            "type" : "1",
            "code" : "441400",
            "name" : "梅州市"
        },
        {
            "id"   : "2232",
            "pid"  : "2231",
            "type" : "2",
            "code" : "441401",
            "name" : "市辖区"
        },
        {
            "id"   : "2233",
            "pid"  : "2231",
            "type" : "2",
            "code" : "441402",
            "name" : "梅江区"
        },
        {
            "id"   : "2234",
            "pid"  : "2231",
            "type" : "2",
            "code" : "441403",
            "name" : "梅县区"
        },
        {
            "id"   : "2235",
            "pid"  : "2231",
            "type" : "2",
            "code" : "441422",
            "name" : "大埔县"
        },
        {
            "id"   : "2236",
            "pid"  : "2231",
            "type" : "2",
            "code" : "441423",
            "name" : "丰顺县"
        },
        {
            "id"   : "2237",
            "pid"  : "2231",
            "type" : "2",
            "code" : "441424",
            "name" : "五华县"
        },
        {
            "id"   : "2238",
            "pid"  : "2231",
            "type" : "2",
            "code" : "441426",
            "name" : "平远县"
        },
        {
            "id"   : "2239",
            "pid"  : "2231",
            "type" : "2",
            "code" : "441427",
            "name" : "蕉岭县"
        },
        {
            "id"   : "2240",
            "pid"  : "2231",
            "type" : "2",
            "code" : "441481",
            "name" : "兴宁市"
        },
        {
            "id"   : "2241",
            "pid"  : "2131",
            "type" : "1",
            "code" : "441500",
            "name" : "汕尾市"
        },
        {
            "id"   : "2242",
            "pid"  : "2241",
            "type" : "2",
            "code" : "441501",
            "name" : "市辖区"
        },
        {
            "id"   : "2243",
            "pid"  : "2241",
            "type" : "2",
            "code" : "441502",
            "name" : "城区"
        },
        {
            "id"   : "2244",
            "pid"  : "2241",
            "type" : "2",
            "code" : "441521",
            "name" : "海丰县"
        },
        {
            "id"   : "2245",
            "pid"  : "2241",
            "type" : "2",
            "code" : "441523",
            "name" : "陆河县"
        },
        {
            "id"   : "2246",
            "pid"  : "2241",
            "type" : "2",
            "code" : "441581",
            "name" : "陆丰市"
        },
        {
            "id"   : "2247",
            "pid"  : "2131",
            "type" : "1",
            "code" : "441600",
            "name" : "河源市"
        },
        {
            "id"   : "2248",
            "pid"  : "2247",
            "type" : "2",
            "code" : "441601",
            "name" : "市辖区"
        },
        {
            "id"   : "2249",
            "pid"  : "2247",
            "type" : "2",
            "code" : "441602",
            "name" : "源城区"
        },
        {
            "id"   : "2250",
            "pid"  : "2247",
            "type" : "2",
            "code" : "441621",
            "name" : "紫金县"
        },
        {
            "id"   : "2251",
            "pid"  : "2247",
            "type" : "2",
            "code" : "441622",
            "name" : "龙川县"
        },
        {
            "id"   : "2252",
            "pid"  : "2247",
            "type" : "2",
            "code" : "441623",
            "name" : "连平县"
        },
        {
            "id"   : "2253",
            "pid"  : "2247",
            "type" : "2",
            "code" : "441624",
            "name" : "和平县"
        },
        {
            "id"   : "2254",
            "pid"  : "2247",
            "type" : "2",
            "code" : "441625",
            "name" : "东源县"
        },
        {
            "id"   : "2255",
            "pid"  : "2131",
            "type" : "1",
            "code" : "441700",
            "name" : "阳江市"
        },
        {
            "id"   : "2256",
            "pid"  : "2255",
            "type" : "2",
            "code" : "441701",
            "name" : "市辖区"
        },
        {
            "id"   : "2257",
            "pid"  : "2255",
            "type" : "2",
            "code" : "441702",
            "name" : "江城区"
        },
        {
            "id"   : "2258",
            "pid"  : "2255",
            "type" : "2",
            "code" : "441721",
            "name" : "阳西县"
        },
        {
            "id"   : "2259",
            "pid"  : "2255",
            "type" : "2",
            "code" : "441723",
            "name" : "阳东县"
        },
        {
            "id"   : "2260",
            "pid"  : "2255",
            "type" : "2",
            "code" : "441781",
            "name" : "阳春市"
        },
        {
            "id"   : "2261",
            "pid"  : "2131",
            "type" : "1",
            "code" : "441800",
            "name" : "清远市"
        },
        {
            "id"   : "2262",
            "pid"  : "2261",
            "type" : "2",
            "code" : "441801",
            "name" : "市辖区"
        },
        {
            "id"   : "2263",
            "pid"  : "2261",
            "type" : "2",
            "code" : "441802",
            "name" : "清城区"
        },
        {
            "id"   : "2264",
            "pid"  : "2261",
            "type" : "2",
            "code" : "441803",
            "name" : "清新区"
        },
        {
            "id"   : "2265",
            "pid"  : "2261",
            "type" : "2",
            "code" : "441821",
            "name" : "佛冈县"
        },
        {
            "id"   : "2266",
            "pid"  : "2261",
            "type" : "2",
            "code" : "441823",
            "name" : "阳山县"
        },
        {
            "id"   : "2267",
            "pid"  : "2261",
            "type" : "2",
            "code" : "441825",
            "name" : "连山壮族瑶族自治县"
        },
        {
            "id"   : "2268",
            "pid"  : "2261",
            "type" : "2",
            "code" : "441826",
            "name" : "连南瑶族自治县"
        },
        {
            "id"   : "2269",
            "pid"  : "2261",
            "type" : "2",
            "code" : "441881",
            "name" : "英德市"
        },
        {
            "id"   : "2270",
            "pid"  : "2261",
            "type" : "2",
            "code" : "441882",
            "name" : "连州市"
        },
        {
            "id"   : "2271",
            "pid"  : "2131",
            "type" : "1",
            "code" : "441900",
            "name" : "东莞市"
        },
        {
            "id"   : "2272",
            "pid"  : "2131",
            "type" : "1",
            "code" : "442000",
            "name" : "中山市"
        },
        {
            "id"   : "2273",
            "pid"  : "2131",
            "type" : "1",
            "code" : "445100",
            "name" : "潮州市"
        },
        {
            "id"   : "2274",
            "pid"  : "2273",
            "type" : "2",
            "code" : "445101",
            "name" : "市辖区"
        },
        {
            "id"   : "2275",
            "pid"  : "2273",
            "type" : "2",
            "code" : "445102",
            "name" : "湘桥区"
        },
        {
            "id"   : "2276",
            "pid"  : "2273",
            "type" : "2",
            "code" : "445103",
            "name" : "潮安区"
        },
        {
            "id"   : "2277",
            "pid"  : "2273",
            "type" : "2",
            "code" : "445122",
            "name" : "饶平县"
        },
        {
            "id"   : "2278",
            "pid"  : "2131",
            "type" : "1",
            "code" : "445200",
            "name" : "揭阳市"
        },
        {
            "id"   : "2279",
            "pid"  : "2278",
            "type" : "2",
            "code" : "445201",
            "name" : "市辖区"
        },
        {
            "id"   : "2280",
            "pid"  : "2278",
            "type" : "2",
            "code" : "445202",
            "name" : "榕城区"
        },
        {
            "id"   : "2281",
            "pid"  : "2278",
            "type" : "2",
            "code" : "445203",
            "name" : "揭东区"
        },
        {
            "id"   : "2282",
            "pid"  : "2278",
            "type" : "2",
            "code" : "445222",
            "name" : "揭西县"
        },
        {
            "id"   : "2283",
            "pid"  : "2278",
            "type" : "2",
            "code" : "445224",
            "name" : "惠来县"
        },
        {
            "id"   : "2284",
            "pid"  : "2278",
            "type" : "2",
            "code" : "445281",
            "name" : "普宁市"
        },
        {
            "id"   : "2285",
            "pid"  : "2131",
            "type" : "1",
            "code" : "445300",
            "name" : "云浮市"
        },
        {
            "id"   : "2286",
            "pid"  : "2285",
            "type" : "2",
            "code" : "445301",
            "name" : "市辖区"
        },
        {
            "id"   : "2287",
            "pid"  : "2285",
            "type" : "2",
            "code" : "445302",
            "name" : "云城区"
        },
        {
            "id"   : "2288",
            "pid"  : "2285",
            "type" : "2",
            "code" : "445303",
            "name" : "云安区"
        },
        {
            "id"   : "2289",
            "pid"  : "2285",
            "type" : "2",
            "code" : "445321",
            "name" : "新兴县"
        },
        {
            "id"   : "2290",
            "pid"  : "2285",
            "type" : "2",
            "code" : "445322",
            "name" : "郁南县"
        },
        {
            "id"   : "2291",
            "pid"  : "2285",
            "type" : "2",
            "code" : "445381",
            "name" : "罗定市"
        },
        {
            "id"   : "2292",
            "pid"  : "0",
            "type" : "0",
            "code" : "450000",
            "name" : "广西壮族自治区"
        },
        {
            "id"   : "2293",
            "pid"  : "2292",
            "type" : "1",
            "code" : "450100",
            "name" : "南宁市"
        },
        {
            "id"   : "2294",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450101",
            "name" : "市辖区"
        },
        {
            "id"   : "2295",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450102",
            "name" : "兴宁区"
        },
        {
            "id"   : "2296",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450103",
            "name" : "青秀区"
        },
        {
            "id"   : "2297",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450105",
            "name" : "江南区"
        },
        {
            "id"   : "2298",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450107",
            "name" : "西乡塘区"
        },
        {
            "id"   : "2299",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450108",
            "name" : "良庆区"
        },
        {
            "id"   : "2300",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450109",
            "name" : "邕宁区"
        },
        {
            "id"   : "2301",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450122",
            "name" : "武鸣县"
        },
        {
            "id"   : "2302",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450123",
            "name" : "隆安县"
        },
        {
            "id"   : "2303",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450124",
            "name" : "马山县"
        },
        {
            "id"   : "2304",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450125",
            "name" : "上林县"
        },
        {
            "id"   : "2305",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450126",
            "name" : "宾阳县"
        },
        {
            "id"   : "2306",
            "pid"  : "2293",
            "type" : "2",
            "code" : "450127",
            "name" : "横县"
        },
        {
            "id"   : "2307",
            "pid"  : "2292",
            "type" : "1",
            "code" : "450200",
            "name" : "柳州市"
        },
        {
            "id"   : "2308",
            "pid"  : "2307",
            "type" : "2",
            "code" : "450201",
            "name" : "市辖区"
        },
        {
            "id"   : "2309",
            "pid"  : "2307",
            "type" : "2",
            "code" : "450202",
            "name" : "城中区"
        },
        {
            "id"   : "2310",
            "pid"  : "2307",
            "type" : "2",
            "code" : "450203",
            "name" : "鱼峰区"
        },
        {
            "id"   : "2311",
            "pid"  : "2307",
            "type" : "2",
            "code" : "450204",
            "name" : "柳南区"
        },
        {
            "id"   : "2312",
            "pid"  : "2307",
            "type" : "2",
            "code" : "450205",
            "name" : "柳北区"
        },
        {
            "id"   : "2313",
            "pid"  : "2307",
            "type" : "2",
            "code" : "450221",
            "name" : "柳江县"
        },
        {
            "id"   : "2314",
            "pid"  : "2307",
            "type" : "2",
            "code" : "450222",
            "name" : "柳城县"
        },
        {
            "id"   : "2315",
            "pid"  : "2307",
            "type" : "2",
            "code" : "450223",
            "name" : "鹿寨县"
        },
        {
            "id"   : "2316",
            "pid"  : "2307",
            "type" : "2",
            "code" : "450224",
            "name" : "融安县"
        },
        {
            "id"   : "2317",
            "pid"  : "2307",
            "type" : "2",
            "code" : "450225",
            "name" : "融水苗族自治县"
        },
        {
            "id"   : "2318",
            "pid"  : "2307",
            "type" : "2",
            "code" : "450226",
            "name" : "三江侗族自治县"
        },
        {
            "id"   : "2319",
            "pid"  : "2292",
            "type" : "1",
            "code" : "450300",
            "name" : "桂林市"
        },
        {
            "id"   : "2320",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450301",
            "name" : "市辖区"
        },
        {
            "id"   : "2321",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450302",
            "name" : "秀峰区"
        },
        {
            "id"   : "2322",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450303",
            "name" : "叠彩区"
        },
        {
            "id"   : "2323",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450304",
            "name" : "象山区"
        },
        {
            "id"   : "2324",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450305",
            "name" : "七星区"
        },
        {
            "id"   : "2325",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450311",
            "name" : "雁山区"
        },
        {
            "id"   : "2326",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450312",
            "name" : "临桂区"
        },
        {
            "id"   : "2327",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450321",
            "name" : "阳朔县"
        },
        {
            "id"   : "2328",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450323",
            "name" : "灵川县"
        },
        {
            "id"   : "2329",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450324",
            "name" : "全州县"
        },
        {
            "id"   : "2330",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450325",
            "name" : "兴安县"
        },
        {
            "id"   : "2331",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450326",
            "name" : "永福县"
        },
        {
            "id"   : "2332",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450327",
            "name" : "灌阳县"
        },
        {
            "id"   : "2333",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450328",
            "name" : "龙胜各族自治县"
        },
        {
            "id"   : "2334",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450329",
            "name" : "资源县"
        },
        {
            "id"   : "2335",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450330",
            "name" : "平乐县"
        },
        {
            "id"   : "2336",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450331",
            "name" : "荔浦县"
        },
        {
            "id"   : "2337",
            "pid"  : "2319",
            "type" : "2",
            "code" : "450332",
            "name" : "恭城瑶族自治县"
        },
        {
            "id"   : "2338",
            "pid"  : "2292",
            "type" : "1",
            "code" : "450400",
            "name" : "梧州市"
        },
        {
            "id"   : "2339",
            "pid"  : "2338",
            "type" : "2",
            "code" : "450401",
            "name" : "市辖区"
        },
        {
            "id"   : "2340",
            "pid"  : "2338",
            "type" : "2",
            "code" : "450403",
            "name" : "万秀区"
        },
        {
            "id"   : "2341",
            "pid"  : "2338",
            "type" : "2",
            "code" : "450405",
            "name" : "长洲区"
        },
        {
            "id"   : "2342",
            "pid"  : "2338",
            "type" : "2",
            "code" : "450406",
            "name" : "龙圩区"
        },
        {
            "id"   : "2343",
            "pid"  : "2338",
            "type" : "2",
            "code" : "450421",
            "name" : "苍梧县"
        },
        {
            "id"   : "2344",
            "pid"  : "2338",
            "type" : "2",
            "code" : "450422",
            "name" : "藤县"
        },
        {
            "id"   : "2345",
            "pid"  : "2338",
            "type" : "2",
            "code" : "450423",
            "name" : "蒙山县"
        },
        {
            "id"   : "2346",
            "pid"  : "2338",
            "type" : "2",
            "code" : "450481",
            "name" : "岑溪市"
        },
        {
            "id"   : "2347",
            "pid"  : "2292",
            "type" : "1",
            "code" : "450500",
            "name" : "北海市"
        },
        {
            "id"   : "2348",
            "pid"  : "2347",
            "type" : "2",
            "code" : "450501",
            "name" : "市辖区"
        },
        {
            "id"   : "2349",
            "pid"  : "2347",
            "type" : "2",
            "code" : "450502",
            "name" : "海城区"
        },
        {
            "id"   : "2350",
            "pid"  : "2347",
            "type" : "2",
            "code" : "450503",
            "name" : "银海区"
        },
        {
            "id"   : "2351",
            "pid"  : "2347",
            "type" : "2",
            "code" : "450512",
            "name" : "铁山港区"
        },
        {
            "id"   : "2352",
            "pid"  : "2347",
            "type" : "2",
            "code" : "450521",
            "name" : "合浦县"
        },
        {
            "id"   : "2353",
            "pid"  : "2292",
            "type" : "1",
            "code" : "450600",
            "name" : "防城港市"
        },
        {
            "id"   : "2354",
            "pid"  : "2353",
            "type" : "2",
            "code" : "450601",
            "name" : "市辖区"
        },
        {
            "id"   : "2355",
            "pid"  : "2353",
            "type" : "2",
            "code" : "450602",
            "name" : "港口区"
        },
        {
            "id"   : "2356",
            "pid"  : "2353",
            "type" : "2",
            "code" : "450603",
            "name" : "防城区"
        },
        {
            "id"   : "2357",
            "pid"  : "2353",
            "type" : "2",
            "code" : "450621",
            "name" : "上思县"
        },
        {
            "id"   : "2358",
            "pid"  : "2353",
            "type" : "2",
            "code" : "450681",
            "name" : "东兴市"
        },
        {
            "id"   : "2359",
            "pid"  : "2292",
            "type" : "1",
            "code" : "450700",
            "name" : "钦州市"
        },
        {
            "id"   : "2360",
            "pid"  : "2359",
            "type" : "2",
            "code" : "450701",
            "name" : "市辖区"
        },
        {
            "id"   : "2361",
            "pid"  : "2359",
            "type" : "2",
            "code" : "450702",
            "name" : "钦南区"
        },
        {
            "id"   : "2362",
            "pid"  : "2359",
            "type" : "2",
            "code" : "450703",
            "name" : "钦北区"
        },
        {
            "id"   : "2363",
            "pid"  : "2359",
            "type" : "2",
            "code" : "450721",
            "name" : "灵山县"
        },
        {
            "id"   : "2364",
            "pid"  : "2359",
            "type" : "2",
            "code" : "450722",
            "name" : "浦北县"
        },
        {
            "id"   : "2365",
            "pid"  : "2292",
            "type" : "1",
            "code" : "450800",
            "name" : "贵港市"
        },
        {
            "id"   : "2366",
            "pid"  : "2365",
            "type" : "2",
            "code" : "450801",
            "name" : "市辖区"
        },
        {
            "id"   : "2367",
            "pid"  : "2365",
            "type" : "2",
            "code" : "450802",
            "name" : "港北区"
        },
        {
            "id"   : "2368",
            "pid"  : "2365",
            "type" : "2",
            "code" : "450803",
            "name" : "港南区"
        },
        {
            "id"   : "2369",
            "pid"  : "2365",
            "type" : "2",
            "code" : "450804",
            "name" : "覃塘区"
        },
        {
            "id"   : "2370",
            "pid"  : "2365",
            "type" : "2",
            "code" : "450821",
            "name" : "平南县"
        },
        {
            "id"   : "2371",
            "pid"  : "2365",
            "type" : "2",
            "code" : "450881",
            "name" : "桂平市"
        },
        {
            "id"   : "2372",
            "pid"  : "2292",
            "type" : "1",
            "code" : "450900",
            "name" : "玉林市"
        },
        {
            "id"   : "2373",
            "pid"  : "2372",
            "type" : "2",
            "code" : "450901",
            "name" : "市辖区"
        },
        {
            "id"   : "2374",
            "pid"  : "2372",
            "type" : "2",
            "code" : "450902",
            "name" : "玉州区"
        },
        {
            "id"   : "2375",
            "pid"  : "2372",
            "type" : "2",
            "code" : "450903",
            "name" : "福绵区"
        },
        {
            "id"   : "2376",
            "pid"  : "2372",
            "type" : "2",
            "code" : "450921",
            "name" : "容县"
        },
        {
            "id"   : "2377",
            "pid"  : "2372",
            "type" : "2",
            "code" : "450922",
            "name" : "陆川县"
        },
        {
            "id"   : "2378",
            "pid"  : "2372",
            "type" : "2",
            "code" : "450923",
            "name" : "博白县"
        },
        {
            "id"   : "2379",
            "pid"  : "2372",
            "type" : "2",
            "code" : "450924",
            "name" : "兴业县"
        },
        {
            "id"   : "2380",
            "pid"  : "2372",
            "type" : "2",
            "code" : "450981",
            "name" : "北流市"
        },
        {
            "id"   : "2381",
            "pid"  : "2292",
            "type" : "1",
            "code" : "451000",
            "name" : "百色市"
        },
        {
            "id"   : "2382",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451001",
            "name" : "市辖区"
        },
        {
            "id"   : "2383",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451002",
            "name" : "右江区"
        },
        {
            "id"   : "2384",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451021",
            "name" : "田阳县"
        },
        {
            "id"   : "2385",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451022",
            "name" : "田东县"
        },
        {
            "id"   : "2386",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451023",
            "name" : "平果县"
        },
        {
            "id"   : "2387",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451024",
            "name" : "德保县"
        },
        {
            "id"   : "2388",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451025",
            "name" : "靖西县"
        },
        {
            "id"   : "2389",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451026",
            "name" : "那坡县"
        },
        {
            "id"   : "2390",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451027",
            "name" : "凌云县"
        },
        {
            "id"   : "2391",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451028",
            "name" : "乐业县"
        },
        {
            "id"   : "2392",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451029",
            "name" : "田林县"
        },
        {
            "id"   : "2393",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451030",
            "name" : "西林县"
        },
        {
            "id"   : "2394",
            "pid"  : "2381",
            "type" : "2",
            "code" : "451031",
            "name" : "隆林各族自治县"
        },
        {
            "id"   : "2395",
            "pid"  : "2292",
            "type" : "1",
            "code" : "451100",
            "name" : "贺州市"
        },
        {
            "id"   : "2396",
            "pid"  : "2395",
            "type" : "2",
            "code" : "451101",
            "name" : "市辖区"
        },
        {
            "id"   : "2397",
            "pid"  : "2395",
            "type" : "2",
            "code" : "451102",
            "name" : "八步区"
        },
        {
            "id"   : "2398",
            "pid"  : "2395",
            "type" : "2",
            "code" : "451121",
            "name" : "昭平县"
        },
        {
            "id"   : "2399",
            "pid"  : "2395",
            "type" : "2",
            "code" : "451122",
            "name" : "钟山县"
        },
        {
            "id"   : "2400",
            "pid"  : "2395",
            "type" : "2",
            "code" : "451123",
            "name" : "富川瑶族自治县"
        },
        {
            "id"   : "2401",
            "pid"  : "2292",
            "type" : "1",
            "code" : "451200",
            "name" : "河池市"
        },
        {
            "id"   : "2402",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451201",
            "name" : "市辖区"
        },
        {
            "id"   : "2403",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451202",
            "name" : "金城江区"
        },
        {
            "id"   : "2404",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451221",
            "name" : "南丹县"
        },
        {
            "id"   : "2405",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451222",
            "name" : "天峨县"
        },
        {
            "id"   : "2406",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451223",
            "name" : "凤山县"
        },
        {
            "id"   : "2407",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451224",
            "name" : "东兰县"
        },
        {
            "id"   : "2408",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451225",
            "name" : "罗城仫佬族自治县"
        },
        {
            "id"   : "2409",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451226",
            "name" : "环江毛南族自治县"
        },
        {
            "id"   : "2410",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451227",
            "name" : "巴马瑶族自治县"
        },
        {
            "id"   : "2411",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451228",
            "name" : "都安瑶族自治县"
        },
        {
            "id"   : "2412",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451229",
            "name" : "大化瑶族自治县"
        },
        {
            "id"   : "2413",
            "pid"  : "2401",
            "type" : "2",
            "code" : "451281",
            "name" : "宜州市"
        },
        {
            "id"   : "2414",
            "pid"  : "2292",
            "type" : "1",
            "code" : "451300",
            "name" : "来宾市"
        },
        {
            "id"   : "2415",
            "pid"  : "2414",
            "type" : "2",
            "code" : "451301",
            "name" : "市辖区"
        },
        {
            "id"   : "2416",
            "pid"  : "2414",
            "type" : "2",
            "code" : "451302",
            "name" : "兴宾区"
        },
        {
            "id"   : "2417",
            "pid"  : "2414",
            "type" : "2",
            "code" : "451321",
            "name" : "忻城县"
        },
        {
            "id"   : "2418",
            "pid"  : "2414",
            "type" : "2",
            "code" : "451322",
            "name" : "象州县"
        },
        {
            "id"   : "2419",
            "pid"  : "2414",
            "type" : "2",
            "code" : "451323",
            "name" : "武宣县"
        },
        {
            "id"   : "2420",
            "pid"  : "2414",
            "type" : "2",
            "code" : "451324",
            "name" : "金秀瑶族自治县"
        },
        {
            "id"   : "2421",
            "pid"  : "2414",
            "type" : "2",
            "code" : "451381",
            "name" : "合山市"
        },
        {
            "id"   : "2422",
            "pid"  : "2292",
            "type" : "1",
            "code" : "451400",
            "name" : "崇左市"
        },
        {
            "id"   : "2423",
            "pid"  : "2422",
            "type" : "2",
            "code" : "451401",
            "name" : "市辖区"
        },
        {
            "id"   : "2424",
            "pid"  : "2422",
            "type" : "2",
            "code" : "451402",
            "name" : "江州区"
        },
        {
            "id"   : "2425",
            "pid"  : "2422",
            "type" : "2",
            "code" : "451421",
            "name" : "扶绥县"
        },
        {
            "id"   : "2426",
            "pid"  : "2422",
            "type" : "2",
            "code" : "451422",
            "name" : "宁明县"
        },
        {
            "id"   : "2427",
            "pid"  : "2422",
            "type" : "2",
            "code" : "451423",
            "name" : "龙州县"
        },
        {
            "id"   : "2428",
            "pid"  : "2422",
            "type" : "2",
            "code" : "451424",
            "name" : "大新县"
        },
        {
            "id"   : "2429",
            "pid"  : "2422",
            "type" : "2",
            "code" : "451425",
            "name" : "天等县"
        },
        {
            "id"   : "2430",
            "pid"  : "2422",
            "type" : "2",
            "code" : "451481",
            "name" : "凭祥市"
        },
        {
            "id"   : "2431",
            "pid"  : "0",
            "type" : "0",
            "code" : "460000",
            "name" : "海南省"
        },
        {
            "id"   : "2432",
            "pid"  : "2431",
            "type" : "1",
            "code" : "460100",
            "name" : "海口市"
        },
        {
            "id"   : "2433",
            "pid"  : "2432",
            "type" : "2",
            "code" : "460101",
            "name" : "市辖区"
        },
        {
            "id"   : "2434",
            "pid"  : "2432",
            "type" : "2",
            "code" : "460105",
            "name" : "秀英区"
        },
        {
            "id"   : "2435",
            "pid"  : "2432",
            "type" : "2",
            "code" : "460106",
            "name" : "龙华区"
        },
        {
            "id"   : "2436",
            "pid"  : "2432",
            "type" : "2",
            "code" : "460107",
            "name" : "琼山区"
        },
        {
            "id"   : "2437",
            "pid"  : "2432",
            "type" : "2",
            "code" : "460108",
            "name" : "美兰区"
        },
        {
            "id"   : "2438",
            "pid"  : "2431",
            "type" : "1",
            "code" : "460200",
            "name" : "三亚市"
        },
        {
            "id"   : "2439",
            "pid"  : "2438",
            "type" : "2",
            "code" : "460201",
            "name" : "市辖区"
        },
        {
            "id"   : "2440",
            "pid"  : "2438",
            "type" : "2",
            "code" : "460202",
            "name" : "海棠区"
        },
        {
            "id"   : "2441",
            "pid"  : "2438",
            "type" : "2",
            "code" : "460203",
            "name" : "吉阳区"
        },
        {
            "id"   : "2442",
            "pid"  : "2438",
            "type" : "2",
            "code" : "460204",
            "name" : "天涯区"
        },
        {
            "id"   : "2443",
            "pid"  : "2438",
            "type" : "2",
            "code" : "460205",
            "name" : "崖州区"
        },
        {
            "id"   : "2444",
            "pid"  : "2431",
            "type" : "1",
            "code" : "460300",
            "name" : "三沙市"
        },
        {
            "id"   : "2445",
            "pid"  : "2431",
            "type" : "1",
            "code" : "469000",
            "name" : "省直辖县级行政区划"
        },
        {
            "id"   : "2446",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469001",
            "name" : "五指山市"
        },
        {
            "id"   : "2447",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469002",
            "name" : "琼海市"
        },
        {
            "id"   : "2448",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469003",
            "name" : "儋州市"
        },
        {
            "id"   : "2449",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469005",
            "name" : "文昌市"
        },
        {
            "id"   : "2450",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469006",
            "name" : "万宁市"
        },
        {
            "id"   : "2451",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469007",
            "name" : "东方市"
        },
        {
            "id"   : "2452",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469021",
            "name" : "定安县"
        },
        {
            "id"   : "2453",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469022",
            "name" : "屯昌县"
        },
        {
            "id"   : "2454",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469023",
            "name" : "澄迈县"
        },
        {
            "id"   : "2455",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469024",
            "name" : "临高县"
        },
        {
            "id"   : "2456",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469025",
            "name" : "白沙黎族自治县"
        },
        {
            "id"   : "2457",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469026",
            "name" : "昌江黎族自治县"
        },
        {
            "id"   : "2458",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469027",
            "name" : "乐东黎族自治县"
        },
        {
            "id"   : "2459",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469028",
            "name" : "陵水黎族自治县"
        },
        {
            "id"   : "2460",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469029",
            "name" : "保亭黎族苗族自治县"
        },
        {
            "id"   : "2461",
            "pid"  : "2445",
            "type" : "2",
            "code" : "469030",
            "name" : "琼中黎族苗族自治县"
        },
        {
            "id"   : "2462",
            "pid"  : "0",
            "type" : "0",
            "code" : "500000",
            "name" : "重庆市"
        },
        {
            "id"   : "2463",
            "pid"  : "2462",
            "type" : "1",
            "code" : "500100",
            "name" : "市辖区"
        },
        {
            "id"   : "2464",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500101",
            "name" : "万州区"
        },
        {
            "id"   : "2465",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500102",
            "name" : "涪陵区"
        },
        {
            "id"   : "2466",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500103",
            "name" : "渝中区"
        },
        {
            "id"   : "2467",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500104",
            "name" : "大渡口区"
        },
        {
            "id"   : "2468",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500105",
            "name" : "江北区"
        },
        {
            "id"   : "2469",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500106",
            "name" : "沙坪坝区"
        },
        {
            "id"   : "2470",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500107",
            "name" : "九龙坡区"
        },
        {
            "id"   : "2471",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500108",
            "name" : "南岸区"
        },
        {
            "id"   : "2472",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500109",
            "name" : "北碚区"
        },
        {
            "id"   : "2473",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500110",
            "name" : "綦江区"
        },
        {
            "id"   : "2474",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500111",
            "name" : "大足区"
        },
        {
            "id"   : "2475",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500112",
            "name" : "渝北区"
        },
        {
            "id"   : "2476",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500113",
            "name" : "巴南区"
        },
        {
            "id"   : "2477",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500114",
            "name" : "黔江区"
        },
        {
            "id"   : "2478",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500115",
            "name" : "长寿区"
        },
        {
            "id"   : "2479",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500116",
            "name" : "江津区"
        },
        {
            "id"   : "2480",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500117",
            "name" : "合川区"
        },
        {
            "id"   : "2481",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500118",
            "name" : "永川区"
        },
        {
            "id"   : "2482",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500119",
            "name" : "南川区"
        },
        {
            "id"   : "2483",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500120",
            "name" : "璧山区"
        },
        {
            "id"   : "2484",
            "pid"  : "2463",
            "type" : "2",
            "code" : "500151",
            "name" : "铜梁区"
        },
        {
            "id"   : "2485",
            "pid"  : "2462",
            "type" : "1",
            "code" : "500200",
            "name" : "县"
        },
        {
            "id"   : "2486",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500223",
            "name" : "潼南县"
        },
        {
            "id"   : "2487",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500226",
            "name" : "荣昌县"
        },
        {
            "id"   : "2488",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500228",
            "name" : "梁平县"
        },
        {
            "id"   : "2489",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500229",
            "name" : "城口县"
        },
        {
            "id"   : "2490",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500230",
            "name" : "丰都县"
        },
        {
            "id"   : "2491",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500231",
            "name" : "垫江县"
        },
        {
            "id"   : "2492",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500232",
            "name" : "武隆县"
        },
        {
            "id"   : "2493",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500233",
            "name" : "忠县"
        },
        {
            "id"   : "2494",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500234",
            "name" : "开县"
        },
        {
            "id"   : "2495",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500235",
            "name" : "云阳县"
        },
        {
            "id"   : "2496",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500236",
            "name" : "奉节县"
        },
        {
            "id"   : "2497",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500237",
            "name" : "巫山县"
        },
        {
            "id"   : "2498",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500238",
            "name" : "巫溪县"
        },
        {
            "id"   : "2499",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500240",
            "name" : "石柱土家族自治县"
        },
        {
            "id"   : "2500",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500241",
            "name" : "秀山土家族苗族自治县"
        },
        {
            "id"   : "2501",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500242",
            "name" : "酉阳土家族苗族自治县"
        },
        {
            "id"   : "2502",
            "pid"  : "2485",
            "type" : "2",
            "code" : "500243",
            "name" : "彭水苗族土家族自治县"
        },
        {
            "id"   : "2503",
            "pid"  : "0",
            "type" : "0",
            "code" : "510000",
            "name" : "四川省"
        },
        {
            "id"   : "2504",
            "pid"  : "2503",
            "type" : "1",
            "code" : "510100",
            "name" : "成都市"
        },
        {
            "id"   : "2505",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510101",
            "name" : "市辖区"
        },
        {
            "id"   : "2506",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510104",
            "name" : "锦江区"
        },
        {
            "id"   : "2507",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510105",
            "name" : "青羊区"
        },
        {
            "id"   : "2508",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510106",
            "name" : "金牛区"
        },
        {
            "id"   : "2509",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510107",
            "name" : "武侯区"
        },
        {
            "id"   : "2510",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510108",
            "name" : "成华区"
        },
        {
            "id"   : "2511",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510112",
            "name" : "龙泉驿区"
        },
        {
            "id"   : "2512",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510113",
            "name" : "青白江区"
        },
        {
            "id"   : "2513",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510114",
            "name" : "新都区"
        },
        {
            "id"   : "2514",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510115",
            "name" : "温江区"
        },
        {
            "id"   : "2515",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510121",
            "name" : "金堂县"
        },
        {
            "id"   : "2516",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510122",
            "name" : "双流县"
        },
        {
            "id"   : "2517",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510124",
            "name" : "郫县"
        },
        {
            "id"   : "2518",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510129",
            "name" : "大邑县"
        },
        {
            "id"   : "2519",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510131",
            "name" : "蒲江县"
        },
        {
            "id"   : "2520",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510132",
            "name" : "新津县"
        },
        {
            "id"   : "2521",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510181",
            "name" : "都江堰市"
        },
        {
            "id"   : "2522",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510182",
            "name" : "彭州市"
        },
        {
            "id"   : "2523",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510183",
            "name" : "邛崃市"
        },
        {
            "id"   : "2524",
            "pid"  : "2504",
            "type" : "2",
            "code" : "510184",
            "name" : "崇州市"
        },
        {
            "id"   : "2525",
            "pid"  : "2503",
            "type" : "1",
            "code" : "510300",
            "name" : "自贡市"
        },
        {
            "id"   : "2526",
            "pid"  : "2525",
            "type" : "2",
            "code" : "510301",
            "name" : "市辖区"
        },
        {
            "id"   : "2527",
            "pid"  : "2525",
            "type" : "2",
            "code" : "510302",
            "name" : "自流井区"
        },
        {
            "id"   : "2528",
            "pid"  : "2525",
            "type" : "2",
            "code" : "510303",
            "name" : "贡井区"
        },
        {
            "id"   : "2529",
            "pid"  : "2525",
            "type" : "2",
            "code" : "510304",
            "name" : "大安区"
        },
        {
            "id"   : "2530",
            "pid"  : "2525",
            "type" : "2",
            "code" : "510311",
            "name" : "沿滩区"
        },
        {
            "id"   : "2531",
            "pid"  : "2525",
            "type" : "2",
            "code" : "510321",
            "name" : "荣县"
        },
        {
            "id"   : "2532",
            "pid"  : "2525",
            "type" : "2",
            "code" : "510322",
            "name" : "富顺县"
        },
        {
            "id"   : "2533",
            "pid"  : "2503",
            "type" : "1",
            "code" : "510400",
            "name" : "攀枝花市"
        },
        {
            "id"   : "2534",
            "pid"  : "2533",
            "type" : "2",
            "code" : "510401",
            "name" : "市辖区"
        },
        {
            "id"   : "2535",
            "pid"  : "2533",
            "type" : "2",
            "code" : "510402",
            "name" : "东区"
        },
        {
            "id"   : "2536",
            "pid"  : "2533",
            "type" : "2",
            "code" : "510403",
            "name" : "西区"
        },
        {
            "id"   : "2537",
            "pid"  : "2533",
            "type" : "2",
            "code" : "510411",
            "name" : "仁和区"
        },
        {
            "id"   : "2538",
            "pid"  : "2533",
            "type" : "2",
            "code" : "510421",
            "name" : "米易县"
        },
        {
            "id"   : "2539",
            "pid"  : "2533",
            "type" : "2",
            "code" : "510422",
            "name" : "盐边县"
        },
        {
            "id"   : "2540",
            "pid"  : "2503",
            "type" : "1",
            "code" : "510500",
            "name" : "泸州市"
        },
        {
            "id"   : "2541",
            "pid"  : "2540",
            "type" : "2",
            "code" : "510501",
            "name" : "市辖区"
        },
        {
            "id"   : "2542",
            "pid"  : "2540",
            "type" : "2",
            "code" : "510502",
            "name" : "江阳区"
        },
        {
            "id"   : "2543",
            "pid"  : "2540",
            "type" : "2",
            "code" : "510503",
            "name" : "纳溪区"
        },
        {
            "id"   : "2544",
            "pid"  : "2540",
            "type" : "2",
            "code" : "510504",
            "name" : "龙马潭区"
        },
        {
            "id"   : "2545",
            "pid"  : "2540",
            "type" : "2",
            "code" : "510521",
            "name" : "泸县"
        },
        {
            "id"   : "2546",
            "pid"  : "2540",
            "type" : "2",
            "code" : "510522",
            "name" : "合江县"
        },
        {
            "id"   : "2547",
            "pid"  : "2540",
            "type" : "2",
            "code" : "510524",
            "name" : "叙永县"
        },
        {
            "id"   : "2548",
            "pid"  : "2540",
            "type" : "2",
            "code" : "510525",
            "name" : "古蔺县"
        },
        {
            "id"   : "2549",
            "pid"  : "2503",
            "type" : "1",
            "code" : "510600",
            "name" : "德阳市"
        },
        {
            "id"   : "2550",
            "pid"  : "2549",
            "type" : "2",
            "code" : "510601",
            "name" : "市辖区"
        },
        {
            "id"   : "2551",
            "pid"  : "2549",
            "type" : "2",
            "code" : "510603",
            "name" : "旌阳区"
        },
        {
            "id"   : "2552",
            "pid"  : "2549",
            "type" : "2",
            "code" : "510623",
            "name" : "中江县"
        },
        {
            "id"   : "2553",
            "pid"  : "2549",
            "type" : "2",
            "code" : "510626",
            "name" : "罗江县"
        },
        {
            "id"   : "2554",
            "pid"  : "2549",
            "type" : "2",
            "code" : "510681",
            "name" : "广汉市"
        },
        {
            "id"   : "2555",
            "pid"  : "2549",
            "type" : "2",
            "code" : "510682",
            "name" : "什邡市"
        },
        {
            "id"   : "2556",
            "pid"  : "2549",
            "type" : "2",
            "code" : "510683",
            "name" : "绵竹市"
        },
        {
            "id"   : "2557",
            "pid"  : "2503",
            "type" : "1",
            "code" : "510700",
            "name" : "绵阳市"
        },
        {
            "id"   : "2558",
            "pid"  : "2557",
            "type" : "2",
            "code" : "510701",
            "name" : "市辖区"
        },
        {
            "id"   : "2559",
            "pid"  : "2557",
            "type" : "2",
            "code" : "510703",
            "name" : "涪城区"
        },
        {
            "id"   : "2560",
            "pid"  : "2557",
            "type" : "2",
            "code" : "510704",
            "name" : "游仙区"
        },
        {
            "id"   : "2561",
            "pid"  : "2557",
            "type" : "2",
            "code" : "510722",
            "name" : "三台县"
        },
        {
            "id"   : "2562",
            "pid"  : "2557",
            "type" : "2",
            "code" : "510723",
            "name" : "盐亭县"
        },
        {
            "id"   : "2563",
            "pid"  : "2557",
            "type" : "2",
            "code" : "510724",
            "name" : "安县"
        },
        {
            "id"   : "2564",
            "pid"  : "2557",
            "type" : "2",
            "code" : "510725",
            "name" : "梓潼县"
        },
        {
            "id"   : "2565",
            "pid"  : "2557",
            "type" : "2",
            "code" : "510726",
            "name" : "北川羌族自治县"
        },
        {
            "id"   : "2566",
            "pid"  : "2557",
            "type" : "2",
            "code" : "510727",
            "name" : "平武县"
        },
        {
            "id"   : "2567",
            "pid"  : "2557",
            "type" : "2",
            "code" : "510781",
            "name" : "江油市"
        },
        {
            "id"   : "2568",
            "pid"  : "2503",
            "type" : "1",
            "code" : "510800",
            "name" : "广元市"
        },
        {
            "id"   : "2569",
            "pid"  : "2568",
            "type" : "2",
            "code" : "510801",
            "name" : "市辖区"
        },
        {
            "id"   : "2570",
            "pid"  : "2568",
            "type" : "2",
            "code" : "510802",
            "name" : "利州区"
        },
        {
            "id"   : "2571",
            "pid"  : "2568",
            "type" : "2",
            "code" : "510811",
            "name" : "昭化区"
        },
        {
            "id"   : "2572",
            "pid"  : "2568",
            "type" : "2",
            "code" : "510812",
            "name" : "朝天区"
        },
        {
            "id"   : "2573",
            "pid"  : "2568",
            "type" : "2",
            "code" : "510821",
            "name" : "旺苍县"
        },
        {
            "id"   : "2574",
            "pid"  : "2568",
            "type" : "2",
            "code" : "510822",
            "name" : "青川县"
        },
        {
            "id"   : "2575",
            "pid"  : "2568",
            "type" : "2",
            "code" : "510823",
            "name" : "剑阁县"
        },
        {
            "id"   : "2576",
            "pid"  : "2568",
            "type" : "2",
            "code" : "510824",
            "name" : "苍溪县"
        },
        {
            "id"   : "2577",
            "pid"  : "2503",
            "type" : "1",
            "code" : "510900",
            "name" : "遂宁市"
        },
        {
            "id"   : "2578",
            "pid"  : "2577",
            "type" : "2",
            "code" : "510901",
            "name" : "市辖区"
        },
        {
            "id"   : "2579",
            "pid"  : "2577",
            "type" : "2",
            "code" : "510903",
            "name" : "船山区"
        },
        {
            "id"   : "2580",
            "pid"  : "2577",
            "type" : "2",
            "code" : "510904",
            "name" : "安居区"
        },
        {
            "id"   : "2581",
            "pid"  : "2577",
            "type" : "2",
            "code" : "510921",
            "name" : "蓬溪县"
        },
        {
            "id"   : "2582",
            "pid"  : "2577",
            "type" : "2",
            "code" : "510922",
            "name" : "射洪县"
        },
        {
            "id"   : "2583",
            "pid"  : "2577",
            "type" : "2",
            "code" : "510923",
            "name" : "大英县"
        },
        {
            "id"   : "2584",
            "pid"  : "2503",
            "type" : "1",
            "code" : "511000",
            "name" : "内江市"
        },
        {
            "id"   : "2585",
            "pid"  : "2584",
            "type" : "2",
            "code" : "511001",
            "name" : "市辖区"
        },
        {
            "id"   : "2586",
            "pid"  : "2584",
            "type" : "2",
            "code" : "511002",
            "name" : "市中区"
        },
        {
            "id"   : "2587",
            "pid"  : "2584",
            "type" : "2",
            "code" : "511011",
            "name" : "东兴区"
        },
        {
            "id"   : "2588",
            "pid"  : "2584",
            "type" : "2",
            "code" : "511024",
            "name" : "威远县"
        },
        {
            "id"   : "2589",
            "pid"  : "2584",
            "type" : "2",
            "code" : "511025",
            "name" : "资中县"
        },
        {
            "id"   : "2590",
            "pid"  : "2584",
            "type" : "2",
            "code" : "511028",
            "name" : "隆昌县"
        },
        {
            "id"   : "2591",
            "pid"  : "2503",
            "type" : "1",
            "code" : "511100",
            "name" : "乐山市"
        },
        {
            "id"   : "2592",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511101",
            "name" : "市辖区"
        },
        {
            "id"   : "2593",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511102",
            "name" : "市中区"
        },
        {
            "id"   : "2594",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511111",
            "name" : "沙湾区"
        },
        {
            "id"   : "2595",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511112",
            "name" : "五通桥区"
        },
        {
            "id"   : "2596",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511113",
            "name" : "金口河区"
        },
        {
            "id"   : "2597",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511123",
            "name" : "犍为县"
        },
        {
            "id"   : "2598",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511124",
            "name" : "井研县"
        },
        {
            "id"   : "2599",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511126",
            "name" : "夹江县"
        },
        {
            "id"   : "2600",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511129",
            "name" : "沐川县"
        },
        {
            "id"   : "2601",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511132",
            "name" : "峨边彝族自治县"
        },
        {
            "id"   : "2602",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511133",
            "name" : "马边彝族自治县"
        },
        {
            "id"   : "2603",
            "pid"  : "2591",
            "type" : "2",
            "code" : "511181",
            "name" : "峨眉山市"
        },
        {
            "id"   : "2604",
            "pid"  : "2503",
            "type" : "1",
            "code" : "511300",
            "name" : "南充市"
        },
        {
            "id"   : "2605",
            "pid"  : "2604",
            "type" : "2",
            "code" : "511301",
            "name" : "市辖区"
        },
        {
            "id"   : "2606",
            "pid"  : "2604",
            "type" : "2",
            "code" : "511302",
            "name" : "顺庆区"
        },
        {
            "id"   : "2607",
            "pid"  : "2604",
            "type" : "2",
            "code" : "511303",
            "name" : "高坪区"
        },
        {
            "id"   : "2608",
            "pid"  : "2604",
            "type" : "2",
            "code" : "511304",
            "name" : "嘉陵区"
        },
        {
            "id"   : "2609",
            "pid"  : "2604",
            "type" : "2",
            "code" : "511321",
            "name" : "南部县"
        },
        {
            "id"   : "2610",
            "pid"  : "2604",
            "type" : "2",
            "code" : "511322",
            "name" : "营山县"
        },
        {
            "id"   : "2611",
            "pid"  : "2604",
            "type" : "2",
            "code" : "511323",
            "name" : "蓬安县"
        },
        {
            "id"   : "2612",
            "pid"  : "2604",
            "type" : "2",
            "code" : "511324",
            "name" : "仪陇县"
        },
        {
            "id"   : "2613",
            "pid"  : "2604",
            "type" : "2",
            "code" : "511325",
            "name" : "西充县"
        },
        {
            "id"   : "2614",
            "pid"  : "2604",
            "type" : "2",
            "code" : "511381",
            "name" : "阆中市"
        },
        {
            "id"   : "2615",
            "pid"  : "2503",
            "type" : "1",
            "code" : "511400",
            "name" : "眉山市"
        },
        {
            "id"   : "2616",
            "pid"  : "2615",
            "type" : "2",
            "code" : "511401",
            "name" : "市辖区"
        },
        {
            "id"   : "2617",
            "pid"  : "2615",
            "type" : "2",
            "code" : "511402",
            "name" : "东坡区"
        },
        {
            "id"   : "2618",
            "pid"  : "2615",
            "type" : "2",
            "code" : "511421",
            "name" : "仁寿县"
        },
        {
            "id"   : "2619",
            "pid"  : "2615",
            "type" : "2",
            "code" : "511422",
            "name" : "彭山县"
        },
        {
            "id"   : "2620",
            "pid"  : "2615",
            "type" : "2",
            "code" : "511423",
            "name" : "洪雅县"
        },
        {
            "id"   : "2621",
            "pid"  : "2615",
            "type" : "2",
            "code" : "511424",
            "name" : "丹棱县"
        },
        {
            "id"   : "2622",
            "pid"  : "2615",
            "type" : "2",
            "code" : "511425",
            "name" : "青神县"
        },
        {
            "id"   : "2623",
            "pid"  : "2503",
            "type" : "1",
            "code" : "511500",
            "name" : "宜宾市"
        },
        {
            "id"   : "2624",
            "pid"  : "2623",
            "type" : "2",
            "code" : "511501",
            "name" : "市辖区"
        },
        {
            "id"   : "2625",
            "pid"  : "2623",
            "type" : "2",
            "code" : "511502",
            "name" : "翠屏区"
        },
        {
            "id"   : "2626",
            "pid"  : "2623",
            "type" : "2",
            "code" : "511503",
            "name" : "南溪区"
        },
        {
            "id"   : "2627",
            "pid"  : "2623",
            "type" : "2",
            "code" : "511521",
            "name" : "宜宾县"
        },
        {
            "id"   : "2628",
            "pid"  : "2623",
            "type" : "2",
            "code" : "511523",
            "name" : "江安县"
        },
        {
            "id"   : "2629",
            "pid"  : "2623",
            "type" : "2",
            "code" : "511524",
            "name" : "长宁县"
        },
        {
            "id"   : "2630",
            "pid"  : "2623",
            "type" : "2",
            "code" : "511525",
            "name" : "高县"
        },
        {
            "id"   : "2631",
            "pid"  : "2623",
            "type" : "2",
            "code" : "511526",
            "name" : "珙县"
        },
        {
            "id"   : "2632",
            "pid"  : "2623",
            "type" : "2",
            "code" : "511527",
            "name" : "筠连县"
        },
        {
            "id"   : "2633",
            "pid"  : "2623",
            "type" : "2",
            "code" : "511528",
            "name" : "兴文县"
        },
        {
            "id"   : "2634",
            "pid"  : "2623",
            "type" : "2",
            "code" : "511529",
            "name" : "屏山县"
        },
        {
            "id"   : "2635",
            "pid"  : "2503",
            "type" : "1",
            "code" : "511600",
            "name" : "广安市"
        },
        {
            "id"   : "2636",
            "pid"  : "2635",
            "type" : "2",
            "code" : "511601",
            "name" : "市辖区"
        },
        {
            "id"   : "2637",
            "pid"  : "2635",
            "type" : "2",
            "code" : "511602",
            "name" : "广安区"
        },
        {
            "id"   : "2638",
            "pid"  : "2635",
            "type" : "2",
            "code" : "511603",
            "name" : "前锋区"
        },
        {
            "id"   : "2639",
            "pid"  : "2635",
            "type" : "2",
            "code" : "511621",
            "name" : "岳池县"
        },
        {
            "id"   : "2640",
            "pid"  : "2635",
            "type" : "2",
            "code" : "511622",
            "name" : "武胜县"
        },
        {
            "id"   : "2641",
            "pid"  : "2635",
            "type" : "2",
            "code" : "511623",
            "name" : "邻水县"
        },
        {
            "id"   : "2642",
            "pid"  : "2635",
            "type" : "2",
            "code" : "511681",
            "name" : "华蓥市"
        },
        {
            "id"   : "2643",
            "pid"  : "2503",
            "type" : "1",
            "code" : "511700",
            "name" : "达州市"
        },
        {
            "id"   : "2644",
            "pid"  : "2643",
            "type" : "2",
            "code" : "511701",
            "name" : "市辖区"
        },
        {
            "id"   : "2645",
            "pid"  : "2643",
            "type" : "2",
            "code" : "511702",
            "name" : "通川区"
        },
        {
            "id"   : "2646",
            "pid"  : "2643",
            "type" : "2",
            "code" : "511703",
            "name" : "达川区"
        },
        {
            "id"   : "2647",
            "pid"  : "2643",
            "type" : "2",
            "code" : "511722",
            "name" : "宣汉县"
        },
        {
            "id"   : "2648",
            "pid"  : "2643",
            "type" : "2",
            "code" : "511723",
            "name" : "开江县"
        },
        {
            "id"   : "2649",
            "pid"  : "2643",
            "type" : "2",
            "code" : "511724",
            "name" : "大竹县"
        },
        {
            "id"   : "2650",
            "pid"  : "2643",
            "type" : "2",
            "code" : "511725",
            "name" : "渠县"
        },
        {
            "id"   : "2651",
            "pid"  : "2643",
            "type" : "2",
            "code" : "511781",
            "name" : "万源市"
        },
        {
            "id"   : "2652",
            "pid"  : "2503",
            "type" : "1",
            "code" : "511800",
            "name" : "雅安市"
        },
        {
            "id"   : "2653",
            "pid"  : "2652",
            "type" : "2",
            "code" : "511801",
            "name" : "市辖区"
        },
        {
            "id"   : "2654",
            "pid"  : "2652",
            "type" : "2",
            "code" : "511802",
            "name" : "雨城区"
        },
        {
            "id"   : "2655",
            "pid"  : "2652",
            "type" : "2",
            "code" : "511803",
            "name" : "名山区"
        },
        {
            "id"   : "2656",
            "pid"  : "2652",
            "type" : "2",
            "code" : "511822",
            "name" : "荥经县"
        },
        {
            "id"   : "2657",
            "pid"  : "2652",
            "type" : "2",
            "code" : "511823",
            "name" : "汉源县"
        },
        {
            "id"   : "2658",
            "pid"  : "2652",
            "type" : "2",
            "code" : "511824",
            "name" : "石棉县"
        },
        {
            "id"   : "2659",
            "pid"  : "2652",
            "type" : "2",
            "code" : "511825",
            "name" : "天全县"
        },
        {
            "id"   : "2660",
            "pid"  : "2652",
            "type" : "2",
            "code" : "511826",
            "name" : "芦山县"
        },
        {
            "id"   : "2661",
            "pid"  : "2652",
            "type" : "2",
            "code" : "511827",
            "name" : "宝兴县"
        },
        {
            "id"   : "2662",
            "pid"  : "2503",
            "type" : "1",
            "code" : "511900",
            "name" : "巴中市"
        },
        {
            "id"   : "2663",
            "pid"  : "2662",
            "type" : "2",
            "code" : "511901",
            "name" : "市辖区"
        },
        {
            "id"   : "2664",
            "pid"  : "2662",
            "type" : "2",
            "code" : "511902",
            "name" : "巴州区"
        },
        {
            "id"   : "2665",
            "pid"  : "2662",
            "type" : "2",
            "code" : "511903",
            "name" : "恩阳区"
        },
        {
            "id"   : "2666",
            "pid"  : "2662",
            "type" : "2",
            "code" : "511921",
            "name" : "通江县"
        },
        {
            "id"   : "2667",
            "pid"  : "2662",
            "type" : "2",
            "code" : "511922",
            "name" : "南江县"
        },
        {
            "id"   : "2668",
            "pid"  : "2662",
            "type" : "2",
            "code" : "511923",
            "name" : "平昌县"
        },
        {
            "id"   : "2669",
            "pid"  : "2503",
            "type" : "1",
            "code" : "512000",
            "name" : "资阳市"
        },
        {
            "id"   : "2670",
            "pid"  : "2669",
            "type" : "2",
            "code" : "512001",
            "name" : "市辖区"
        },
        {
            "id"   : "2671",
            "pid"  : "2669",
            "type" : "2",
            "code" : "512002",
            "name" : "雁江区"
        },
        {
            "id"   : "2672",
            "pid"  : "2669",
            "type" : "2",
            "code" : "512021",
            "name" : "安岳县"
        },
        {
            "id"   : "2673",
            "pid"  : "2669",
            "type" : "2",
            "code" : "512022",
            "name" : "乐至县"
        },
        {
            "id"   : "2674",
            "pid"  : "2669",
            "type" : "2",
            "code" : "512081",
            "name" : "简阳市"
        },
        {
            "id"   : "2675",
            "pid"  : "2503",
            "type" : "1",
            "code" : "513200",
            "name" : "阿坝藏族羌族自治州"
        },
        {
            "id"   : "2676",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513221",
            "name" : "汶川县"
        },
        {
            "id"   : "2677",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513222",
            "name" : "理县"
        },
        {
            "id"   : "2678",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513223",
            "name" : "茂县"
        },
        {
            "id"   : "2679",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513224",
            "name" : "松潘县"
        },
        {
            "id"   : "2680",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513225",
            "name" : "九寨沟县"
        },
        {
            "id"   : "2681",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513226",
            "name" : "金川县"
        },
        {
            "id"   : "2682",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513227",
            "name" : "小金县"
        },
        {
            "id"   : "2683",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513228",
            "name" : "黑水县"
        },
        {
            "id"   : "2684",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513229",
            "name" : "马尔康县"
        },
        {
            "id"   : "2685",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513230",
            "name" : "壤塘县"
        },
        {
            "id"   : "2686",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513231",
            "name" : "阿坝县"
        },
        {
            "id"   : "2687",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513232",
            "name" : "若尔盖县"
        },
        {
            "id"   : "2688",
            "pid"  : "2675",
            "type" : "2",
            "code" : "513233",
            "name" : "红原县"
        },
        {
            "id"   : "2689",
            "pid"  : "2503",
            "type" : "1",
            "code" : "513300",
            "name" : "甘孜藏族自治州"
        },
        {
            "id"   : "2690",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513321",
            "name" : "康定县"
        },
        {
            "id"   : "2691",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513322",
            "name" : "泸定县"
        },
        {
            "id"   : "2692",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513323",
            "name" : "丹巴县"
        },
        {
            "id"   : "2693",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513324",
            "name" : "九龙县"
        },
        {
            "id"   : "2694",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513325",
            "name" : "雅江县"
        },
        {
            "id"   : "2695",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513326",
            "name" : "道孚县"
        },
        {
            "id"   : "2696",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513327",
            "name" : "炉霍县"
        },
        {
            "id"   : "2697",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513328",
            "name" : "甘孜县"
        },
        {
            "id"   : "2698",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513329",
            "name" : "新龙县"
        },
        {
            "id"   : "2699",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513330",
            "name" : "德格县"
        },
        {
            "id"   : "2700",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513331",
            "name" : "白玉县"
        },
        {
            "id"   : "2701",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513332",
            "name" : "石渠县"
        },
        {
            "id"   : "2702",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513333",
            "name" : "色达县"
        },
        {
            "id"   : "2703",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513334",
            "name" : "理塘县"
        },
        {
            "id"   : "2704",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513335",
            "name" : "巴塘县"
        },
        {
            "id"   : "2705",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513336",
            "name" : "乡城县"
        },
        {
            "id"   : "2706",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513337",
            "name" : "稻城县"
        },
        {
            "id"   : "2707",
            "pid"  : "2689",
            "type" : "2",
            "code" : "513338",
            "name" : "得荣县"
        },
        {
            "id"   : "2708",
            "pid"  : "2503",
            "type" : "1",
            "code" : "513400",
            "name" : "凉山彝族自治州"
        },
        {
            "id"   : "2709",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513401",
            "name" : "西昌市"
        },
        {
            "id"   : "2710",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513422",
            "name" : "木里藏族自治县"
        },
        {
            "id"   : "2711",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513423",
            "name" : "盐源县"
        },
        {
            "id"   : "2712",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513424",
            "name" : "德昌县"
        },
        {
            "id"   : "2713",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513425",
            "name" : "会理县"
        },
        {
            "id"   : "2714",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513426",
            "name" : "会东县"
        },
        {
            "id"   : "2715",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513427",
            "name" : "宁南县"
        },
        {
            "id"   : "2716",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513428",
            "name" : "普格县"
        },
        {
            "id"   : "2717",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513429",
            "name" : "布拖县"
        },
        {
            "id"   : "2718",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513430",
            "name" : "金阳县"
        },
        {
            "id"   : "2719",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513431",
            "name" : "昭觉县"
        },
        {
            "id"   : "2720",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513432",
            "name" : "喜德县"
        },
        {
            "id"   : "2721",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513433",
            "name" : "冕宁县"
        },
        {
            "id"   : "2722",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513434",
            "name" : "越西县"
        },
        {
            "id"   : "2723",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513435",
            "name" : "甘洛县"
        },
        {
            "id"   : "2724",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513436",
            "name" : "美姑县"
        },
        {
            "id"   : "2725",
            "pid"  : "2708",
            "type" : "2",
            "code" : "513437",
            "name" : "雷波县"
        },
        {
            "id"   : "2726",
            "pid"  : "0",
            "type" : "0",
            "code" : "520000",
            "name" : "贵州省"
        },
        {
            "id"   : "2727",
            "pid"  : "2726",
            "type" : "1",
            "code" : "520100",
            "name" : "贵阳市"
        },
        {
            "id"   : "2728",
            "pid"  : "2727",
            "type" : "2",
            "code" : "520101",
            "name" : "市辖区"
        },
        {
            "id"   : "2729",
            "pid"  : "2727",
            "type" : "2",
            "code" : "520102",
            "name" : "南明区"
        },
        {
            "id"   : "2730",
            "pid"  : "2727",
            "type" : "2",
            "code" : "520103",
            "name" : "云岩区"
        },
        {
            "id"   : "2731",
            "pid"  : "2727",
            "type" : "2",
            "code" : "520111",
            "name" : "花溪区"
        },
        {
            "id"   : "2732",
            "pid"  : "2727",
            "type" : "2",
            "code" : "520112",
            "name" : "乌当区"
        },
        {
            "id"   : "2733",
            "pid"  : "2727",
            "type" : "2",
            "code" : "520113",
            "name" : "白云区"
        },
        {
            "id"   : "2734",
            "pid"  : "2727",
            "type" : "2",
            "code" : "520115",
            "name" : "观山湖区"
        },
        {
            "id"   : "2735",
            "pid"  : "2727",
            "type" : "2",
            "code" : "520121",
            "name" : "开阳县"
        },
        {
            "id"   : "2736",
            "pid"  : "2727",
            "type" : "2",
            "code" : "520122",
            "name" : "息烽县"
        },
        {
            "id"   : "2737",
            "pid"  : "2727",
            "type" : "2",
            "code" : "520123",
            "name" : "修文县"
        },
        {
            "id"   : "2738",
            "pid"  : "2727",
            "type" : "2",
            "code" : "520181",
            "name" : "清镇市"
        },
        {
            "id"   : "2739",
            "pid"  : "2726",
            "type" : "1",
            "code" : "520200",
            "name" : "六盘水市"
        },
        {
            "id"   : "2740",
            "pid"  : "2739",
            "type" : "2",
            "code" : "520201",
            "name" : "钟山区"
        },
        {
            "id"   : "2741",
            "pid"  : "2739",
            "type" : "2",
            "code" : "520203",
            "name" : "六枝特区"
        },
        {
            "id"   : "2742",
            "pid"  : "2739",
            "type" : "2",
            "code" : "520221",
            "name" : "水城县"
        },
        {
            "id"   : "2743",
            "pid"  : "2739",
            "type" : "2",
            "code" : "520222",
            "name" : "盘县"
        },
        {
            "id"   : "2744",
            "pid"  : "2726",
            "type" : "1",
            "code" : "520300",
            "name" : "遵义市"
        },
        {
            "id"   : "2745",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520301",
            "name" : "市辖区"
        },
        {
            "id"   : "2746",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520302",
            "name" : "红花岗区"
        },
        {
            "id"   : "2747",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520303",
            "name" : "汇川区"
        },
        {
            "id"   : "2748",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520321",
            "name" : "遵义县"
        },
        {
            "id"   : "2749",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520322",
            "name" : "桐梓县"
        },
        {
            "id"   : "2750",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520323",
            "name" : "绥阳县"
        },
        {
            "id"   : "2751",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520324",
            "name" : "正安县"
        },
        {
            "id"   : "2752",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520325",
            "name" : "道真仡佬族苗族自治县"
        },
        {
            "id"   : "2753",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520326",
            "name" : "务川仡佬族苗族自治县"
        },
        {
            "id"   : "2754",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520327",
            "name" : "凤冈县"
        },
        {
            "id"   : "2755",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520328",
            "name" : "湄潭县"
        },
        {
            "id"   : "2756",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520329",
            "name" : "余庆县"
        },
        {
            "id"   : "2757",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520330",
            "name" : "习水县"
        },
        {
            "id"   : "2758",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520381",
            "name" : "赤水市"
        },
        {
            "id"   : "2759",
            "pid"  : "2744",
            "type" : "2",
            "code" : "520382",
            "name" : "仁怀市"
        },
        {
            "id"   : "2760",
            "pid"  : "2726",
            "type" : "1",
            "code" : "520400",
            "name" : "安顺市"
        },
        {
            "id"   : "2761",
            "pid"  : "2760",
            "type" : "2",
            "code" : "520401",
            "name" : "市辖区"
        },
        {
            "id"   : "2762",
            "pid"  : "2760",
            "type" : "2",
            "code" : "520402",
            "name" : "西秀区"
        },
        {
            "id"   : "2763",
            "pid"  : "2760",
            "type" : "2",
            "code" : "520421",
            "name" : "平坝县"
        },
        {
            "id"   : "2764",
            "pid"  : "2760",
            "type" : "2",
            "code" : "520422",
            "name" : "普定县"
        },
        {
            "id"   : "2765",
            "pid"  : "2760",
            "type" : "2",
            "code" : "520423",
            "name" : "镇宁布依族苗族自治县"
        },
        {
            "id"   : "2766",
            "pid"  : "2760",
            "type" : "2",
            "code" : "520424",
            "name" : "关岭布依族苗族自治县"
        },
        {
            "id"   : "2767",
            "pid"  : "2760",
            "type" : "2",
            "code" : "520425",
            "name" : "紫云苗族布依族自治县"
        },
        {
            "id"   : "2768",
            "pid"  : "2726",
            "type" : "1",
            "code" : "520500",
            "name" : "毕节市"
        },
        {
            "id"   : "2769",
            "pid"  : "2768",
            "type" : "2",
            "code" : "520501",
            "name" : "市辖区"
        },
        {
            "id"   : "2770",
            "pid"  : "2768",
            "type" : "2",
            "code" : "520502",
            "name" : "七星关区"
        },
        {
            "id"   : "2771",
            "pid"  : "2768",
            "type" : "2",
            "code" : "520521",
            "name" : "大方县"
        },
        {
            "id"   : "2772",
            "pid"  : "2768",
            "type" : "2",
            "code" : "520522",
            "name" : "黔西县"
        },
        {
            "id"   : "2773",
            "pid"  : "2768",
            "type" : "2",
            "code" : "520523",
            "name" : "金沙县"
        },
        {
            "id"   : "2774",
            "pid"  : "2768",
            "type" : "2",
            "code" : "520524",
            "name" : "织金县"
        },
        {
            "id"   : "2775",
            "pid"  : "2768",
            "type" : "2",
            "code" : "520525",
            "name" : "纳雍县"
        },
        {
            "id"   : "2776",
            "pid"  : "2768",
            "type" : "2",
            "code" : "520526",
            "name" : "威宁彝族回族苗族自治县"
        },
        {
            "id"   : "2777",
            "pid"  : "2768",
            "type" : "2",
            "code" : "520527",
            "name" : "赫章县"
        },
        {
            "id"   : "2778",
            "pid"  : "2726",
            "type" : "1",
            "code" : "520600",
            "name" : "铜仁市"
        },
        {
            "id"   : "2779",
            "pid"  : "2778",
            "type" : "2",
            "code" : "520601",
            "name" : "市辖区"
        },
        {
            "id"   : "2780",
            "pid"  : "2778",
            "type" : "2",
            "code" : "520602",
            "name" : "碧江区"
        },
        {
            "id"   : "2781",
            "pid"  : "2778",
            "type" : "2",
            "code" : "520603",
            "name" : "万山区"
        },
        {
            "id"   : "2782",
            "pid"  : "2778",
            "type" : "2",
            "code" : "520621",
            "name" : "江口县"
        },
        {
            "id"   : "2783",
            "pid"  : "2778",
            "type" : "2",
            "code" : "520622",
            "name" : "玉屏侗族自治县"
        },
        {
            "id"   : "2784",
            "pid"  : "2778",
            "type" : "2",
            "code" : "520623",
            "name" : "石阡县"
        },
        {
            "id"   : "2785",
            "pid"  : "2778",
            "type" : "2",
            "code" : "520624",
            "name" : "思南县"
        },
        {
            "id"   : "2786",
            "pid"  : "2778",
            "type" : "2",
            "code" : "520625",
            "name" : "印江土家族苗族自治县"
        },
        {
            "id"   : "2787",
            "pid"  : "2778",
            "type" : "2",
            "code" : "520626",
            "name" : "德江县"
        },
        {
            "id"   : "2788",
            "pid"  : "2778",
            "type" : "2",
            "code" : "520627",
            "name" : "沿河土家族自治县"
        },
        {
            "id"   : "2789",
            "pid"  : "2778",
            "type" : "2",
            "code" : "520628",
            "name" : "松桃苗族自治县"
        },
        {
            "id"   : "2790",
            "pid"  : "2726",
            "type" : "1",
            "code" : "522300",
            "name" : "黔西南布依族苗族自治州"
        },
        {
            "id"   : "2791",
            "pid"  : "2790",
            "type" : "2",
            "code" : "522301",
            "name" : "兴义市"
        },
        {
            "id"   : "2792",
            "pid"  : "2790",
            "type" : "2",
            "code" : "522322",
            "name" : "兴仁县"
        },
        {
            "id"   : "2793",
            "pid"  : "2790",
            "type" : "2",
            "code" : "522323",
            "name" : "普安县"
        },
        {
            "id"   : "2794",
            "pid"  : "2790",
            "type" : "2",
            "code" : "522324",
            "name" : "晴隆县"
        },
        {
            "id"   : "2795",
            "pid"  : "2790",
            "type" : "2",
            "code" : "522325",
            "name" : "贞丰县"
        },
        {
            "id"   : "2796",
            "pid"  : "2790",
            "type" : "2",
            "code" : "522326",
            "name" : "望谟县"
        },
        {
            "id"   : "2797",
            "pid"  : "2790",
            "type" : "2",
            "code" : "522327",
            "name" : "册亨县"
        },
        {
            "id"   : "2798",
            "pid"  : "2790",
            "type" : "2",
            "code" : "522328",
            "name" : "安龙县"
        },
        {
            "id"   : "2799",
            "pid"  : "2726",
            "type" : "1",
            "code" : "522600",
            "name" : "黔东南苗族侗族自治州"
        },
        {
            "id"   : "2800",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522601",
            "name" : "凯里市"
        },
        {
            "id"   : "2801",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522622",
            "name" : "黄平县"
        },
        {
            "id"   : "2802",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522623",
            "name" : "施秉县"
        },
        {
            "id"   : "2803",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522624",
            "name" : "三穗县"
        },
        {
            "id"   : "2804",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522625",
            "name" : "镇远县"
        },
        {
            "id"   : "2805",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522626",
            "name" : "岑巩县"
        },
        {
            "id"   : "2806",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522627",
            "name" : "天柱县"
        },
        {
            "id"   : "2807",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522628",
            "name" : "锦屏县"
        },
        {
            "id"   : "2808",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522629",
            "name" : "剑河县"
        },
        {
            "id"   : "2809",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522630",
            "name" : "台江县"
        },
        {
            "id"   : "2810",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522631",
            "name" : "黎平县"
        },
        {
            "id"   : "2811",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522632",
            "name" : "榕江县"
        },
        {
            "id"   : "2812",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522633",
            "name" : "从江县"
        },
        {
            "id"   : "2813",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522634",
            "name" : "雷山县"
        },
        {
            "id"   : "2814",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522635",
            "name" : "麻江县"
        },
        {
            "id"   : "2815",
            "pid"  : "2799",
            "type" : "2",
            "code" : "522636",
            "name" : "丹寨县"
        },
        {
            "id"   : "2816",
            "pid"  : "2726",
            "type" : "1",
            "code" : "522700",
            "name" : "黔南布依族苗族自治州"
        },
        {
            "id"   : "2817",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522701",
            "name" : "都匀市"
        },
        {
            "id"   : "2818",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522702",
            "name" : "福泉市"
        },
        {
            "id"   : "2819",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522722",
            "name" : "荔波县"
        },
        {
            "id"   : "2820",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522723",
            "name" : "贵定县"
        },
        {
            "id"   : "2821",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522725",
            "name" : "瓮安县"
        },
        {
            "id"   : "2822",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522726",
            "name" : "独山县"
        },
        {
            "id"   : "2823",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522727",
            "name" : "平塘县"
        },
        {
            "id"   : "2824",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522728",
            "name" : "罗甸县"
        },
        {
            "id"   : "2825",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522729",
            "name" : "长顺县"
        },
        {
            "id"   : "2826",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522730",
            "name" : "龙里县"
        },
        {
            "id"   : "2827",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522731",
            "name" : "惠水县"
        },
        {
            "id"   : "2828",
            "pid"  : "2816",
            "type" : "2",
            "code" : "522732",
            "name" : "三都水族自治县"
        },
        {
            "id"   : "2829",
            "pid"  : "0",
            "type" : "0",
            "code" : "530000",
            "name" : "云南省"
        },
        {
            "id"   : "2830",
            "pid"  : "2829",
            "type" : "1",
            "code" : "530100",
            "name" : "昆明市"
        },
        {
            "id"   : "2831",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530101",
            "name" : "市辖区"
        },
        {
            "id"   : "2832",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530102",
            "name" : "五华区"
        },
        {
            "id"   : "2833",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530103",
            "name" : "盘龙区"
        },
        {
            "id"   : "2834",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530111",
            "name" : "官渡区"
        },
        {
            "id"   : "2835",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530112",
            "name" : "西山区"
        },
        {
            "id"   : "2836",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530113",
            "name" : "东川区"
        },
        {
            "id"   : "2837",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530114",
            "name" : "呈贡区"
        },
        {
            "id"   : "2838",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530122",
            "name" : "晋宁县"
        },
        {
            "id"   : "2839",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530124",
            "name" : "富民县"
        },
        {
            "id"   : "2840",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530125",
            "name" : "宜良县"
        },
        {
            "id"   : "2841",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530126",
            "name" : "石林彝族自治县"
        },
        {
            "id"   : "2842",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530127",
            "name" : "嵩明县"
        },
        {
            "id"   : "2843",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530128",
            "name" : "禄劝彝族苗族自治县"
        },
        {
            "id"   : "2844",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530129",
            "name" : "寻甸回族彝族自治县"
        },
        {
            "id"   : "2845",
            "pid"  : "2830",
            "type" : "2",
            "code" : "530181",
            "name" : "安宁市"
        },
        {
            "id"   : "2846",
            "pid"  : "2829",
            "type" : "1",
            "code" : "530300",
            "name" : "曲靖市"
        },
        {
            "id"   : "2847",
            "pid"  : "2846",
            "type" : "2",
            "code" : "530301",
            "name" : "市辖区"
        },
        {
            "id"   : "2848",
            "pid"  : "2846",
            "type" : "2",
            "code" : "530302",
            "name" : "麒麟区"
        },
        {
            "id"   : "2849",
            "pid"  : "2846",
            "type" : "2",
            "code" : "530321",
            "name" : "马龙县"
        },
        {
            "id"   : "2850",
            "pid"  : "2846",
            "type" : "2",
            "code" : "530322",
            "name" : "陆良县"
        },
        {
            "id"   : "2851",
            "pid"  : "2846",
            "type" : "2",
            "code" : "530323",
            "name" : "师宗县"
        },
        {
            "id"   : "2852",
            "pid"  : "2846",
            "type" : "2",
            "code" : "530324",
            "name" : "罗平县"
        },
        {
            "id"   : "2853",
            "pid"  : "2846",
            "type" : "2",
            "code" : "530325",
            "name" : "富源县"
        },
        {
            "id"   : "2854",
            "pid"  : "2846",
            "type" : "2",
            "code" : "530326",
            "name" : "会泽县"
        },
        {
            "id"   : "2855",
            "pid"  : "2846",
            "type" : "2",
            "code" : "530328",
            "name" : "沾益县"
        },
        {
            "id"   : "2856",
            "pid"  : "2846",
            "type" : "2",
            "code" : "530381",
            "name" : "宣威市"
        },
        {
            "id"   : "2857",
            "pid"  : "2829",
            "type" : "1",
            "code" : "530400",
            "name" : "玉溪市"
        },
        {
            "id"   : "2858",
            "pid"  : "2857",
            "type" : "2",
            "code" : "530401",
            "name" : "市辖区"
        },
        {
            "id"   : "2859",
            "pid"  : "2857",
            "type" : "2",
            "code" : "530402",
            "name" : "红塔区"
        },
        {
            "id"   : "2860",
            "pid"  : "2857",
            "type" : "2",
            "code" : "530421",
            "name" : "江川县"
        },
        {
            "id"   : "2861",
            "pid"  : "2857",
            "type" : "2",
            "code" : "530422",
            "name" : "澄江县"
        },
        {
            "id"   : "2862",
            "pid"  : "2857",
            "type" : "2",
            "code" : "530423",
            "name" : "通海县"
        },
        {
            "id"   : "2863",
            "pid"  : "2857",
            "type" : "2",
            "code" : "530424",
            "name" : "华宁县"
        },
        {
            "id"   : "2864",
            "pid"  : "2857",
            "type" : "2",
            "code" : "530425",
            "name" : "易门县"
        },
        {
            "id"   : "2865",
            "pid"  : "2857",
            "type" : "2",
            "code" : "530426",
            "name" : "峨山彝族自治县"
        },
        {
            "id"   : "2866",
            "pid"  : "2857",
            "type" : "2",
            "code" : "530427",
            "name" : "新平彝族傣族自治县"
        },
        {
            "id"   : "2867",
            "pid"  : "2857",
            "type" : "2",
            "code" : "530428",
            "name" : "元江哈尼族彝族傣族自治县"
        },
        {
            "id"   : "2868",
            "pid"  : "2829",
            "type" : "1",
            "code" : "530500",
            "name" : "保山市"
        },
        {
            "id"   : "2869",
            "pid"  : "2868",
            "type" : "2",
            "code" : "530501",
            "name" : "市辖区"
        },
        {
            "id"   : "2870",
            "pid"  : "2868",
            "type" : "2",
            "code" : "530502",
            "name" : "隆阳区"
        },
        {
            "id"   : "2871",
            "pid"  : "2868",
            "type" : "2",
            "code" : "530521",
            "name" : "施甸县"
        },
        {
            "id"   : "2872",
            "pid"  : "2868",
            "type" : "2",
            "code" : "530522",
            "name" : "腾冲县"
        },
        {
            "id"   : "2873",
            "pid"  : "2868",
            "type" : "2",
            "code" : "530523",
            "name" : "龙陵县"
        },
        {
            "id"   : "2874",
            "pid"  : "2868",
            "type" : "2",
            "code" : "530524",
            "name" : "昌宁县"
        },
        {
            "id"   : "2875",
            "pid"  : "2829",
            "type" : "1",
            "code" : "530600",
            "name" : "昭通市"
        },
        {
            "id"   : "2876",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530601",
            "name" : "市辖区"
        },
        {
            "id"   : "2877",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530602",
            "name" : "昭阳区"
        },
        {
            "id"   : "2878",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530621",
            "name" : "鲁甸县"
        },
        {
            "id"   : "2879",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530622",
            "name" : "巧家县"
        },
        {
            "id"   : "2880",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530623",
            "name" : "盐津县"
        },
        {
            "id"   : "2881",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530624",
            "name" : "大关县"
        },
        {
            "id"   : "2882",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530625",
            "name" : "永善县"
        },
        {
            "id"   : "2883",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530626",
            "name" : "绥江县"
        },
        {
            "id"   : "2884",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530627",
            "name" : "镇雄县"
        },
        {
            "id"   : "2885",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530628",
            "name" : "彝良县"
        },
        {
            "id"   : "2886",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530629",
            "name" : "威信县"
        },
        {
            "id"   : "2887",
            "pid"  : "2875",
            "type" : "2",
            "code" : "530630",
            "name" : "水富县"
        },
        {
            "id"   : "2888",
            "pid"  : "2829",
            "type" : "1",
            "code" : "530700",
            "name" : "丽江市"
        },
        {
            "id"   : "2889",
            "pid"  : "2888",
            "type" : "2",
            "code" : "530701",
            "name" : "市辖区"
        },
        {
            "id"   : "2890",
            "pid"  : "2888",
            "type" : "2",
            "code" : "530702",
            "name" : "古城区"
        },
        {
            "id"   : "2891",
            "pid"  : "2888",
            "type" : "2",
            "code" : "530721",
            "name" : "玉龙纳西族自治县"
        },
        {
            "id"   : "2892",
            "pid"  : "2888",
            "type" : "2",
            "code" : "530722",
            "name" : "永胜县"
        },
        {
            "id"   : "2893",
            "pid"  : "2888",
            "type" : "2",
            "code" : "530723",
            "name" : "华坪县"
        },
        {
            "id"   : "2894",
            "pid"  : "2888",
            "type" : "2",
            "code" : "530724",
            "name" : "宁蒗彝族自治县"
        },
        {
            "id"   : "2895",
            "pid"  : "2829",
            "type" : "1",
            "code" : "530800",
            "name" : "普洱市"
        },
        {
            "id"   : "2896",
            "pid"  : "2895",
            "type" : "2",
            "code" : "530801",
            "name" : "市辖区"
        },
        {
            "id"   : "2897",
            "pid"  : "2895",
            "type" : "2",
            "code" : "530802",
            "name" : "思茅区"
        },
        {
            "id"   : "2898",
            "pid"  : "2895",
            "type" : "2",
            "code" : "530821",
            "name" : "宁洱哈尼族彝族自治县"
        },
        {
            "id"   : "2899",
            "pid"  : "2895",
            "type" : "2",
            "code" : "530822",
            "name" : "墨江哈尼族自治县"
        },
        {
            "id"   : "2900",
            "pid"  : "2895",
            "type" : "2",
            "code" : "530823",
            "name" : "景东彝族自治县"
        },
        {
            "id"   : "2901",
            "pid"  : "2895",
            "type" : "2",
            "code" : "530824",
            "name" : "景谷傣族彝族自治县"
        },
        {
            "id"   : "2902",
            "pid"  : "2895",
            "type" : "2",
            "code" : "530825",
            "name" : "镇沅彝族哈尼族拉祜族自治县"
        },
        {
            "id"   : "2903",
            "pid"  : "2895",
            "type" : "2",
            "code" : "530826",
            "name" : "江城哈尼族彝族自治县"
        },
        {
            "id"   : "2904",
            "pid"  : "2895",
            "type" : "2",
            "code" : "530827",
            "name" : "孟连傣族拉祜族佤族自治县"
        },
        {
            "id"   : "2905",
            "pid"  : "2895",
            "type" : "2",
            "code" : "530828",
            "name" : "澜沧拉祜族自治县"
        },
        {
            "id"   : "2906",
            "pid"  : "2895",
            "type" : "2",
            "code" : "530829",
            "name" : "西盟佤族自治县"
        },
        {
            "id"   : "2907",
            "pid"  : "2829",
            "type" : "1",
            "code" : "530900",
            "name" : "临沧市"
        },
        {
            "id"   : "2908",
            "pid"  : "2907",
            "type" : "2",
            "code" : "530901",
            "name" : "市辖区"
        },
        {
            "id"   : "2909",
            "pid"  : "2907",
            "type" : "2",
            "code" : "530902",
            "name" : "临翔区"
        },
        {
            "id"   : "2910",
            "pid"  : "2907",
            "type" : "2",
            "code" : "530921",
            "name" : "凤庆县"
        },
        {
            "id"   : "2911",
            "pid"  : "2907",
            "type" : "2",
            "code" : "530922",
            "name" : "云县"
        },
        {
            "id"   : "2912",
            "pid"  : "2907",
            "type" : "2",
            "code" : "530923",
            "name" : "永德县"
        },
        {
            "id"   : "2913",
            "pid"  : "2907",
            "type" : "2",
            "code" : "530924",
            "name" : "镇康县"
        },
        {
            "id"   : "2914",
            "pid"  : "2907",
            "type" : "2",
            "code" : "530925",
            "name" : "双江拉祜族佤族布朗族傣族自治县"
        },
        {
            "id"   : "2915",
            "pid"  : "2907",
            "type" : "2",
            "code" : "530926",
            "name" : "耿马傣族佤族自治县"
        },
        {
            "id"   : "2916",
            "pid"  : "2907",
            "type" : "2",
            "code" : "530927",
            "name" : "沧源佤族自治县"
        },
        {
            "id"   : "2917",
            "pid"  : "2829",
            "type" : "1",
            "code" : "532300",
            "name" : "楚雄彝族自治州"
        },
        {
            "id"   : "2918",
            "pid"  : "2917",
            "type" : "2",
            "code" : "532301",
            "name" : "楚雄市"
        },
        {
            "id"   : "2919",
            "pid"  : "2917",
            "type" : "2",
            "code" : "532322",
            "name" : "双柏县"
        },
        {
            "id"   : "2920",
            "pid"  : "2917",
            "type" : "2",
            "code" : "532323",
            "name" : "牟定县"
        },
        {
            "id"   : "2921",
            "pid"  : "2917",
            "type" : "2",
            "code" : "532324",
            "name" : "南华县"
        },
        {
            "id"   : "2922",
            "pid"  : "2917",
            "type" : "2",
            "code" : "532325",
            "name" : "姚安县"
        },
        {
            "id"   : "2923",
            "pid"  : "2917",
            "type" : "2",
            "code" : "532326",
            "name" : "大姚县"
        },
        {
            "id"   : "2924",
            "pid"  : "2917",
            "type" : "2",
            "code" : "532327",
            "name" : "永仁县"
        },
        {
            "id"   : "2925",
            "pid"  : "2917",
            "type" : "2",
            "code" : "532328",
            "name" : "元谋县"
        },
        {
            "id"   : "2926",
            "pid"  : "2917",
            "type" : "2",
            "code" : "532329",
            "name" : "武定县"
        },
        {
            "id"   : "2927",
            "pid"  : "2917",
            "type" : "2",
            "code" : "532331",
            "name" : "禄丰县"
        },
        {
            "id"   : "2928",
            "pid"  : "2829",
            "type" : "1",
            "code" : "532500",
            "name" : "红河哈尼族彝族自治州"
        },
        {
            "id"   : "2929",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532501",
            "name" : "个旧市"
        },
        {
            "id"   : "2930",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532502",
            "name" : "开远市"
        },
        {
            "id"   : "2931",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532503",
            "name" : "蒙自市"
        },
        {
            "id"   : "2932",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532504",
            "name" : "弥勒市"
        },
        {
            "id"   : "2933",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532523",
            "name" : "屏边苗族自治县"
        },
        {
            "id"   : "2934",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532524",
            "name" : "建水县"
        },
        {
            "id"   : "2935",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532525",
            "name" : "石屏县"
        },
        {
            "id"   : "2936",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532527",
            "name" : "泸西县"
        },
        {
            "id"   : "2937",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532528",
            "name" : "元阳县"
        },
        {
            "id"   : "2938",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532529",
            "name" : "红河县"
        },
        {
            "id"   : "2939",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532530",
            "name" : "金平苗族瑶族傣族自治县"
        },
        {
            "id"   : "2940",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532531",
            "name" : "绿春县"
        },
        {
            "id"   : "2941",
            "pid"  : "2928",
            "type" : "2",
            "code" : "532532",
            "name" : "河口瑶族自治县"
        },
        {
            "id"   : "2942",
            "pid"  : "2829",
            "type" : "1",
            "code" : "532600",
            "name" : "文山壮族苗族自治州"
        },
        {
            "id"   : "2943",
            "pid"  : "2942",
            "type" : "2",
            "code" : "532601",
            "name" : "文山市"
        },
        {
            "id"   : "2944",
            "pid"  : "2942",
            "type" : "2",
            "code" : "532622",
            "name" : "砚山县"
        },
        {
            "id"   : "2945",
            "pid"  : "2942",
            "type" : "2",
            "code" : "532623",
            "name" : "西畴县"
        },
        {
            "id"   : "2946",
            "pid"  : "2942",
            "type" : "2",
            "code" : "532624",
            "name" : "麻栗坡县"
        },
        {
            "id"   : "2947",
            "pid"  : "2942",
            "type" : "2",
            "code" : "532625",
            "name" : "马关县"
        },
        {
            "id"   : "2948",
            "pid"  : "2942",
            "type" : "2",
            "code" : "532626",
            "name" : "丘北县"
        },
        {
            "id"   : "2949",
            "pid"  : "2942",
            "type" : "2",
            "code" : "532627",
            "name" : "广南县"
        },
        {
            "id"   : "2950",
            "pid"  : "2942",
            "type" : "2",
            "code" : "532628",
            "name" : "富宁县"
        },
        {
            "id"   : "2951",
            "pid"  : "2829",
            "type" : "1",
            "code" : "532800",
            "name" : "西双版纳傣族自治州"
        },
        {
            "id"   : "2952",
            "pid"  : "2951",
            "type" : "2",
            "code" : "532801",
            "name" : "景洪市"
        },
        {
            "id"   : "2953",
            "pid"  : "2951",
            "type" : "2",
            "code" : "532822",
            "name" : "勐海县"
        },
        {
            "id"   : "2954",
            "pid"  : "2951",
            "type" : "2",
            "code" : "532823",
            "name" : "勐腊县"
        },
        {
            "id"   : "2955",
            "pid"  : "2829",
            "type" : "1",
            "code" : "532900",
            "name" : "大理白族自治州"
        },
        {
            "id"   : "2956",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532901",
            "name" : "大理市"
        },
        {
            "id"   : "2957",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532922",
            "name" : "漾濞彝族自治县"
        },
        {
            "id"   : "2958",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532923",
            "name" : "祥云县"
        },
        {
            "id"   : "2959",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532924",
            "name" : "宾川县"
        },
        {
            "id"   : "2960",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532925",
            "name" : "弥渡县"
        },
        {
            "id"   : "2961",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532926",
            "name" : "南涧彝族自治县"
        },
        {
            "id"   : "2962",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532927",
            "name" : "巍山彝族回族自治县"
        },
        {
            "id"   : "2963",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532928",
            "name" : "永平县"
        },
        {
            "id"   : "2964",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532929",
            "name" : "云龙县"
        },
        {
            "id"   : "2965",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532930",
            "name" : "洱源县"
        },
        {
            "id"   : "2966",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532931",
            "name" : "剑川县"
        },
        {
            "id"   : "2967",
            "pid"  : "2955",
            "type" : "2",
            "code" : "532932",
            "name" : "鹤庆县"
        },
        {
            "id"   : "2968",
            "pid"  : "2829",
            "type" : "1",
            "code" : "533100",
            "name" : "德宏傣族景颇族自治州"
        },
        {
            "id"   : "2969",
            "pid"  : "2968",
            "type" : "2",
            "code" : "533102",
            "name" : "瑞丽市"
        },
        {
            "id"   : "2970",
            "pid"  : "2968",
            "type" : "2",
            "code" : "533103",
            "name" : "芒市"
        },
        {
            "id"   : "2971",
            "pid"  : "2968",
            "type" : "2",
            "code" : "533122",
            "name" : "梁河县"
        },
        {
            "id"   : "2972",
            "pid"  : "2968",
            "type" : "2",
            "code" : "533123",
            "name" : "盈江县"
        },
        {
            "id"   : "2973",
            "pid"  : "2968",
            "type" : "2",
            "code" : "533124",
            "name" : "陇川县"
        },
        {
            "id"   : "2974",
            "pid"  : "2829",
            "type" : "1",
            "code" : "533300",
            "name" : "怒江傈僳族自治州"
        },
        {
            "id"   : "2975",
            "pid"  : "2974",
            "type" : "2",
            "code" : "533321",
            "name" : "泸水县"
        },
        {
            "id"   : "2976",
            "pid"  : "2974",
            "type" : "2",
            "code" : "533323",
            "name" : "福贡县"
        },
        {
            "id"   : "2977",
            "pid"  : "2974",
            "type" : "2",
            "code" : "533324",
            "name" : "贡山独龙族怒族自治县"
        },
        {
            "id"   : "2978",
            "pid"  : "2974",
            "type" : "2",
            "code" : "533325",
            "name" : "兰坪白族普米族自治县"
        },
        {
            "id"   : "2979",
            "pid"  : "2829",
            "type" : "1",
            "code" : "533400",
            "name" : "迪庆藏族自治州"
        },
        {
            "id"   : "2980",
            "pid"  : "2979",
            "type" : "2",
            "code" : "533421",
            "name" : "香格里拉县"
        },
        {
            "id"   : "2981",
            "pid"  : "2979",
            "type" : "2",
            "code" : "533422",
            "name" : "德钦县"
        },
        {
            "id"   : "2982",
            "pid"  : "2979",
            "type" : "2",
            "code" : "533423",
            "name" : "维西傈僳族自治县"
        },
        {
            "id"   : "2983",
            "pid"  : "0",
            "type" : "0",
            "code" : "540000",
            "name" : "西藏自治区"
        },
        {
            "id"   : "2984",
            "pid"  : "2983",
            "type" : "1",
            "code" : "540100",
            "name" : "拉萨市"
        },
        {
            "id"   : "2985",
            "pid"  : "2984",
            "type" : "2",
            "code" : "540101",
            "name" : "市辖区"
        },
        {
            "id"   : "2986",
            "pid"  : "2984",
            "type" : "2",
            "code" : "540102",
            "name" : "城关区"
        },
        {
            "id"   : "2987",
            "pid"  : "2984",
            "type" : "2",
            "code" : "540121",
            "name" : "林周县"
        },
        {
            "id"   : "2988",
            "pid"  : "2984",
            "type" : "2",
            "code" : "540122",
            "name" : "当雄县"
        },
        {
            "id"   : "2989",
            "pid"  : "2984",
            "type" : "2",
            "code" : "540123",
            "name" : "尼木县"
        },
        {
            "id"   : "2990",
            "pid"  : "2984",
            "type" : "2",
            "code" : "540124",
            "name" : "曲水县"
        },
        {
            "id"   : "2991",
            "pid"  : "2984",
            "type" : "2",
            "code" : "540125",
            "name" : "堆龙德庆县"
        },
        {
            "id"   : "2992",
            "pid"  : "2984",
            "type" : "2",
            "code" : "540126",
            "name" : "达孜县"
        },
        {
            "id"   : "2993",
            "pid"  : "2984",
            "type" : "2",
            "code" : "540127",
            "name" : "墨竹工卡县"
        },
        {
            "id"   : "2994",
            "pid"  : "2983",
            "type" : "1",
            "code" : "540200",
            "name" : "日喀则市"
        },
        {
            "id"   : "2995",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540202",
            "name" : "桑珠孜区"
        },
        {
            "id"   : "2996",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540221",
            "name" : "南木林县"
        },
        {
            "id"   : "2997",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540222",
            "name" : "江孜县"
        },
        {
            "id"   : "2998",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540223",
            "name" : "定日县"
        },
        {
            "id"   : "2999",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540224",
            "name" : "萨迦县"
        },
        {
            "id"   : "3000",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540225",
            "name" : "拉孜县"
        },
        {
            "id"   : "3001",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540226",
            "name" : "昂仁县"
        },
        {
            "id"   : "3002",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540227",
            "name" : "谢通门县"
        },
        {
            "id"   : "3003",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540228",
            "name" : "白朗县"
        },
        {
            "id"   : "3004",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540229",
            "name" : "仁布县"
        },
        {
            "id"   : "3005",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540230",
            "name" : "康马县"
        },
        {
            "id"   : "3006",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540231",
            "name" : "定结县"
        },
        {
            "id"   : "3007",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540232",
            "name" : "仲巴县"
        },
        {
            "id"   : "3008",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540233",
            "name" : "亚东县"
        },
        {
            "id"   : "3009",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540234",
            "name" : "吉隆县"
        },
        {
            "id"   : "3010",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540235",
            "name" : "聂拉木县"
        },
        {
            "id"   : "3011",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540236",
            "name" : "萨嘎县"
        },
        {
            "id"   : "3012",
            "pid"  : "2994",
            "type" : "2",
            "code" : "540237",
            "name" : "岗巴县"
        },
        {
            "id"   : "3013",
            "pid"  : "2983",
            "type" : "1",
            "code" : "542100",
            "name" : "昌都地区"
        },
        {
            "id"   : "3014",
            "pid"  : "3013",
            "type" : "2",
            "code" : "542121",
            "name" : "昌都县"
        },
        {
            "id"   : "3015",
            "pid"  : "3013",
            "type" : "2",
            "code" : "542122",
            "name" : "江达县"
        },
        {
            "id"   : "3016",
            "pid"  : "3013",
            "type" : "2",
            "code" : "542123",
            "name" : "贡觉县"
        },
        {
            "id"   : "3017",
            "pid"  : "3013",
            "type" : "2",
            "code" : "542124",
            "name" : "类乌齐县"
        },
        {
            "id"   : "3018",
            "pid"  : "3013",
            "type" : "2",
            "code" : "542125",
            "name" : "丁青县"
        },
        {
            "id"   : "3019",
            "pid"  : "3013",
            "type" : "2",
            "code" : "542126",
            "name" : "察雅县"
        },
        {
            "id"   : "3020",
            "pid"  : "3013",
            "type" : "2",
            "code" : "542127",
            "name" : "八宿县"
        },
        {
            "id"   : "3021",
            "pid"  : "3013",
            "type" : "2",
            "code" : "542128",
            "name" : "左贡县"
        },
        {
            "id"   : "3022",
            "pid"  : "3013",
            "type" : "2",
            "code" : "542129",
            "name" : "芒康县"
        },
        {
            "id"   : "3023",
            "pid"  : "3013",
            "type" : "2",
            "code" : "542132",
            "name" : "洛隆县"
        },
        {
            "id"   : "3024",
            "pid"  : "3013",
            "type" : "2",
            "code" : "542133",
            "name" : "边坝县"
        },
        {
            "id"   : "3025",
            "pid"  : "2983",
            "type" : "1",
            "code" : "542200",
            "name" : "山南地区"
        },
        {
            "id"   : "3026",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542221",
            "name" : "乃东县"
        },
        {
            "id"   : "3027",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542222",
            "name" : "扎囊县"
        },
        {
            "id"   : "3028",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542223",
            "name" : "贡嘎县"
        },
        {
            "id"   : "3029",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542224",
            "name" : "桑日县"
        },
        {
            "id"   : "3030",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542225",
            "name" : "琼结县"
        },
        {
            "id"   : "3031",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542226",
            "name" : "曲松县"
        },
        {
            "id"   : "3032",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542227",
            "name" : "措美县"
        },
        {
            "id"   : "3033",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542228",
            "name" : "洛扎县"
        },
        {
            "id"   : "3034",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542229",
            "name" : "加查县"
        },
        {
            "id"   : "3035",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542231",
            "name" : "隆子县"
        },
        {
            "id"   : "3036",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542232",
            "name" : "错那县"
        },
        {
            "id"   : "3037",
            "pid"  : "3025",
            "type" : "2",
            "code" : "542233",
            "name" : "浪卡子县"
        },
        {
            "id"   : "3038",
            "pid"  : "2983",
            "type" : "1",
            "code" : "542400",
            "name" : "那曲地区"
        },
        {
            "id"   : "3039",
            "pid"  : "3038",
            "type" : "2",
            "code" : "542421",
            "name" : "那曲县"
        },
        {
            "id"   : "3040",
            "pid"  : "3038",
            "type" : "2",
            "code" : "542422",
            "name" : "嘉黎县"
        },
        {
            "id"   : "3041",
            "pid"  : "3038",
            "type" : "2",
            "code" : "542423",
            "name" : "比如县"
        },
        {
            "id"   : "3042",
            "pid"  : "3038",
            "type" : "2",
            "code" : "542424",
            "name" : "聂荣县"
        },
        {
            "id"   : "3043",
            "pid"  : "3038",
            "type" : "2",
            "code" : "542425",
            "name" : "安多县"
        },
        {
            "id"   : "3044",
            "pid"  : "3038",
            "type" : "2",
            "code" : "542426",
            "name" : "申扎县"
        },
        {
            "id"   : "3045",
            "pid"  : "3038",
            "type" : "2",
            "code" : "542427",
            "name" : "索县"
        },
        {
            "id"   : "3046",
            "pid"  : "3038",
            "type" : "2",
            "code" : "542428",
            "name" : "班戈县"
        },
        {
            "id"   : "3047",
            "pid"  : "3038",
            "type" : "2",
            "code" : "542429",
            "name" : "巴青县"
        },
        {
            "id"   : "3048",
            "pid"  : "3038",
            "type" : "2",
            "code" : "542430",
            "name" : "尼玛县"
        },
        {
            "id"   : "3049",
            "pid"  : "3038",
            "type" : "2",
            "code" : "542431",
            "name" : "双湖县"
        },
        {
            "id"   : "3050",
            "pid"  : "2983",
            "type" : "1",
            "code" : "542500",
            "name" : "阿里地区"
        },
        {
            "id"   : "3051",
            "pid"  : "3050",
            "type" : "2",
            "code" : "542521",
            "name" : "普兰县"
        },
        {
            "id"   : "3052",
            "pid"  : "3050",
            "type" : "2",
            "code" : "542522",
            "name" : "札达县"
        },
        {
            "id"   : "3053",
            "pid"  : "3050",
            "type" : "2",
            "code" : "542523",
            "name" : "噶尔县"
        },
        {
            "id"   : "3054",
            "pid"  : "3050",
            "type" : "2",
            "code" : "542524",
            "name" : "日土县"
        },
        {
            "id"   : "3055",
            "pid"  : "3050",
            "type" : "2",
            "code" : "542525",
            "name" : "革吉县"
        },
        {
            "id"   : "3056",
            "pid"  : "3050",
            "type" : "2",
            "code" : "542526",
            "name" : "改则县"
        },
        {
            "id"   : "3057",
            "pid"  : "3050",
            "type" : "2",
            "code" : "542527",
            "name" : "措勤县"
        },
        {
            "id"   : "3058",
            "pid"  : "2983",
            "type" : "1",
            "code" : "542600",
            "name" : "林芝地区"
        },
        {
            "id"   : "3059",
            "pid"  : "3058",
            "type" : "2",
            "code" : "542621",
            "name" : "林芝县"
        },
        {
            "id"   : "3060",
            "pid"  : "3058",
            "type" : "2",
            "code" : "542622",
            "name" : "工布江达县"
        },
        {
            "id"   : "3061",
            "pid"  : "3058",
            "type" : "2",
            "code" : "542623",
            "name" : "米林县"
        },
        {
            "id"   : "3062",
            "pid"  : "3058",
            "type" : "2",
            "code" : "542624",
            "name" : "墨脱县"
        },
        {
            "id"   : "3063",
            "pid"  : "3058",
            "type" : "2",
            "code" : "542625",
            "name" : "波密县"
        },
        {
            "id"   : "3064",
            "pid"  : "3058",
            "type" : "2",
            "code" : "542626",
            "name" : "察隅县"
        },
        {
            "id"   : "3065",
            "pid"  : "3058",
            "type" : "2",
            "code" : "542627",
            "name" : "朗县"
        },
        {
            "id"   : "3066",
            "pid"  : "0",
            "type" : "0",
            "code" : "610000",
            "name" : "陕西省"
        },
        {
            "id"   : "3067",
            "pid"  : "3066",
            "type" : "1",
            "code" : "610100",
            "name" : "西安市"
        },
        {
            "id"   : "3068",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610101",
            "name" : "市辖区"
        },
        {
            "id"   : "3069",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610102",
            "name" : "新城区"
        },
        {
            "id"   : "3070",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610103",
            "name" : "碑林区"
        },
        {
            "id"   : "3071",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610104",
            "name" : "莲湖区"
        },
        {
            "id"   : "3072",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610111",
            "name" : "灞桥区"
        },
        {
            "id"   : "3073",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610112",
            "name" : "未央区"
        },
        {
            "id"   : "3074",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610113",
            "name" : "雁塔区"
        },
        {
            "id"   : "3075",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610114",
            "name" : "阎良区"
        },
        {
            "id"   : "3076",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610115",
            "name" : "临潼区"
        },
        {
            "id"   : "3077",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610116",
            "name" : "长安区"
        },
        {
            "id"   : "3078",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610122",
            "name" : "蓝田县"
        },
        {
            "id"   : "3079",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610124",
            "name" : "周至县"
        },
        {
            "id"   : "3080",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610125",
            "name" : "户县"
        },
        {
            "id"   : "3081",
            "pid"  : "3067",
            "type" : "2",
            "code" : "610126",
            "name" : "高陵县"
        },
        {
            "id"   : "3082",
            "pid"  : "3066",
            "type" : "1",
            "code" : "610200",
            "name" : "铜川市"
        },
        {
            "id"   : "3083",
            "pid"  : "3082",
            "type" : "2",
            "code" : "610201",
            "name" : "市辖区"
        },
        {
            "id"   : "3084",
            "pid"  : "3082",
            "type" : "2",
            "code" : "610202",
            "name" : "王益区"
        },
        {
            "id"   : "3085",
            "pid"  : "3082",
            "type" : "2",
            "code" : "610203",
            "name" : "印台区"
        },
        {
            "id"   : "3086",
            "pid"  : "3082",
            "type" : "2",
            "code" : "610204",
            "name" : "耀州区"
        },
        {
            "id"   : "3087",
            "pid"  : "3082",
            "type" : "2",
            "code" : "610222",
            "name" : "宜君县"
        },
        {
            "id"   : "3088",
            "pid"  : "3066",
            "type" : "1",
            "code" : "610300",
            "name" : "宝鸡市"
        },
        {
            "id"   : "3089",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610301",
            "name" : "市辖区"
        },
        {
            "id"   : "3090",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610302",
            "name" : "渭滨区"
        },
        {
            "id"   : "3091",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610303",
            "name" : "金台区"
        },
        {
            "id"   : "3092",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610304",
            "name" : "陈仓区"
        },
        {
            "id"   : "3093",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610322",
            "name" : "凤翔县"
        },
        {
            "id"   : "3094",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610323",
            "name" : "岐山县"
        },
        {
            "id"   : "3095",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610324",
            "name" : "扶风县"
        },
        {
            "id"   : "3096",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610326",
            "name" : "眉县"
        },
        {
            "id"   : "3097",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610327",
            "name" : "陇县"
        },
        {
            "id"   : "3098",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610328",
            "name" : "千阳县"
        },
        {
            "id"   : "3099",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610329",
            "name" : "麟游县"
        },
        {
            "id"   : "3100",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610330",
            "name" : "凤县"
        },
        {
            "id"   : "3101",
            "pid"  : "3088",
            "type" : "2",
            "code" : "610331",
            "name" : "太白县"
        },
        {
            "id"   : "3102",
            "pid"  : "3066",
            "type" : "1",
            "code" : "610400",
            "name" : "咸阳市"
        },
        {
            "id"   : "3103",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610401",
            "name" : "市辖区"
        },
        {
            "id"   : "3104",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610402",
            "name" : "秦都区"
        },
        {
            "id"   : "3105",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610403",
            "name" : "杨陵区"
        },
        {
            "id"   : "3106",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610404",
            "name" : "渭城区"
        },
        {
            "id"   : "3107",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610422",
            "name" : "三原县"
        },
        {
            "id"   : "3108",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610423",
            "name" : "泾阳县"
        },
        {
            "id"   : "3109",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610424",
            "name" : "乾县"
        },
        {
            "id"   : "3110",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610425",
            "name" : "礼泉县"
        },
        {
            "id"   : "3111",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610426",
            "name" : "永寿县"
        },
        {
            "id"   : "3112",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610427",
            "name" : "彬县"
        },
        {
            "id"   : "3113",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610428",
            "name" : "长武县"
        },
        {
            "id"   : "3114",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610429",
            "name" : "旬邑县"
        },
        {
            "id"   : "3115",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610430",
            "name" : "淳化县"
        },
        {
            "id"   : "3116",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610431",
            "name" : "武功县"
        },
        {
            "id"   : "3117",
            "pid"  : "3102",
            "type" : "2",
            "code" : "610481",
            "name" : "兴平市"
        },
        {
            "id"   : "3118",
            "pid"  : "3066",
            "type" : "1",
            "code" : "610500",
            "name" : "渭南市"
        },
        {
            "id"   : "3119",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610501",
            "name" : "市辖区"
        },
        {
            "id"   : "3120",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610502",
            "name" : "临渭区"
        },
        {
            "id"   : "3121",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610521",
            "name" : "华县"
        },
        {
            "id"   : "3122",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610522",
            "name" : "潼关县"
        },
        {
            "id"   : "3123",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610523",
            "name" : "大荔县"
        },
        {
            "id"   : "3124",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610524",
            "name" : "合阳县"
        },
        {
            "id"   : "3125",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610525",
            "name" : "澄城县"
        },
        {
            "id"   : "3126",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610526",
            "name" : "蒲城县"
        },
        {
            "id"   : "3127",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610527",
            "name" : "白水县"
        },
        {
            "id"   : "3128",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610528",
            "name" : "富平县"
        },
        {
            "id"   : "3129",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610581",
            "name" : "韩城市"
        },
        {
            "id"   : "3130",
            "pid"  : "3118",
            "type" : "2",
            "code" : "610582",
            "name" : "华阴市"
        },
        {
            "id"   : "3131",
            "pid"  : "3066",
            "type" : "1",
            "code" : "610600",
            "name" : "延安市"
        },
        {
            "id"   : "3132",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610601",
            "name" : "市辖区"
        },
        {
            "id"   : "3133",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610602",
            "name" : "宝塔区"
        },
        {
            "id"   : "3134",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610621",
            "name" : "延长县"
        },
        {
            "id"   : "3135",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610622",
            "name" : "延川县"
        },
        {
            "id"   : "3136",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610623",
            "name" : "子长县"
        },
        {
            "id"   : "3137",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610624",
            "name" : "安塞县"
        },
        {
            "id"   : "3138",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610625",
            "name" : "志丹县"
        },
        {
            "id"   : "3139",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610626",
            "name" : "吴起县"
        },
        {
            "id"   : "3140",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610627",
            "name" : "甘泉县"
        },
        {
            "id"   : "3141",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610628",
            "name" : "富县"
        },
        {
            "id"   : "3142",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610629",
            "name" : "洛川县"
        },
        {
            "id"   : "3143",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610630",
            "name" : "宜川县"
        },
        {
            "id"   : "3144",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610631",
            "name" : "黄龙县"
        },
        {
            "id"   : "3145",
            "pid"  : "3131",
            "type" : "2",
            "code" : "610632",
            "name" : "黄陵县"
        },
        {
            "id"   : "3146",
            "pid"  : "3066",
            "type" : "1",
            "code" : "610700",
            "name" : "汉中市"
        },
        {
            "id"   : "3147",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610701",
            "name" : "市辖区"
        },
        {
            "id"   : "3148",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610702",
            "name" : "汉台区"
        },
        {
            "id"   : "3149",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610721",
            "name" : "南郑县"
        },
        {
            "id"   : "3150",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610722",
            "name" : "城固县"
        },
        {
            "id"   : "3151",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610723",
            "name" : "洋县"
        },
        {
            "id"   : "3152",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610724",
            "name" : "西乡县"
        },
        {
            "id"   : "3153",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610725",
            "name" : "勉县"
        },
        {
            "id"   : "3154",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610726",
            "name" : "宁强县"
        },
        {
            "id"   : "3155",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610727",
            "name" : "略阳县"
        },
        {
            "id"   : "3156",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610728",
            "name" : "镇巴县"
        },
        {
            "id"   : "3157",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610729",
            "name" : "留坝县"
        },
        {
            "id"   : "3158",
            "pid"  : "3146",
            "type" : "2",
            "code" : "610730",
            "name" : "佛坪县"
        },
        {
            "id"   : "3159",
            "pid"  : "3066",
            "type" : "1",
            "code" : "610800",
            "name" : "榆林市"
        },
        {
            "id"   : "3160",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610801",
            "name" : "市辖区"
        },
        {
            "id"   : "3161",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610802",
            "name" : "榆阳区"
        },
        {
            "id"   : "3162",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610821",
            "name" : "神木县"
        },
        {
            "id"   : "3163",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610822",
            "name" : "府谷县"
        },
        {
            "id"   : "3164",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610823",
            "name" : "横山县"
        },
        {
            "id"   : "3165",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610824",
            "name" : "靖边县"
        },
        {
            "id"   : "3166",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610825",
            "name" : "定边县"
        },
        {
            "id"   : "3167",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610826",
            "name" : "绥德县"
        },
        {
            "id"   : "3168",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610827",
            "name" : "米脂县"
        },
        {
            "id"   : "3169",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610828",
            "name" : "佳县"
        },
        {
            "id"   : "3170",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610829",
            "name" : "吴堡县"
        },
        {
            "id"   : "3171",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610830",
            "name" : "清涧县"
        },
        {
            "id"   : "3172",
            "pid"  : "3159",
            "type" : "2",
            "code" : "610831",
            "name" : "子洲县"
        },
        {
            "id"   : "3173",
            "pid"  : "3066",
            "type" : "1",
            "code" : "610900",
            "name" : "安康市"
        },
        {
            "id"   : "3174",
            "pid"  : "3173",
            "type" : "2",
            "code" : "610901",
            "name" : "市辖区"
        },
        {
            "id"   : "3175",
            "pid"  : "3173",
            "type" : "2",
            "code" : "610902",
            "name" : "汉滨区"
        },
        {
            "id"   : "3176",
            "pid"  : "3173",
            "type" : "2",
            "code" : "610921",
            "name" : "汉阴县"
        },
        {
            "id"   : "3177",
            "pid"  : "3173",
            "type" : "2",
            "code" : "610922",
            "name" : "石泉县"
        },
        {
            "id"   : "3178",
            "pid"  : "3173",
            "type" : "2",
            "code" : "610923",
            "name" : "宁陕县"
        },
        {
            "id"   : "3179",
            "pid"  : "3173",
            "type" : "2",
            "code" : "610924",
            "name" : "紫阳县"
        },
        {
            "id"   : "3180",
            "pid"  : "3173",
            "type" : "2",
            "code" : "610925",
            "name" : "岚皋县"
        },
        {
            "id"   : "3181",
            "pid"  : "3173",
            "type" : "2",
            "code" : "610926",
            "name" : "平利县"
        },
        {
            "id"   : "3182",
            "pid"  : "3173",
            "type" : "2",
            "code" : "610927",
            "name" : "镇坪县"
        },
        {
            "id"   : "3183",
            "pid"  : "3173",
            "type" : "2",
            "code" : "610928",
            "name" : "旬阳县"
        },
        {
            "id"   : "3184",
            "pid"  : "3173",
            "type" : "2",
            "code" : "610929",
            "name" : "白河县"
        },
        {
            "id"   : "3185",
            "pid"  : "3066",
            "type" : "1",
            "code" : "611000",
            "name" : "商洛市"
        },
        {
            "id"   : "3186",
            "pid"  : "3185",
            "type" : "2",
            "code" : "611001",
            "name" : "市辖区"
        },
        {
            "id"   : "3187",
            "pid"  : "3185",
            "type" : "2",
            "code" : "611002",
            "name" : "商州区"
        },
        {
            "id"   : "3188",
            "pid"  : "3185",
            "type" : "2",
            "code" : "611021",
            "name" : "洛南县"
        },
        {
            "id"   : "3189",
            "pid"  : "3185",
            "type" : "2",
            "code" : "611022",
            "name" : "丹凤县"
        },
        {
            "id"   : "3190",
            "pid"  : "3185",
            "type" : "2",
            "code" : "611023",
            "name" : "商南县"
        },
        {
            "id"   : "3191",
            "pid"  : "3185",
            "type" : "2",
            "code" : "611024",
            "name" : "山阳县"
        },
        {
            "id"   : "3192",
            "pid"  : "3185",
            "type" : "2",
            "code" : "611025",
            "name" : "镇安县"
        },
        {
            "id"   : "3193",
            "pid"  : "3185",
            "type" : "2",
            "code" : "611026",
            "name" : "柞水县"
        },
        {
            "id"   : "3194",
            "pid"  : "0",
            "type" : "0",
            "code" : "620000",
            "name" : "甘肃省"
        },
        {
            "id"   : "3195",
            "pid"  : "3194",
            "type" : "1",
            "code" : "620100",
            "name" : "兰州市"
        },
        {
            "id"   : "3196",
            "pid"  : "3195",
            "type" : "2",
            "code" : "620101",
            "name" : "市辖区"
        },
        {
            "id"   : "3197",
            "pid"  : "3195",
            "type" : "2",
            "code" : "620102",
            "name" : "城关区"
        },
        {
            "id"   : "3198",
            "pid"  : "3195",
            "type" : "2",
            "code" : "620103",
            "name" : "七里河区"
        },
        {
            "id"   : "3199",
            "pid"  : "3195",
            "type" : "2",
            "code" : "620104",
            "name" : "西固区"
        },
        {
            "id"   : "3200",
            "pid"  : "3195",
            "type" : "2",
            "code" : "620105",
            "name" : "安宁区"
        },
        {
            "id"   : "3201",
            "pid"  : "3195",
            "type" : "2",
            "code" : "620111",
            "name" : "红古区"
        },
        {
            "id"   : "3202",
            "pid"  : "3195",
            "type" : "2",
            "code" : "620121",
            "name" : "永登县"
        },
        {
            "id"   : "3203",
            "pid"  : "3195",
            "type" : "2",
            "code" : "620122",
            "name" : "皋兰县"
        },
        {
            "id"   : "3204",
            "pid"  : "3195",
            "type" : "2",
            "code" : "620123",
            "name" : "榆中县"
        },
        {
            "id"   : "3205",
            "pid"  : "3194",
            "type" : "1",
            "code" : "620200",
            "name" : "嘉峪关市"
        },
        {
            "id"   : "3206",
            "pid"  : "3205",
            "type" : "2",
            "code" : "620201",
            "name" : "市辖区"
        },
        {
            "id"   : "3207",
            "pid"  : "3194",
            "type" : "1",
            "code" : "620300",
            "name" : "金昌市"
        },
        {
            "id"   : "3208",
            "pid"  : "3207",
            "type" : "2",
            "code" : "620301",
            "name" : "市辖区"
        },
        {
            "id"   : "3209",
            "pid"  : "3207",
            "type" : "2",
            "code" : "620302",
            "name" : "金川区"
        },
        {
            "id"   : "3210",
            "pid"  : "3207",
            "type" : "2",
            "code" : "620321",
            "name" : "永昌县"
        },
        {
            "id"   : "3211",
            "pid"  : "3194",
            "type" : "1",
            "code" : "620400",
            "name" : "白银市"
        },
        {
            "id"   : "3212",
            "pid"  : "3211",
            "type" : "2",
            "code" : "620401",
            "name" : "市辖区"
        },
        {
            "id"   : "3213",
            "pid"  : "3211",
            "type" : "2",
            "code" : "620402",
            "name" : "白银区"
        },
        {
            "id"   : "3214",
            "pid"  : "3211",
            "type" : "2",
            "code" : "620403",
            "name" : "平川区"
        },
        {
            "id"   : "3215",
            "pid"  : "3211",
            "type" : "2",
            "code" : "620421",
            "name" : "靖远县"
        },
        {
            "id"   : "3216",
            "pid"  : "3211",
            "type" : "2",
            "code" : "620422",
            "name" : "会宁县"
        },
        {
            "id"   : "3217",
            "pid"  : "3211",
            "type" : "2",
            "code" : "620423",
            "name" : "景泰县"
        },
        {
            "id"   : "3218",
            "pid"  : "3194",
            "type" : "1",
            "code" : "620500",
            "name" : "天水市"
        },
        {
            "id"   : "3219",
            "pid"  : "3218",
            "type" : "2",
            "code" : "620501",
            "name" : "市辖区"
        },
        {
            "id"   : "3220",
            "pid"  : "3218",
            "type" : "2",
            "code" : "620502",
            "name" : "秦州区"
        },
        {
            "id"   : "3221",
            "pid"  : "3218",
            "type" : "2",
            "code" : "620503",
            "name" : "麦积区"
        },
        {
            "id"   : "3222",
            "pid"  : "3218",
            "type" : "2",
            "code" : "620521",
            "name" : "清水县"
        },
        {
            "id"   : "3223",
            "pid"  : "3218",
            "type" : "2",
            "code" : "620522",
            "name" : "秦安县"
        },
        {
            "id"   : "3224",
            "pid"  : "3218",
            "type" : "2",
            "code" : "620523",
            "name" : "甘谷县"
        },
        {
            "id"   : "3225",
            "pid"  : "3218",
            "type" : "2",
            "code" : "620524",
            "name" : "武山县"
        },
        {
            "id"   : "3226",
            "pid"  : "3218",
            "type" : "2",
            "code" : "620525",
            "name" : "张家川回族自治县"
        },
        {
            "id"   : "3227",
            "pid"  : "3194",
            "type" : "1",
            "code" : "620600",
            "name" : "武威市"
        },
        {
            "id"   : "3228",
            "pid"  : "3227",
            "type" : "2",
            "code" : "620601",
            "name" : "市辖区"
        },
        {
            "id"   : "3229",
            "pid"  : "3227",
            "type" : "2",
            "code" : "620602",
            "name" : "凉州区"
        },
        {
            "id"   : "3230",
            "pid"  : "3227",
            "type" : "2",
            "code" : "620621",
            "name" : "民勤县"
        },
        {
            "id"   : "3231",
            "pid"  : "3227",
            "type" : "2",
            "code" : "620622",
            "name" : "古浪县"
        },
        {
            "id"   : "3232",
            "pid"  : "3227",
            "type" : "2",
            "code" : "620623",
            "name" : "天祝藏族自治县"
        },
        {
            "id"   : "3233",
            "pid"  : "3194",
            "type" : "1",
            "code" : "620700",
            "name" : "张掖市"
        },
        {
            "id"   : "3234",
            "pid"  : "3233",
            "type" : "2",
            "code" : "620701",
            "name" : "市辖区"
        },
        {
            "id"   : "3235",
            "pid"  : "3233",
            "type" : "2",
            "code" : "620702",
            "name" : "甘州区"
        },
        {
            "id"   : "3236",
            "pid"  : "3233",
            "type" : "2",
            "code" : "620721",
            "name" : "肃南裕固族自治县"
        },
        {
            "id"   : "3237",
            "pid"  : "3233",
            "type" : "2",
            "code" : "620722",
            "name" : "民乐县"
        },
        {
            "id"   : "3238",
            "pid"  : "3233",
            "type" : "2",
            "code" : "620723",
            "name" : "临泽县"
        },
        {
            "id"   : "3239",
            "pid"  : "3233",
            "type" : "2",
            "code" : "620724",
            "name" : "高台县"
        },
        {
            "id"   : "3240",
            "pid"  : "3233",
            "type" : "2",
            "code" : "620725",
            "name" : "山丹县"
        },
        {
            "id"   : "3241",
            "pid"  : "3194",
            "type" : "1",
            "code" : "620800",
            "name" : "平凉市"
        },
        {
            "id"   : "3242",
            "pid"  : "3241",
            "type" : "2",
            "code" : "620801",
            "name" : "市辖区"
        },
        {
            "id"   : "3243",
            "pid"  : "3241",
            "type" : "2",
            "code" : "620802",
            "name" : "崆峒区"
        },
        {
            "id"   : "3244",
            "pid"  : "3241",
            "type" : "2",
            "code" : "620821",
            "name" : "泾川县"
        },
        {
            "id"   : "3245",
            "pid"  : "3241",
            "type" : "2",
            "code" : "620822",
            "name" : "灵台县"
        },
        {
            "id"   : "3246",
            "pid"  : "3241",
            "type" : "2",
            "code" : "620823",
            "name" : "崇信县"
        },
        {
            "id"   : "3247",
            "pid"  : "3241",
            "type" : "2",
            "code" : "620824",
            "name" : "华亭县"
        },
        {
            "id"   : "3248",
            "pid"  : "3241",
            "type" : "2",
            "code" : "620825",
            "name" : "庄浪县"
        },
        {
            "id"   : "3249",
            "pid"  : "3241",
            "type" : "2",
            "code" : "620826",
            "name" : "静宁县"
        },
        {
            "id"   : "3250",
            "pid"  : "3194",
            "type" : "1",
            "code" : "620900",
            "name" : "酒泉市"
        },
        {
            "id"   : "3251",
            "pid"  : "3250",
            "type" : "2",
            "code" : "620901",
            "name" : "市辖区"
        },
        {
            "id"   : "3252",
            "pid"  : "3250",
            "type" : "2",
            "code" : "620902",
            "name" : "肃州区"
        },
        {
            "id"   : "3253",
            "pid"  : "3250",
            "type" : "2",
            "code" : "620921",
            "name" : "金塔县"
        },
        {
            "id"   : "3254",
            "pid"  : "3250",
            "type" : "2",
            "code" : "620922",
            "name" : "瓜州县"
        },
        {
            "id"   : "3255",
            "pid"  : "3250",
            "type" : "2",
            "code" : "620923",
            "name" : "肃北蒙古族自治县"
        },
        {
            "id"   : "3256",
            "pid"  : "3250",
            "type" : "2",
            "code" : "620924",
            "name" : "阿克塞哈萨克族自治县"
        },
        {
            "id"   : "3257",
            "pid"  : "3250",
            "type" : "2",
            "code" : "620981",
            "name" : "玉门市"
        },
        {
            "id"   : "3258",
            "pid"  : "3250",
            "type" : "2",
            "code" : "620982",
            "name" : "敦煌市"
        },
        {
            "id"   : "3259",
            "pid"  : "3194",
            "type" : "1",
            "code" : "621000",
            "name" : "庆阳市"
        },
        {
            "id"   : "3260",
            "pid"  : "3259",
            "type" : "2",
            "code" : "621001",
            "name" : "市辖区"
        },
        {
            "id"   : "3261",
            "pid"  : "3259",
            "type" : "2",
            "code" : "621002",
            "name" : "西峰区"
        },
        {
            "id"   : "3262",
            "pid"  : "3259",
            "type" : "2",
            "code" : "621021",
            "name" : "庆城县"
        },
        {
            "id"   : "3263",
            "pid"  : "3259",
            "type" : "2",
            "code" : "621022",
            "name" : "环县"
        },
        {
            "id"   : "3264",
            "pid"  : "3259",
            "type" : "2",
            "code" : "621023",
            "name" : "华池县"
        },
        {
            "id"   : "3265",
            "pid"  : "3259",
            "type" : "2",
            "code" : "621024",
            "name" : "合水县"
        },
        {
            "id"   : "3266",
            "pid"  : "3259",
            "type" : "2",
            "code" : "621025",
            "name" : "正宁县"
        },
        {
            "id"   : "3267",
            "pid"  : "3259",
            "type" : "2",
            "code" : "621026",
            "name" : "宁县"
        },
        {
            "id"   : "3268",
            "pid"  : "3259",
            "type" : "2",
            "code" : "621027",
            "name" : "镇原县"
        },
        {
            "id"   : "3269",
            "pid"  : "3194",
            "type" : "1",
            "code" : "621100",
            "name" : "定西市"
        },
        {
            "id"   : "3270",
            "pid"  : "3269",
            "type" : "2",
            "code" : "621101",
            "name" : "市辖区"
        },
        {
            "id"   : "3271",
            "pid"  : "3269",
            "type" : "2",
            "code" : "621102",
            "name" : "安定区"
        },
        {
            "id"   : "3272",
            "pid"  : "3269",
            "type" : "2",
            "code" : "621121",
            "name" : "通渭县"
        },
        {
            "id"   : "3273",
            "pid"  : "3269",
            "type" : "2",
            "code" : "621122",
            "name" : "陇西县"
        },
        {
            "id"   : "3274",
            "pid"  : "3269",
            "type" : "2",
            "code" : "621123",
            "name" : "渭源县"
        },
        {
            "id"   : "3275",
            "pid"  : "3269",
            "type" : "2",
            "code" : "621124",
            "name" : "临洮县"
        },
        {
            "id"   : "3276",
            "pid"  : "3269",
            "type" : "2",
            "code" : "621125",
            "name" : "漳县"
        },
        {
            "id"   : "3277",
            "pid"  : "3269",
            "type" : "2",
            "code" : "621126",
            "name" : "岷县"
        },
        {
            "id"   : "3278",
            "pid"  : "3194",
            "type" : "1",
            "code" : "621200",
            "name" : "陇南市"
        },
        {
            "id"   : "3279",
            "pid"  : "3278",
            "type" : "2",
            "code" : "621201",
            "name" : "市辖区"
        },
        {
            "id"   : "3280",
            "pid"  : "3278",
            "type" : "2",
            "code" : "621202",
            "name" : "武都区"
        },
        {
            "id"   : "3281",
            "pid"  : "3278",
            "type" : "2",
            "code" : "621221",
            "name" : "成县"
        },
        {
            "id"   : "3282",
            "pid"  : "3278",
            "type" : "2",
            "code" : "621222",
            "name" : "文县"
        },
        {
            "id"   : "3283",
            "pid"  : "3278",
            "type" : "2",
            "code" : "621223",
            "name" : "宕昌县"
        },
        {
            "id"   : "3284",
            "pid"  : "3278",
            "type" : "2",
            "code" : "621224",
            "name" : "康县"
        },
        {
            "id"   : "3285",
            "pid"  : "3278",
            "type" : "2",
            "code" : "621225",
            "name" : "西和县"
        },
        {
            "id"   : "3286",
            "pid"  : "3278",
            "type" : "2",
            "code" : "621226",
            "name" : "礼县"
        },
        {
            "id"   : "3287",
            "pid"  : "3278",
            "type" : "2",
            "code" : "621227",
            "name" : "徽县"
        },
        {
            "id"   : "3288",
            "pid"  : "3278",
            "type" : "2",
            "code" : "621228",
            "name" : "两当县"
        },
        {
            "id"   : "3289",
            "pid"  : "3194",
            "type" : "1",
            "code" : "622900",
            "name" : "临夏回族自治州"
        },
        {
            "id"   : "3290",
            "pid"  : "3289",
            "type" : "2",
            "code" : "622901",
            "name" : "临夏市"
        },
        {
            "id"   : "3291",
            "pid"  : "3289",
            "type" : "2",
            "code" : "622921",
            "name" : "临夏县"
        },
        {
            "id"   : "3292",
            "pid"  : "3289",
            "type" : "2",
            "code" : "622922",
            "name" : "康乐县"
        },
        {
            "id"   : "3293",
            "pid"  : "3289",
            "type" : "2",
            "code" : "622923",
            "name" : "永靖县"
        },
        {
            "id"   : "3294",
            "pid"  : "3289",
            "type" : "2",
            "code" : "622924",
            "name" : "广河县"
        },
        {
            "id"   : "3295",
            "pid"  : "3289",
            "type" : "2",
            "code" : "622925",
            "name" : "和政县"
        },
        {
            "id"   : "3296",
            "pid"  : "3289",
            "type" : "2",
            "code" : "622926",
            "name" : "东乡族自治县"
        },
        {
            "id"   : "3297",
            "pid"  : "3289",
            "type" : "2",
            "code" : "622927",
            "name" : "积石山保安族东乡族撒拉族自治县"
        },
        {
            "id"   : "3298",
            "pid"  : "3194",
            "type" : "1",
            "code" : "623000",
            "name" : "甘南藏族自治州"
        },
        {
            "id"   : "3299",
            "pid"  : "3298",
            "type" : "2",
            "code" : "623001",
            "name" : "合作市"
        },
        {
            "id"   : "3300",
            "pid"  : "3298",
            "type" : "2",
            "code" : "623021",
            "name" : "临潭县"
        },
        {
            "id"   : "3301",
            "pid"  : "3298",
            "type" : "2",
            "code" : "623022",
            "name" : "卓尼县"
        },
        {
            "id"   : "3302",
            "pid"  : "3298",
            "type" : "2",
            "code" : "623023",
            "name" : "舟曲县"
        },
        {
            "id"   : "3303",
            "pid"  : "3298",
            "type" : "2",
            "code" : "623024",
            "name" : "迭部县"
        },
        {
            "id"   : "3304",
            "pid"  : "3298",
            "type" : "2",
            "code" : "623025",
            "name" : "玛曲县"
        },
        {
            "id"   : "3305",
            "pid"  : "3298",
            "type" : "2",
            "code" : "623026",
            "name" : "碌曲县"
        },
        {
            "id"   : "3306",
            "pid"  : "3298",
            "type" : "2",
            "code" : "623027",
            "name" : "夏河县"
        },
        {
            "id"   : "3307",
            "pid"  : "0",
            "type" : "0",
            "code" : "630000",
            "name" : "青海省"
        },
        {
            "id"   : "3308",
            "pid"  : "3307",
            "type" : "1",
            "code" : "630100",
            "name" : "西宁市"
        },
        {
            "id"   : "3309",
            "pid"  : "3308",
            "type" : "2",
            "code" : "630101",
            "name" : "市辖区"
        },
        {
            "id"   : "3310",
            "pid"  : "3308",
            "type" : "2",
            "code" : "630102",
            "name" : "城东区"
        },
        {
            "id"   : "3311",
            "pid"  : "3308",
            "type" : "2",
            "code" : "630103",
            "name" : "城中区"
        },
        {
            "id"   : "3312",
            "pid"  : "3308",
            "type" : "2",
            "code" : "630104",
            "name" : "城西区"
        },
        {
            "id"   : "3313",
            "pid"  : "3308",
            "type" : "2",
            "code" : "630105",
            "name" : "城北区"
        },
        {
            "id"   : "3314",
            "pid"  : "3308",
            "type" : "2",
            "code" : "630121",
            "name" : "大通回族土族自治县"
        },
        {
            "id"   : "3315",
            "pid"  : "3308",
            "type" : "2",
            "code" : "630122",
            "name" : "湟中县"
        },
        {
            "id"   : "3316",
            "pid"  : "3308",
            "type" : "2",
            "code" : "630123",
            "name" : "湟源县"
        },
        {
            "id"   : "3317",
            "pid"  : "3307",
            "type" : "1",
            "code" : "630200",
            "name" : "海东市"
        },
        {
            "id"   : "3318",
            "pid"  : "3317",
            "type" : "2",
            "code" : "630202",
            "name" : "乐都区"
        },
        {
            "id"   : "3319",
            "pid"  : "3317",
            "type" : "2",
            "code" : "630221",
            "name" : "平安县"
        },
        {
            "id"   : "3320",
            "pid"  : "3317",
            "type" : "2",
            "code" : "630222",
            "name" : "民和回族土族自治县"
        },
        {
            "id"   : "3321",
            "pid"  : "3317",
            "type" : "2",
            "code" : "630223",
            "name" : "互助土族自治县"
        },
        {
            "id"   : "3322",
            "pid"  : "3317",
            "type" : "2",
            "code" : "630224",
            "name" : "化隆回族自治县"
        },
        {
            "id"   : "3323",
            "pid"  : "3317",
            "type" : "2",
            "code" : "630225",
            "name" : "循化撒拉族自治县"
        },
        {
            "id"   : "3324",
            "pid"  : "3307",
            "type" : "1",
            "code" : "632200",
            "name" : "海北藏族自治州"
        },
        {
            "id"   : "3325",
            "pid"  : "3324",
            "type" : "2",
            "code" : "632221",
            "name" : "门源回族自治县"
        },
        {
            "id"   : "3326",
            "pid"  : "3324",
            "type" : "2",
            "code" : "632222",
            "name" : "祁连县"
        },
        {
            "id"   : "3327",
            "pid"  : "3324",
            "type" : "2",
            "code" : "632223",
            "name" : "海晏县"
        },
        {
            "id"   : "3328",
            "pid"  : "3324",
            "type" : "2",
            "code" : "632224",
            "name" : "刚察县"
        },
        {
            "id"   : "3329",
            "pid"  : "3307",
            "type" : "1",
            "code" : "632300",
            "name" : "黄南藏族自治州"
        },
        {
            "id"   : "3330",
            "pid"  : "3329",
            "type" : "2",
            "code" : "632321",
            "name" : "同仁县"
        },
        {
            "id"   : "3331",
            "pid"  : "3329",
            "type" : "2",
            "code" : "632322",
            "name" : "尖扎县"
        },
        {
            "id"   : "3332",
            "pid"  : "3329",
            "type" : "2",
            "code" : "632323",
            "name" : "泽库县"
        },
        {
            "id"   : "3333",
            "pid"  : "3329",
            "type" : "2",
            "code" : "632324",
            "name" : "河南蒙古族自治县"
        },
        {
            "id"   : "3334",
            "pid"  : "3307",
            "type" : "1",
            "code" : "632500",
            "name" : "海南藏族自治州"
        },
        {
            "id"   : "3335",
            "pid"  : "3334",
            "type" : "2",
            "code" : "632521",
            "name" : "共和县"
        },
        {
            "id"   : "3336",
            "pid"  : "3334",
            "type" : "2",
            "code" : "632522",
            "name" : "同德县"
        },
        {
            "id"   : "3337",
            "pid"  : "3334",
            "type" : "2",
            "code" : "632523",
            "name" : "贵德县"
        },
        {
            "id"   : "3338",
            "pid"  : "3334",
            "type" : "2",
            "code" : "632524",
            "name" : "兴海县"
        },
        {
            "id"   : "3339",
            "pid"  : "3334",
            "type" : "2",
            "code" : "632525",
            "name" : "贵南县"
        },
        {
            "id"   : "3340",
            "pid"  : "3307",
            "type" : "1",
            "code" : "632600",
            "name" : "果洛藏族自治州"
        },
        {
            "id"   : "3341",
            "pid"  : "3340",
            "type" : "2",
            "code" : "632621",
            "name" : "玛沁县"
        },
        {
            "id"   : "3342",
            "pid"  : "3340",
            "type" : "2",
            "code" : "632622",
            "name" : "班玛县"
        },
        {
            "id"   : "3343",
            "pid"  : "3340",
            "type" : "2",
            "code" : "632623",
            "name" : "甘德县"
        },
        {
            "id"   : "3344",
            "pid"  : "3340",
            "type" : "2",
            "code" : "632624",
            "name" : "达日县"
        },
        {
            "id"   : "3345",
            "pid"  : "3340",
            "type" : "2",
            "code" : "632625",
            "name" : "久治县"
        },
        {
            "id"   : "3346",
            "pid"  : "3340",
            "type" : "2",
            "code" : "632626",
            "name" : "玛多县"
        },
        {
            "id"   : "3347",
            "pid"  : "3307",
            "type" : "1",
            "code" : "632700",
            "name" : "玉树藏族自治州"
        },
        {
            "id"   : "3348",
            "pid"  : "3347",
            "type" : "2",
            "code" : "632701",
            "name" : "玉树市"
        },
        {
            "id"   : "3349",
            "pid"  : "3347",
            "type" : "2",
            "code" : "632722",
            "name" : "杂多县"
        },
        {
            "id"   : "3350",
            "pid"  : "3347",
            "type" : "2",
            "code" : "632723",
            "name" : "称多县"
        },
        {
            "id"   : "3351",
            "pid"  : "3347",
            "type" : "2",
            "code" : "632724",
            "name" : "治多县"
        },
        {
            "id"   : "3352",
            "pid"  : "3347",
            "type" : "2",
            "code" : "632725",
            "name" : "囊谦县"
        },
        {
            "id"   : "3353",
            "pid"  : "3347",
            "type" : "2",
            "code" : "632726",
            "name" : "曲麻莱县"
        },
        {
            "id"   : "3354",
            "pid"  : "3307",
            "type" : "1",
            "code" : "632800",
            "name" : "海西蒙古族藏族自治州"
        },
        {
            "id"   : "3355",
            "pid"  : "3354",
            "type" : "2",
            "code" : "632801",
            "name" : "格尔木市"
        },
        {
            "id"   : "3356",
            "pid"  : "3354",
            "type" : "2",
            "code" : "632802",
            "name" : "德令哈市"
        },
        {
            "id"   : "3357",
            "pid"  : "3354",
            "type" : "2",
            "code" : "632821",
            "name" : "乌兰县"
        },
        {
            "id"   : "3358",
            "pid"  : "3354",
            "type" : "2",
            "code" : "632822",
            "name" : "都兰县"
        },
        {
            "id"   : "3359",
            "pid"  : "3354",
            "type" : "2",
            "code" : "632823",
            "name" : "天峻县"
        },
        {
            "id"   : "3360",
            "pid"  : "0",
            "type" : "0",
            "code" : "640000",
            "name" : "宁夏回族自治区"
        },
        {
            "id"   : "3361",
            "pid"  : "3360",
            "type" : "1",
            "code" : "640100",
            "name" : "银川市"
        },
        {
            "id"   : "3362",
            "pid"  : "3361",
            "type" : "2",
            "code" : "640101",
            "name" : "市辖区"
        },
        {
            "id"   : "3363",
            "pid"  : "3361",
            "type" : "2",
            "code" : "640104",
            "name" : "兴庆区"
        },
        {
            "id"   : "3364",
            "pid"  : "3361",
            "type" : "2",
            "code" : "640105",
            "name" : "西夏区"
        },
        {
            "id"   : "3365",
            "pid"  : "3361",
            "type" : "2",
            "code" : "640106",
            "name" : "金凤区"
        },
        {
            "id"   : "3366",
            "pid"  : "3361",
            "type" : "2",
            "code" : "640121",
            "name" : "永宁县"
        },
        {
            "id"   : "3367",
            "pid"  : "3361",
            "type" : "2",
            "code" : "640122",
            "name" : "贺兰县"
        },
        {
            "id"   : "3368",
            "pid"  : "3361",
            "type" : "2",
            "code" : "640181",
            "name" : "灵武市"
        },
        {
            "id"   : "3369",
            "pid"  : "3360",
            "type" : "1",
            "code" : "640200",
            "name" : "石嘴山市"
        },
        {
            "id"   : "3370",
            "pid"  : "3369",
            "type" : "2",
            "code" : "640201",
            "name" : "市辖区"
        },
        {
            "id"   : "3371",
            "pid"  : "3369",
            "type" : "2",
            "code" : "640202",
            "name" : "大武口区"
        },
        {
            "id"   : "3372",
            "pid"  : "3369",
            "type" : "2",
            "code" : "640205",
            "name" : "惠农区"
        },
        {
            "id"   : "3373",
            "pid"  : "3369",
            "type" : "2",
            "code" : "640221",
            "name" : "平罗县"
        },
        {
            "id"   : "3374",
            "pid"  : "3360",
            "type" : "1",
            "code" : "640300",
            "name" : "吴忠市"
        },
        {
            "id"   : "3375",
            "pid"  : "3374",
            "type" : "2",
            "code" : "640301",
            "name" : "市辖区"
        },
        {
            "id"   : "3376",
            "pid"  : "3374",
            "type" : "2",
            "code" : "640302",
            "name" : "利通区"
        },
        {
            "id"   : "3377",
            "pid"  : "3374",
            "type" : "2",
            "code" : "640303",
            "name" : "红寺堡区"
        },
        {
            "id"   : "3378",
            "pid"  : "3374",
            "type" : "2",
            "code" : "640323",
            "name" : "盐池县"
        },
        {
            "id"   : "3379",
            "pid"  : "3374",
            "type" : "2",
            "code" : "640324",
            "name" : "同心县"
        },
        {
            "id"   : "3380",
            "pid"  : "3374",
            "type" : "2",
            "code" : "640381",
            "name" : "青铜峡市"
        },
        {
            "id"   : "3381",
            "pid"  : "3360",
            "type" : "1",
            "code" : "640400",
            "name" : "固原市"
        },
        {
            "id"   : "3382",
            "pid"  : "3381",
            "type" : "2",
            "code" : "640401",
            "name" : "市辖区"
        },
        {
            "id"   : "3383",
            "pid"  : "3381",
            "type" : "2",
            "code" : "640402",
            "name" : "原州区"
        },
        {
            "id"   : "3384",
            "pid"  : "3381",
            "type" : "2",
            "code" : "640422",
            "name" : "西吉县"
        },
        {
            "id"   : "3385",
            "pid"  : "3381",
            "type" : "2",
            "code" : "640423",
            "name" : "隆德县"
        },
        {
            "id"   : "3386",
            "pid"  : "3381",
            "type" : "2",
            "code" : "640424",
            "name" : "泾源县"
        },
        {
            "id"   : "3387",
            "pid"  : "3381",
            "type" : "2",
            "code" : "640425",
            "name" : "彭阳县"
        },
        {
            "id"   : "3388",
            "pid"  : "3360",
            "type" : "1",
            "code" : "640500",
            "name" : "中卫市"
        },
        {
            "id"   : "3389",
            "pid"  : "3388",
            "type" : "2",
            "code" : "640501",
            "name" : "市辖区"
        },
        {
            "id"   : "3390",
            "pid"  : "3388",
            "type" : "2",
            "code" : "640502",
            "name" : "沙坡头区"
        },
        {
            "id"   : "3391",
            "pid"  : "3388",
            "type" : "2",
            "code" : "640521",
            "name" : "中宁县"
        },
        {
            "id"   : "3392",
            "pid"  : "3388",
            "type" : "2",
            "code" : "640522",
            "name" : "海原县"
        },
        {
            "id"   : "3393",
            "pid"  : "0",
            "type" : "0",
            "code" : "650000",
            "name" : "新疆维吾尔自治区"
        },
        {
            "id"   : "3394",
            "pid"  : "3393",
            "type" : "1",
            "code" : "650100",
            "name" : "乌鲁木齐市"
        },
        {
            "id"   : "3395",
            "pid"  : "3394",
            "type" : "2",
            "code" : "650101",
            "name" : "市辖区"
        },
        {
            "id"   : "3396",
            "pid"  : "3394",
            "type" : "2",
            "code" : "650102",
            "name" : "天山区"
        },
        {
            "id"   : "3397",
            "pid"  : "3394",
            "type" : "2",
            "code" : "650103",
            "name" : "沙依巴克区"
        },
        {
            "id"   : "3398",
            "pid"  : "3394",
            "type" : "2",
            "code" : "650104",
            "name" : "新市区"
        },
        {
            "id"   : "3399",
            "pid"  : "3394",
            "type" : "2",
            "code" : "650105",
            "name" : "水磨沟区"
        },
        {
            "id"   : "3400",
            "pid"  : "3394",
            "type" : "2",
            "code" : "650106",
            "name" : "头屯河区"
        },
        {
            "id"   : "3401",
            "pid"  : "3394",
            "type" : "2",
            "code" : "650107",
            "name" : "达坂城区"
        },
        {
            "id"   : "3402",
            "pid"  : "3394",
            "type" : "2",
            "code" : "650109",
            "name" : "米东区"
        },
        {
            "id"   : "3403",
            "pid"  : "3394",
            "type" : "2",
            "code" : "650121",
            "name" : "乌鲁木齐县"
        },
        {
            "id"   : "3404",
            "pid"  : "3393",
            "type" : "1",
            "code" : "650200",
            "name" : "克拉玛依市"
        },
        {
            "id"   : "3405",
            "pid"  : "3404",
            "type" : "2",
            "code" : "650201",
            "name" : "市辖区"
        },
        {
            "id"   : "3406",
            "pid"  : "3404",
            "type" : "2",
            "code" : "650202",
            "name" : "独山子区"
        },
        {
            "id"   : "3407",
            "pid"  : "3404",
            "type" : "2",
            "code" : "650203",
            "name" : "克拉玛依区"
        },
        {
            "id"   : "3408",
            "pid"  : "3404",
            "type" : "2",
            "code" : "650204",
            "name" : "白碱滩区"
        },
        {
            "id"   : "3409",
            "pid"  : "3404",
            "type" : "2",
            "code" : "650205",
            "name" : "乌尔禾区"
        },
        {
            "id"   : "3410",
            "pid"  : "3393",
            "type" : "1",
            "code" : "652100",
            "name" : "吐鲁番地区"
        },
        {
            "id"   : "3411",
            "pid"  : "3410",
            "type" : "2",
            "code" : "652101",
            "name" : "吐鲁番市"
        },
        {
            "id"   : "3412",
            "pid"  : "3410",
            "type" : "2",
            "code" : "652122",
            "name" : "鄯善县"
        },
        {
            "id"   : "3413",
            "pid"  : "3410",
            "type" : "2",
            "code" : "652123",
            "name" : "托克逊县"
        },
        {
            "id"   : "3414",
            "pid"  : "3393",
            "type" : "1",
            "code" : "652200",
            "name" : "哈密地区"
        },
        {
            "id"   : "3415",
            "pid"  : "3414",
            "type" : "2",
            "code" : "652201",
            "name" : "哈密市"
        },
        {
            "id"   : "3416",
            "pid"  : "3414",
            "type" : "2",
            "code" : "652222",
            "name" : "巴里坤哈萨克自治县"
        },
        {
            "id"   : "3417",
            "pid"  : "3414",
            "type" : "2",
            "code" : "652223",
            "name" : "伊吾县"
        },
        {
            "id"   : "3418",
            "pid"  : "3393",
            "type" : "1",
            "code" : "652300",
            "name" : "昌吉回族自治州"
        },
        {
            "id"   : "3419",
            "pid"  : "3418",
            "type" : "2",
            "code" : "652301",
            "name" : "昌吉市"
        },
        {
            "id"   : "3420",
            "pid"  : "3418",
            "type" : "2",
            "code" : "652302",
            "name" : "阜康市"
        },
        {
            "id"   : "3421",
            "pid"  : "3418",
            "type" : "2",
            "code" : "652323",
            "name" : "呼图壁县"
        },
        {
            "id"   : "3422",
            "pid"  : "3418",
            "type" : "2",
            "code" : "652324",
            "name" : "玛纳斯县"
        },
        {
            "id"   : "3423",
            "pid"  : "3418",
            "type" : "2",
            "code" : "652325",
            "name" : "奇台县"
        },
        {
            "id"   : "3424",
            "pid"  : "3418",
            "type" : "2",
            "code" : "652327",
            "name" : "吉木萨尔县"
        },
        {
            "id"   : "3425",
            "pid"  : "3418",
            "type" : "2",
            "code" : "652328",
            "name" : "木垒哈萨克自治县"
        },
        {
            "id"   : "3426",
            "pid"  : "3393",
            "type" : "1",
            "code" : "652700",
            "name" : "博尔塔拉蒙古自治州"
        },
        {
            "id"   : "3427",
            "pid"  : "3426",
            "type" : "2",
            "code" : "652701",
            "name" : "博乐市"
        },
        {
            "id"   : "3428",
            "pid"  : "3426",
            "type" : "2",
            "code" : "652702",
            "name" : "阿拉山口市"
        },
        {
            "id"   : "3429",
            "pid"  : "3426",
            "type" : "2",
            "code" : "652722",
            "name" : "精河县"
        },
        {
            "id"   : "3430",
            "pid"  : "3426",
            "type" : "2",
            "code" : "652723",
            "name" : "温泉县"
        },
        {
            "id"   : "3431",
            "pid"  : "3393",
            "type" : "1",
            "code" : "652800",
            "name" : "巴音郭楞蒙古自治州"
        },
        {
            "id"   : "3432",
            "pid"  : "3431",
            "type" : "2",
            "code" : "652801",
            "name" : "库尔勒市"
        },
        {
            "id"   : "3433",
            "pid"  : "3431",
            "type" : "2",
            "code" : "652822",
            "name" : "轮台县"
        },
        {
            "id"   : "3434",
            "pid"  : "3431",
            "type" : "2",
            "code" : "652823",
            "name" : "尉犁县"
        },
        {
            "id"   : "3435",
            "pid"  : "3431",
            "type" : "2",
            "code" : "652824",
            "name" : "若羌县"
        },
        {
            "id"   : "3436",
            "pid"  : "3431",
            "type" : "2",
            "code" : "652825",
            "name" : "且末县"
        },
        {
            "id"   : "3437",
            "pid"  : "3431",
            "type" : "2",
            "code" : "652826",
            "name" : "焉耆回族自治县"
        },
        {
            "id"   : "3438",
            "pid"  : "3431",
            "type" : "2",
            "code" : "652827",
            "name" : "和静县"
        },
        {
            "id"   : "3439",
            "pid"  : "3431",
            "type" : "2",
            "code" : "652828",
            "name" : "和硕县"
        },
        {
            "id"   : "3440",
            "pid"  : "3431",
            "type" : "2",
            "code" : "652829",
            "name" : "博湖县"
        },
        {
            "id"   : "3441",
            "pid"  : "3393",
            "type" : "1",
            "code" : "652900",
            "name" : "阿克苏地区"
        },
        {
            "id"   : "3442",
            "pid"  : "3441",
            "type" : "2",
            "code" : "652901",
            "name" : "阿克苏市"
        },
        {
            "id"   : "3443",
            "pid"  : "3441",
            "type" : "2",
            "code" : "652922",
            "name" : "温宿县"
        },
        {
            "id"   : "3444",
            "pid"  : "3441",
            "type" : "2",
            "code" : "652923",
            "name" : "库车县"
        },
        {
            "id"   : "3445",
            "pid"  : "3441",
            "type" : "2",
            "code" : "652924",
            "name" : "沙雅县"
        },
        {
            "id"   : "3446",
            "pid"  : "3441",
            "type" : "2",
            "code" : "652925",
            "name" : "新和县"
        },
        {
            "id"   : "3447",
            "pid"  : "3441",
            "type" : "2",
            "code" : "652926",
            "name" : "拜城县"
        },
        {
            "id"   : "3448",
            "pid"  : "3441",
            "type" : "2",
            "code" : "652927",
            "name" : "乌什县"
        },
        {
            "id"   : "3449",
            "pid"  : "3441",
            "type" : "2",
            "code" : "652928",
            "name" : "阿瓦提县"
        },
        {
            "id"   : "3450",
            "pid"  : "3441",
            "type" : "2",
            "code" : "652929",
            "name" : "柯坪县"
        },
        {
            "id"   : "3451",
            "pid"  : "3393",
            "type" : "1",
            "code" : "653000",
            "name" : "克孜勒苏柯尔克孜自治州"
        },
        {
            "id"   : "3452",
            "pid"  : "3451",
            "type" : "2",
            "code" : "653001",
            "name" : "阿图什市"
        },
        {
            "id"   : "3453",
            "pid"  : "3451",
            "type" : "2",
            "code" : "653022",
            "name" : "阿克陶县"
        },
        {
            "id"   : "3454",
            "pid"  : "3451",
            "type" : "2",
            "code" : "653023",
            "name" : "阿合奇县"
        },
        {
            "id"   : "3455",
            "pid"  : "3451",
            "type" : "2",
            "code" : "653024",
            "name" : "乌恰县"
        },
        {
            "id"   : "3456",
            "pid"  : "3393",
            "type" : "1",
            "code" : "653100",
            "name" : "喀什地区"
        },
        {
            "id"   : "3457",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653101",
            "name" : "喀什市"
        },
        {
            "id"   : "3458",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653121",
            "name" : "疏附县"
        },
        {
            "id"   : "3459",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653122",
            "name" : "疏勒县"
        },
        {
            "id"   : "3460",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653123",
            "name" : "英吉沙县"
        },
        {
            "id"   : "3461",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653124",
            "name" : "泽普县"
        },
        {
            "id"   : "3462",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653125",
            "name" : "莎车县"
        },
        {
            "id"   : "3463",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653126",
            "name" : "叶城县"
        },
        {
            "id"   : "3464",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653127",
            "name" : "麦盖提县"
        },
        {
            "id"   : "3465",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653128",
            "name" : "岳普湖县"
        },
        {
            "id"   : "3466",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653129",
            "name" : "伽师县"
        },
        {
            "id"   : "3467",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653130",
            "name" : "巴楚县"
        },
        {
            "id"   : "3468",
            "pid"  : "3456",
            "type" : "2",
            "code" : "653131",
            "name" : "塔什库尔干塔吉克自治县"
        },
        {
            "id"   : "3469",
            "pid"  : "3393",
            "type" : "1",
            "code" : "653200",
            "name" : "和田地区"
        },
        {
            "id"   : "3470",
            "pid"  : "3469",
            "type" : "2",
            "code" : "653201",
            "name" : "和田市"
        },
        {
            "id"   : "3471",
            "pid"  : "3469",
            "type" : "2",
            "code" : "653221",
            "name" : "和田县"
        },
        {
            "id"   : "3472",
            "pid"  : "3469",
            "type" : "2",
            "code" : "653222",
            "name" : "墨玉县"
        },
        {
            "id"   : "3473",
            "pid"  : "3469",
            "type" : "2",
            "code" : "653223",
            "name" : "皮山县"
        },
        {
            "id"   : "3474",
            "pid"  : "3469",
            "type" : "2",
            "code" : "653224",
            "name" : "洛浦县"
        },
        {
            "id"   : "3475",
            "pid"  : "3469",
            "type" : "2",
            "code" : "653225",
            "name" : "策勒县"
        },
        {
            "id"   : "3476",
            "pid"  : "3469",
            "type" : "2",
            "code" : "653226",
            "name" : "于田县"
        },
        {
            "id"   : "3477",
            "pid"  : "3469",
            "type" : "2",
            "code" : "653227",
            "name" : "民丰县"
        },
        {
            "id"   : "3478",
            "pid"  : "3393",
            "type" : "1",
            "code" : "654000",
            "name" : "伊犁哈萨克自治州"
        },
        {
            "id"   : "3479",
            "pid"  : "3478",
            "type" : "2",
            "code" : "654002",
            "name" : "伊宁市"
        },
        {
            "id"   : "3480",
            "pid"  : "3478",
            "type" : "2",
            "code" : "654003",
            "name" : "奎屯市"
        },
        {
            "id"   : "3481",
            "pid"  : "3478",
            "type" : "2",
            "code" : "654021",
            "name" : "伊宁县"
        },
        {
            "id"   : "3482",
            "pid"  : "3478",
            "type" : "2",
            "code" : "654022",
            "name" : "察布查尔锡伯自治县"
        },
        {
            "id"   : "3483",
            "pid"  : "3478",
            "type" : "2",
            "code" : "654023",
            "name" : "霍城县"
        },
        {
            "id"   : "3484",
            "pid"  : "3478",
            "type" : "2",
            "code" : "654024",
            "name" : "巩留县"
        },
        {
            "id"   : "3485",
            "pid"  : "3478",
            "type" : "2",
            "code" : "654025",
            "name" : "新源县"
        },
        {
            "id"   : "3486",
            "pid"  : "3478",
            "type" : "2",
            "code" : "654026",
            "name" : "昭苏县"
        },
        {
            "id"   : "3487",
            "pid"  : "3478",
            "type" : "2",
            "code" : "654027",
            "name" : "特克斯县"
        },
        {
            "id"   : "3488",
            "pid"  : "3478",
            "type" : "2",
            "code" : "654028",
            "name" : "尼勒克县"
        },
        {
            "id"   : "3489",
            "pid"  : "3393",
            "type" : "1",
            "code" : "654200",
            "name" : "塔城地区"
        },
        {
            "id"   : "3490",
            "pid"  : "3489",
            "type" : "2",
            "code" : "654201",
            "name" : "塔城市"
        },
        {
            "id"   : "3491",
            "pid"  : "3489",
            "type" : "2",
            "code" : "654202",
            "name" : "乌苏市"
        },
        {
            "id"   : "3492",
            "pid"  : "3489",
            "type" : "2",
            "code" : "654221",
            "name" : "额敏县"
        },
        {
            "id"   : "3493",
            "pid"  : "3489",
            "type" : "2",
            "code" : "654223",
            "name" : "沙湾县"
        },
        {
            "id"   : "3494",
            "pid"  : "3489",
            "type" : "2",
            "code" : "654224",
            "name" : "托里县"
        },
        {
            "id"   : "3495",
            "pid"  : "3489",
            "type" : "2",
            "code" : "654225",
            "name" : "裕民县"
        },
        {
            "id"   : "3496",
            "pid"  : "3489",
            "type" : "2",
            "code" : "654226",
            "name" : "和布克赛尔蒙古自治县"
        },
        {
            "id"   : "3497",
            "pid"  : "3393",
            "type" : "1",
            "code" : "654300",
            "name" : "阿勒泰地区"
        },
        {
            "id"   : "3498",
            "pid"  : "3497",
            "type" : "2",
            "code" : "654301",
            "name" : "阿勒泰市"
        },
        {
            "id"   : "3499",
            "pid"  : "3497",
            "type" : "2",
            "code" : "654321",
            "name" : "布尔津县"
        },
        {
            "id"   : "3500",
            "pid"  : "3497",
            "type" : "2",
            "code" : "654322",
            "name" : "富蕴县"
        },
        {
            "id"   : "3501",
            "pid"  : "3497",
            "type" : "2",
            "code" : "654323",
            "name" : "福海县"
        },
        {
            "id"   : "3502",
            "pid"  : "3497",
            "type" : "2",
            "code" : "654324",
            "name" : "哈巴河县"
        },
        {
            "id"   : "3503",
            "pid"  : "3497",
            "type" : "2",
            "code" : "654325",
            "name" : "青河县"
        },
        {
            "id"   : "3504",
            "pid"  : "3497",
            "type" : "2",
            "code" : "654326",
            "name" : "吉木乃县"
        },
        {
            "id"   : "3505",
            "pid"  : "3393",
            "type" : "1",
            "code" : "659000",
            "name" : "自治区直辖县级行政区划"
        },
        {
            "id"   : "3506",
            "pid"  : "3505",
            "type" : "2",
            "code" : "659001",
            "name" : "石河子市"
        },
        {
            "id"   : "3507",
            "pid"  : "3505",
            "type" : "2",
            "code" : "659002",
            "name" : "阿拉尔市"
        },
        {
            "id"   : "3508",
            "pid"  : "3505",
            "type" : "2",
            "code" : "659003",
            "name" : "图木舒克市"
        },
        {
            "id"   : "3509",
            "pid"  : "3505",
            "type" : "2",
            "code" : "659004",
            "name" : "五家渠市"
        },
        {
            "id"   : "3510",
            "pid"  : "0",
            "type" : "0",
            "code" : "710000",
            "name" : "台湾省"
        },
        {
            "id"   : "3511",
            "pid"  : "0",
            "type" : "0",
            "code" : "810000",
            "name" : "香港特别行政区"
        },
        {
            "id"   : "3512",
            "pid"  : "0",
            "type" : "0",
            "code" : "820000",
            "name" : "澳门特别行政区"
        }
    ];
    Region.model.collection.insert(regions, function (err, docs) {
        if (err) return next(err);
        console.log('length: ' + docs.length)
    })
})
module.exports = router;