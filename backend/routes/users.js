const express = require('express');
const users = require('../controllers/users');

const router = express.Router();

router.get('/', users.getUsers);
router.get('/:userid', users.getUser);

module.exports = router;
