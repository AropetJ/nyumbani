const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const rateLimit = require('express-rate-limit');
const loginLimiter = require('../utils/loginLimiter');

describe('Login Limiter Middleware', () => {
  let rateLimitStub;
  let req;
  let res;
  let next;

  beforeEach(() => {
    rateLimitStub = sinon.stub(rateLimit, 'RateLimit').returns(() => {});
    req = {};
    res = {};
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a rate limiter with the correct options', () => {
    loginLimiter(req, res, next);

    expect(rateLimitStub.calledOnce).to.be.true;
    expect(rateLimitStub.calledWithExactly({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: 'Too many failed login attempts. Please try again later.',
    })).to.be.true;
  });

  it('should call the rate limiter middleware', () => {
    loginLimiter(req, res, next);

    expect(next.calledOnce).to.be.true;
  });
});