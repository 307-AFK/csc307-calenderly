const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');

const request = supertest(app);
const User = require('../models/User');

const userData = new User({
  email: 'test.user2@gmail.com',
  name: 'Test User',
  picture: 'pictureString',
  googleId: 'googleIdString',
  secret: 'secretString',
});

const eventData = {
  title: 'foo',
  description: 'bar',
  startDate: '2021-02-17T18:10:00.064Z',
  endDate: '2021-03-17T18:10:00.064Z',
  interviewersNeeded: 2,
  availabilityIncrement: 10,
};

describe('Test user endpoints', () => {
  let testUser;
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }).then(() => console.log('Connected to MongoDB'));
    testUser = await userData.save(); // no createUser endpoint to test, so we'll make one here
    eventData.eventCreator = testUser._id.toString();
  });

  afterAll(async () => {
    await request.delete(`/users/${testUser._id}`);
    await mongoose.connection.close();
  });

  it('Get user, get users, delete user', async () => {
    // Test get user
    const user1 = (await request.get(`/users/${testUser._id}`)).body;
    expect(JSON.stringify(user1)).toBe(JSON.stringify(testUser));

    // make a second temporary user so getUsers is meaningful and
    // we have a user to delete
    const testUser2 = await new User({
      email: 'test.user3@gmail.com',
      name: 'Test User 2',
    }).save();
    const users = (await request.get('/users')).body;
    expect(users.some((user) => user._id.toString() === testUser._id.toString())).toBe(true);
    expect(users.some((user) => user._id.toString() === testUser2._id.toString())).toBe(true);

    // make sure testUser2 is deleted successfully
    const res = await request.delete(`/users/${testUser2._id}`);
    expect(res.status).toBe(204);
  });

  it('Get user events', async () => {
    // create event (testUser is creator)
    const theEvent = (await request.post('/events').send(eventData)).body;

    // make a new user and add to the event
    const newInterviewer = await new User({
      name: 'new interviewer',
      email: 'new.interviewer1@gmail.com',
    }).save();
    const postMessage = (await request.post(`/events/${theEvent._id}/interviewers`).send({ email: newInterviewer.email })).body.message;
    expect(postMessage).toBe('1 user(s) added successfully');

    // make sure the event is in testUser's and newInterviewer's events[]
    // get latest
    const testUserEvents = (await request.get(`/users/${testUser._id}/events`)).body;
    const newInterviewerEvents = (await request.get(`/users/${newInterviewer._id}/events`)).body;
    // check
    expect(testUserEvents
      .some((event) => event.eventId === theEvent._id.toString())).toBe(true);
    expect(newInterviewerEvents
      .some((event) => event.eventId === theEvent._id.toString())).toBe(true);

    // delete newInterviewer
    const res = await request.delete(`/users/${newInterviewer._id}`);
    expect(res.status).toBe(204);

    // delete theEvent
    const res2 = await request.delete(`/events/${theEvent._id}`);
    expect(res2.status).toBe(204);
  });

  it('Get user\'s events as interviewer and as interviewee', async () => {
    // create two events (testUser is creator for each)
    const eventAsInterviewer = (await request.post('/events').send(eventData)).body;
    const eventAsInterviewee = (await request.post('/events').send(eventData)).body;

    // make a new user and add to the events as interviewee and interviewer, respectively
    const newUser = await new User({
      name: 'new user',
      email: 'new.user1@gmail.com',
    }).save();
    const postMessage = (await request.post(`/events/${eventAsInterviewer._id}/interviewers`)
      .send({ email: newUser.email })).body.message;
    expect(postMessage).toBe('1 user(s) added successfully');
    const postMessage2 = (await request.post(`/events/${eventAsInterviewee._id}/interviewees`)
      .send({ email: newUser.email })).body.message;
    expect(postMessage2).toBe('1 user(s) added successfully');

    // make sure newUser's list of events is correct
    // get latest
    // note: .map extracts event info from eventId (which was populated in the backend)
    const usersEventsAsInterviewee = (await request.get(`/users/${newUser._id}/events/interviewee`)).body.map((e) => e.eventId);
    const usersEventsAsInterviewer = (await request.get(`/users/${newUser._id}/events/interviewer`)).body.map((e) => e.eventId);
    // check
    expect(usersEventsAsInterviewee.some((e) => e._id === eventAsInterviewee._id)).toBe(true);
    expect(usersEventsAsInterviewer.some((e) => e._id === eventAsInterviewer._id)).toBe(true);

    // delete newUser
    const res = await request.delete(`/users/${newUser._id}`);
    expect(res.status).toBe(204);

    // delete the events
    const res2 = await request.delete(`/events/${eventAsInterviewer._id}`);
    expect(res2.status).toBe(204);
    const res3 = await request.delete(`/events/${eventAsInterviewee._id}`);
    expect(res3.status).toBe(204);
  });

  // --- error testing ---
  it('Get user, get users (error testing)', async () => {
    // Test get user errors
    const noUser = (await request.get('/users/ffffffffffffffffffffffff')).error;
    expect(noUser.status).toBe(404);
    expect(noUser.text).toBe('User not found');
    const invalidIdUser = (await request.get('/users/invalid_id')).error;
    expect(invalidIdUser.status).toBe(400);
    expect(invalidIdUser.text).toBe('Invalid user id');
  });

  // /:userid/events
  it('Get user events, get user events by role (error testing)', async () => {
    // Test get user events errors
    const noUser = (await request.get('/users/ffffffffffffffffffffffff/events')).error;
    expect(noUser.status).toBe(404);
    expect(noUser.text).toBe('User not found');
    const invalidIdUser = (await request.get('/users/invalid_id/events')).error;
    expect(invalidIdUser.status).toBe(400);
    expect(invalidIdUser.text).toBe('Invalid user id');

    // Test get user events by role errors
    const invalidIdUser2 = (await request.get('/users/invalid_id/events/interviewer')).error;
    expect(invalidIdUser2.status).toBe(400);
    expect(invalidIdUser2.text).toBe('Invalid user id');
    const invalidIdUser3 = (await request.get('/users/invalid_id/events/interviewee')).error;
    expect(invalidIdUser3.status).toBe(400);
    expect(invalidIdUser3.text).toBe('Invalid user id');
  });
});
