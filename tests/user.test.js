const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const User = require('../models/user');

const { expect } = chai;

describe('User Model', () => {
  let sandbox;

  before(() => {
    mongoose.connect('mongodb://localhost/testdb', { useNewUrlParser: true });
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    mongoose.connection.close();
  });

  it('should create a new user', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };

    const saveStub = sandbox.stub(User.prototype, 'save').resolves();

    const user = new User(userData);
    await user.save();

    expect(saveStub.calledOnce).to.be.true;
    expect(user.firstName).to.equal(userData.firstName);
    expect(user.lastName).to.equal(userData.lastName);
    expect(user.email).to.equal(userData.email);
    expect(user.password).to.equal(userData.password);
  });

  it('should retrieve a user by email', async () => {
    const email = 'johndoe@example.com';
    const findOneStub = sandbox.stub(User, 'findOne').resolves({ email });

    const user = await User.findByEmail(email);

    expect(findOneStub.calledOnceWith({ email })).to.be.true;
    expect(user.email).to.equal(email);
  });

  it('should update a user', async () => {
    const userId = '1234567890';
    const updateData = { firstName: 'Jane', lastName: 'Doe' };
    const updateStub = sandbox.stub(User, 'updateOne').resolves();

    await User.updateUser(userId, updateData);

    expect(updateStub.calledOnceWith({ _id: userId }, updateData)).to.be.true;
  });

  it('should delete a user', async () => {
    const userId = '1234567890';
    const deleteStub = sandbox.stub(User, 'deleteOne').resolves();

    await User.deleteUser(userId);

    expect(deleteStub.calledOnceWith({ _id: userId })).to.be.true;
  });
});