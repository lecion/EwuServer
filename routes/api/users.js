var express = require('express');
var router = express.Router();
var authMiddleware = require('../../middlewares/auth');
var User = require('../../app/controllers/UserController')


//auth middleware
router.use(authMiddleware);

//users
router.get('/', User.list);

router.get('/:id', User.show);

module.exports = router;