var router      = require('express').Router({ mergeParams: true });
var actions     = require('./actions');

router.get('/', actions.getUsers);
router.post('/', actions.addUser);

module.exports = router;