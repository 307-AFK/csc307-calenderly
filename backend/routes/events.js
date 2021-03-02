const express = require('express');
const events = require('../controllers/events');

const router = express.Router();

router.get('/', events.getEvents);
router.post('/', events.createEvent);
router.get('/:eventid', events.getEvent);
router.delete('/:eventid', events.deleteEvent);
router.get('/:eventid/interviewers', events.getEventInterviewers);
router.put('/:eventid/update', events.updateEvent);
router.get('/:eventid/interviewees', events.getEventInterviewees);
router.post('/:eventid/availability', events.updateAvailability);
router.post('/:eventid/interviewers', events.addInterviewer);
router.post('/:eventid/interviewees', events.addInterviewee);

module.exports = router;
