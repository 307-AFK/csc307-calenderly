const express = require('express');
const users = require('../controllers/users');

const router = express.Router();

router.get('/', users.getUsers);
router.get('/:userid', users.getUser);
router.delete('/:userid', users.deleteUser);
router.get('/:userid/events', users.getEvents);
// TODO: these will probably be useful too
// router.get('/:userid/events/interviewer', users.getEventsAsInterviewer);
// router.get('/:userid/events/interviewee', users.getEventsAsInterviewee);

module.exports = router;
