const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');

const request = supertest(app);
const User = require('../models/User');

const userData = new User({
  name: 'creator',
  email: 'test.user@gmail.com',
});

const eventData = {
  title: 'foo',
  description: 'bar',
  startDate: '2021-02-17T18:10:00.064Z',
  endDate: '2021-02-18T18:10:00.064Z',
};

const expectedTimeSlots = [
  {
    times: [
      true, true,
      true, false,
      false, false,
      false, false,
    ],
    date: '2021-02-17T18:10:00.064Z',
  },
  {
    times: [
      false, false,
      true, true,
      false, false,
      false, false,
    ],
    date: '2021-02-18T18:10:00.064Z',
  },
];

const expectedUpdatedEvent = {
  title: 'update event',
  description: 'update',
  startDate: '2021-02-19T18:10:00.064Z',
  endDate: '2021-02-22T18:10:00.064Z',
  interviewersNeeded: 3,
};

describe('Test event endpoints', () => {
  let testUser;
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }).then(() => console.log('Connected to MongoDB'));
    testUser = await userData.save(); // save a temporary user to reference as creator
    eventData.eventCreator = testUser._id.toString();
  });

  afterAll(async () => {
    await request.delete(`/users/${testUser._id}`);
    await mongoose.connection.close();
  });

  it('Create and delete event', async () => {
    // create and check returned event
    const theEvent = (await request.post('/events').send(eventData)).body;
    expect(theEvent._id).toBeDefined();
    expect(theEvent.title).toBe(eventData.title);
    expect(theEvent.description).toBe(eventData.description);
    expect(theEvent.startDate).toBe(eventData.startDate);
    expect(theEvent.endDate).toBe(eventData.endDate);
    expect(theEvent.interviewers[0].userId).toBe(eventData.eventCreator);

    // check that our created event exists in the creator's list of events
    const theCreator = (await request.get(`/users/${testUser._id}`)).body;
    expect(theCreator.events.some((e) => e.eventId === theEvent._id)).toBe(true);

    const res1 = await request.delete(`/events/${theEvent._id}`);
    expect(res1.status).toBe(204);
  });

  it('Get event by id', async () => {
    // create event
    const theEvent = (await request.post('/events').send(eventData)).body;

    // get event and check
    const fetchedEvent = (await request.get(`/events/${theEvent._id}`)).body;
    expect(JSON.stringify(fetchedEvent)).toBe(JSON.stringify(theEvent));

    const res1 = await request.delete(`/events/${theEvent._id}`);
    expect(res1.status).toBe(204);

    const invalidEvent = (await request.get('/events/123')).error;
    expect(invalidEvent.status).toBe(400);
    expect(invalidEvent.text).toBe('Invalid event id');
  });

  it('Get all events', async () => {
    const savedEvent1 = (await request.post('/events').send(eventData)).body;
    const savedEvent2 = (await request.post('/events').send(eventData)).body;

    const fetchedEvents = (await request.get('/events')).body;
    expect(fetchedEvents.some((event) => event._id === savedEvent1._id)).toBe(true);
    expect(fetchedEvents.some((event) => event._id === savedEvent2._id)).toBe(true);

    const res1 = await request.delete(`/events/${savedEvent1._id}`);
    const res2 = await request.delete(`/events/${savedEvent2._id}`);
    expect(res1.status).toBe(204);
    expect(res2.status).toBe(204);
  });

  it('Add interviewer / Get event interviewers', async () => {
    const theEvent = (await request.post('/events').send(eventData)).body;

    // make sure event creator is included in interviewers[]
    const fetchedInterviewers = (await request.get(`/events/${theEvent._id}/interviewers`)).body;
    expect(fetchedInterviewers[0].userId).toBe(eventData.eventCreator);

    // create another temp user to add to event
    const newInterviewer = await new User({
      name: 'new interviewer',
      email: 'new.interviewer@gmail.com',
    }).save();
    const a1 = await request.post(`/events/${theEvent._id}/interviewers`).send({ email: newInterviewer.email });
    expect(a1.body.message).toBe('1 user(s) added successfully');
    // add same interviewer again
    const a2 = await request.post(`/events/${theEvent._id}/interviewers`).send({ email: newInterviewer.email });
    expect(a2.body.message).toBe('0 user(s) added successfully');

    // make sure interviewers are in event
    const updatedInterviewers = (await request.get(`/events/${theEvent._id}/interviewers`)).body;
    expect(updatedInterviewers
      .some((interviewer) => interviewer.userId === eventData.eventCreator)).toBe(true);
    expect(updatedInterviewers
      .some((interviewer) => interviewer.userId === newInterviewer._id.toString())).toBe(true);

    // make sure event is in new interviewer
    const updatedNewInterviewer = (await request.get(`/users/${newInterviewer._id}`)).body;
    expect(updatedNewInterviewer.events
      .some((e) => e.eventId === theEvent._id)).toBe(true);

    // delete temp user
    const res = await request.delete(`/users/${newInterviewer._id}`);
    expect(res.status).toBe(204);

    const res2 = await request.delete(`/events/${theEvent._id}`);
    expect(res2.status).toBe(204);

    const invalidInterviewer = (await request.get('/events/123/interviewers')).error;
    expect(invalidInterviewer.status).toBe(400);
    expect(invalidInterviewer.text).toBe('Invalid event id');
  });

  it('Add interviewee / Get event interviewees', async () => {
    const theEvent = (await request.post('/events').send(eventData)).body;
    // create another temp user to add to event
    const newInterviewee = await new User({
      name: 'new interviewee',
      email: 'new.interviewee@gmail.com',
    }).save();
    const a1 = await request.post(`/events/${theEvent._id}/interviewees`).send({ email: newInterviewee.email });
    expect(a1.body.message).toBe('1 user(s) added successfully');
    // add same interviewee again
    const a2 = await request.post(`/events/${theEvent._id}/interviewees`).send({ email: newInterviewee.email });
    expect(a2.body.message).toBe('0 user(s) added successfully');

    // make sure new interviewee is in event
    const updatedInterviewees = (await request.get(`/events/${theEvent._id}/interviewees`)).body;
    expect(updatedInterviewees
      .some((interviewee) => interviewee.userId === newInterviewee._id.toString())).toBe(true);

    // make sure event is in new interviewee
    const updatedNewInterviewee = (await request.get(`/users/${newInterviewee._id}`)).body;
    expect(updatedNewInterviewee.events
      .some((e) => e.eventId === theEvent._id)).toBe(true);

    // delete temp user
    const res = await request.delete(`/users/${newInterviewee._id}`);
    expect(res.status).toBe(204);

    const res2 = await request.delete(`/events/${theEvent._id}`);
    expect(res2.status).toBe(204);

    const invalidInterviewee = (await request.get('/events/123/interviewees')).error;
    expect(invalidInterviewee.status).toBe(400);
    expect(invalidInterviewee.text).toBe('Invalid event id');
  });

  it('test availability/timeslot functionalities, deleteInterviwee/deleteInterviewer, interviewViewee/interviewVieweeRemove', async () => {
    const theEvent = (await request.post('/events').send(eventData)).body;
    const creatorAvailId = theEvent.interviewers[0]._id;
    // create another temp user to add to event (interviewer)
    const newInterviewer = await new User({
      name: 'new interviewer',
      email: 'new.interviewer@gmail.com',
    }).save();
    await request.post(`/events/${theEvent._id}/interviewers`).send({ email: newInterviewer.email });
    // create another temp user to add to event (interviewee)
    const newInterviewee = await new User({
      name: 'new interviewee',
      email: 'new.interviewee@gmail.com',
    }).save();
    await request.post(`/events/${theEvent._id}/interviewees`).send({ email: newInterviewee.email });

    // timeslots before anyone sets availability
    const avail = (await request.get(`/events/${theEvent._id}/timeslots`)).body;
    // adjust a couple to send as creator's avail
    avail[0].times[0] = true;
    avail[0].times[1] = true;
    avail[0].times[2] = true;
    avail[1].times[2] = true;
    avail[1].times[3] = true;

    await request.post(`/events/${theEvent._id}/availability`).send({ avail, availId: creatorAvailId });

    // check timeSlot compilation
    const timeSlots = (await request.get(`/events/${theEvent._id}/timeslots`)).body;
    const timeSlotsNoIds = timeSlots.map((t) => ({ times: t.times, date: t.date }));
    expect(JSON.stringify(timeSlotsNoIds)).toBe(JSON.stringify(expectedTimeSlots));

    // give the interviewee a time slot
    await request.post(`/events/${theEvent._id}/timeslot`).send({ userId: newInterviewee._id, timeChosen: '2021-02-17T00:10:00.000Z' });
    const updatedInterviewees = (await request.get(`/events/${theEvent._id}/interviewees`)).body;
    expect(updatedInterviewees
      .some((interviewee) => interviewee.userId === newInterviewee._id.toString() && interviewee.timeChosen === '2021-02-17T00:10:00.000Z')).toBe(true);

    // sign up newInterviewer to interview newInterviewee
    const intervieweeId = updatedInterviewees
      .find((interviewee) => interviewee.userId === newInterviewee._id.toString())._id;
    await request.post(`/events/${theEvent._id}/${intervieweeId}/interview`).send({ viewerid: newInterviewer._id });
    let updatedEvent = (await request.get(`/events/${theEvent._id}`)).body;
    let intervieweesViewers = updatedEvent.interviewees
      .find((i) => i.userId._id === newInterviewee._id.toString()).interviewers;
    expect(intervieweesViewers.some((ivr) => ivr._id === newInterviewer._id.toString())).toBe(true);

    // remove newInterviewer as an interviewer for new Interviewee
    await request.delete(`/events/${theEvent._id}/${intervieweeId}/interview`).send({ viewerid: newInterviewer._id });
    updatedEvent = (await request.get(`/events/${theEvent._id}`)).body;
    intervieweesViewers = updatedEvent.interviewees
      .find((i) => i.userId._id === newInterviewee._id.toString()).interviewers;
    expect(intervieweesViewers
      .some((ivr) => ivr._id === newInterviewer._id.toString())).toBe(false);

    // delete an interviewee from the event
    updatedEvent = (await request.delete(`/events/${theEvent._id}/interviewees`)
      .send({ userId: newInterviewee._id.toString() })).body;
    expect(updatedEvent.interviewees
      .some((interviewee) => interviewee.userId === newInterviewee._id.toString())).toBe(false);

    // delete an interviewer from the event
    updatedEvent = (await request.delete(`/events/${theEvent._id}/interviewers`)
      .send({ userId: newInterviewer._id.toString() })).body;
    expect(updatedEvent.interviewers
      .some((interviewer) => interviewer.userId === newInterviewer._id.toString())).toBe(false);

    // deletes
    const res = await request.delete(`/users/${newInterviewer._id}`);
    expect(res.status).toBe(204);
    const res2 = await request.delete(`/users/${newInterviewee._id}`);
    expect(res2.status).toBe(204);
    const res3 = await request.delete(`/events/${theEvent._id}`);
    expect(res3.status).toBe(204);
  });

  // TODO: updateEvent
  it('test updateEvent', async () => {
    const theEvent = (await request.post('/events').send(eventData)).body;
    expect(theEvent._id).toBeDefined();
    expect(theEvent.title).toBe(eventData.title);
    expect(theEvent.description).toBe(eventData.description);
    expect(theEvent.startDate).toBe(eventData.startDate);
    expect(theEvent.endDate).toBe(eventData.endDate);
    expect(theEvent.interviewers[0].userId).toBe(eventData.eventCreator);

    const newEvent = (await request.put(`/events/${theEvent._id}/update`).send(expectedUpdatedEvent)).body;
    expect(newEvent.event.title).toBe(expectedUpdatedEvent.title);
    expect(newEvent.event.description).toBe(expectedUpdatedEvent.description);
    expect(newEvent.event.startDate).toBe(expectedUpdatedEvent.startDate);
    expect(newEvent.event.endDate).toBe(expectedUpdatedEvent.endDate);
    expect(newEvent.event.interviewersNeeded).toBe(expectedUpdatedEvent.interviewersNeeded);

    const theCreator = (await request.get(`/users/${testUser._id}`)).body;
    expect(theCreator.events.some((e) => e.eventId === theEvent._id)).toBe(true);

    const res1 = await request.delete(`/events/${theEvent._id}`);
    expect(res1.status).toBe(204);
  });
});
