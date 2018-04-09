var controller = require('./controllers');
var router = require('express').Router();

router.get('/video/:videoId', controller.videos.get);
router.post('/video/create', controller.videos.post);
// router.get('/user/create', controller.users.get);
router.get('/user/subscribed/:subscriberId/channel/:channelId', controller.subscriptions.get);
router.post('/user/subscribe', controller.subscriptions.post);


module.exports = router;


// /inventory/ homepage
// /inventory/video/<id> [get a video given videoid]
// /inventory/video/create/
// /inventory/user/<id>[ get a user given userid]
// /inventory/user/create
// /inventory/user/subscribed/<id>[is user subscribed]
// /user/subscribe
