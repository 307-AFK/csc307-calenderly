const express = require('express');
const users = require('../controllers/users');

const router = express.Router();

router.get('/', users.getUsers);
router.get('/:userid', users.getUser);
router.delete('/:userid', users.deleteUser);
router.get('/:userid/events', users.getEvents);
router.get('/:userid/events/:role', users.getEventsAsRole);

module.exports = router;
