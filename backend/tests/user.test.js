const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');

const request = supertest(app);
const User = require('../models/User');

const userData = new User({
  email: 'test.user@gmail.com',
  name: 'Test User',
  picture: 'pictureString',
  googleId: 'googleIdString',
  secret: 'secretString',
});

describe('Test user endpoints', () => {
  let testUser;
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }).then(() => console.log('Connected to MongoDB'));
    testUser = await userData.save(); // no createUser endpoint to test, so we'll make one here
  });

  afterAll(async () => {
    await request.delete(`/users/${testUser._id}`);
    await mongoose.connection.close();
  });

  it('Get user, get users, delete user', async () => {
    const res1 = await request.get(`/users/${testUser._id}`);
    const user1 = res1.body;
    expect(JSON.stringify(user1)).toBe(JSON.stringify(testUser));

    // make a second temporary user so getUsers is meaningful and
    // we have a user to delete
    const testUser2 = await userData.save();
    const res2 = await request.get('/users');
    const users = res2.body;
    expect(users.some((user) => user._id.toString() === testUser._id.toString())).toBe(true);
    expect(users.some((user) => user._id.toString() === testUser2._id.toString())).toBe(true);

    const res3 = await request.delete(`/users/${testUser2._id}`);
    expect(res3.status).toBe(204);
  });
});
