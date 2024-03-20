const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const router = require('../routes/router');
const server = require('../server');

describe('Server', () => {
  let app;
  let useStub;

  beforeEach(() => {
    app = {
      use: () => {},
    };
    useStub = sinon.stub(app, 'use');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should use the router middleware', () => {
    server(app);

    expect(useStub.calledOnce).to.be.true;
    expect(useStub.calledWithExactly('/', router)).to.be.true;
  });
});