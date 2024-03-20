const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const emailUtils = require('../utils/email');

describe('Email Utils', () => {
  let transporterStub;

  beforeEach(() => {
    transporterStub = sinon.stub(emailUtils.transporter, 'sendMail');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should send email verification email', async () => {
    const email = 'testuser@example.com';
    const token = 'testtoken';
    const expectedMailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Click the following link to verify your email: http://example.com/verify-email?token=${token}`,
    };

    await emailUtils.sendEmailVerificationEmail(email, token);

    expect(transporterStub.calledOnce).to.be.true;
    expect(transporterStub.calledWith(expectedMailOptions)).to.be.true;
  });
});