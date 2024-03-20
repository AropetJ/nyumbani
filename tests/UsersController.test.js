const chai = require('chai');
const sinon = require('sinon');
const app = require('express')();
const UsersController = require('../controllers/UsersController');

const { expect } = chai;

describe('Routes', () => {
  beforeEach(() => {
    sinon.restore();
  });

  it('should register a user', () => {
    const registerMeStub = sinon.stub(UsersController, 'registerMe');
    const req = { body: { username: 'testuser', password: 'testpassword' } };
    const res = {};

    app.post('/register', (req, res) => {
      UsersController.registerMe(req, res);
      expect(registerMeStub.calledOnceWith(req, res)).to.be.true;
    });

    chai.request(app)
      .post('/register')
      .send(req.body)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.deep.equal({ message: 'Account created successfully' });
      });
  });

  it('should login a user', () => {
    const loginMeStub = sinon.stub(UsersController, 'loginMe');
    const req = { body: { email: 'testuser@example.com', password: 'testpassword' } };
    const res = {};

    app.post('/login', (req, res) => {
      UsersController.loginMe(req, res);
      expect(loginMeStub.calledOnceWith(req, res)).to.be.true;
    });

    chai.request(app)
      .post('/login')
      .send(req.body)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
      });
  });

  it('should request password reset', () => {
    const requestPasswordResetStub = sinon.stub(UsersController, 'requestPasswordReset');
    const req = { body: { email: 'testuser@example.com' } };
    const res = {};

    app.post('/reset-password-request', (req, res) => {
      UsersController.requestPasswordReset(req, res);
      expect(requestPasswordResetStub.calledOnceWith(req, res)).to.be.true;
    });

    chai.request(app)
      .post('/reset-password-request')
      .send(req.body)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: 'Password reset email sent' });
      });
  });

  it('should reset password', () => {
    const passwordResetStub = sinon.stub(UsersController, 'passwordReset');
    const req = { body: { token: 'testtoken', password: 'newpassword' } };
    const res = {};

    app.post('/reset-password', (req, res) => {
      UsersController.passwordReset(req, res);
      expect(passwordResetStub.calledOnceWith(req, res)).to.be.true;
    });

    chai.request(app)
      .post('/reset-password')
      .send(req.body)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: 'Password reset successful' });
      });
  });

  it('should request email verification', () => {
    const requestEmailVerificationStub = sinon.stub(UsersController, 'requestEmailVerification');
    const req = { body: { email: 'testuser@example.com' } };
    const res = {};

    app.post('/email-verification-request', (req, res) => {
      UsersController.requestEmailVerification(req, res);
      expect(requestEmailVerificationStub.calledOnceWith(req, res)).to.be.true;
    });

    chai.request(app)
      .post('/email-verification-request')
      .send(req.body)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: 'Email verification email sent' });
      });
  });

  it('should verify email', () => {
    const verifyEmailStub = sinon.stub(UsersController, 'verifyEmail');
    const req = { body: { token: 'testtoken' } };
    const res = {};

    app.post('/verify-email', (req, res) => {
      UsersController.verifyEmail(req, res);
      expect(verifyEmailStub.calledOnceWith(req, res)).to.be.true;
    });

    chai.request(app)
      .post('/verify-email')
      .send(req.body)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: 'Email verification successful' });
      });
  });
});