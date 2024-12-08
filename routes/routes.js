const express = require('express');
router = express.Router();


const adminRoutes = require("../controllers/adminCtrl");



router.post("/safemind_login", adminRoutes.safemind_login);
router.post("/safemind_create_account", adminRoutes.safemind_create_account);
//groupchat of safemind

//////////////group chat
router.post('/createGroup', adminRoutes.createGroup);
router.post('/Group_get', adminRoutes.Group_get);
router.delete('/deleteGroup/:id', adminRoutes.deleteGroup);
router.get('/Group_get_all', adminRoutes.Group_get_all);
router.post("/reg_token", adminRoutes.reg_token);
router.post("/reg_peronality_chart", adminRoutes.reg_peronality_chart);
router.post("/safemind_post", adminRoutes.safemind_post);
router.get('/safemind_post_all', adminRoutes.safemind_post_all);



module.exports = router;