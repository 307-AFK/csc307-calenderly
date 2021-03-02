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
  endDate: '2021-03-17T18:10:00.064Z',
  interviewersNeeded: 2,
  availabilityIncrement: 10,
};

describe('Test event endpoints', () => {
  let testUser;
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, {
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
    expect(theEvent.interviewersNeeded).toBe(eventData.interviewersNeeded);
    expect(theEvent.availabilityIncrement).toBe(eventData.availabilityIncrement);
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
    expect(a1.text).toBe('1 user(s) added successfully');
    // add same interviewer again
    const a2 = await request.post(`/events/${theEvent._id}/interviewers`).send({ email: newInterviewer.email });
    expect(a2.text).toBe('0 user(s) added successfully');

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
  });

  it('Add interviewee / Get event interviewees', async () => {
    const theEvent = (await request.post('/events').send(eventData)).body;

    // create another temp user to add to event
    const newInterviewee = await new User({
      name: 'new interviewee',
      email: 'new.interviewee@gmail.com',
    }).save();
    const a1 = await request.post(`/events/${theEvent._id}/interviewees`).send({ email: newInterviewee.email });
    expect(a1.text).toBe('1 user(s) added successfully');
    // add same interviewee again
    const a2 = await request.post(`/events/${theEvent._id}/interviewees`).send({ email: newInterviewee.email });
    expect(a2.text).toBe('0 user(s) added successfully');

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
  });
});
