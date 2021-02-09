const express = require('express');
const events = require('../controllers/events');

const router = express.Router();

router.get('/', events.getEvents);
router.get('/:eventid', events.getEvent);
router.get('/:eventid/interviewers', events.getEventInterviewers);

module.exports = router;
