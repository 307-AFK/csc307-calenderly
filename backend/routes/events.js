const express = require('express');
const events = require('../controllers/events');

const router = express.Router();

router.get('/', events.getEvents);
router.post('/', events.createEvent);
router.get('/:eventid', events.getEvent);
router.delete('/:eventid', events.deleteEvent);
router.get('/:eventid/interviewers', events.getEventInterviewers);

module.exports = router;
