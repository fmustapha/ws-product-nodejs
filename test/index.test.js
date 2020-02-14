const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");

const { expect } = chai;
chai.use(chaiHttp);

describe("Server", () => {
  it("welcomes user to the EQ Works API", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equals("Welcome to EQ Works 😎");
        done();
      });
  });

  it("gets hourly events", done => {
    chai
      .request(app)
      .get("/events/hourly")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array')
        done();
      });
  });

  it("gets daily events", done => {
    chai
      .request(app)
      .get("/events/daily")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array')
        done();
      });
  });

  it("gets daily events", done => {
    chai
      .request(app)
      .get("/events/daily")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').that.has.lengthOf(7);
        done();
      });
  });

  it("gets hourly stats", done => {
    chai
      .request(app)
      .get("/stats/hourly")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it("gets daily stats", done => {
    chai
      .request(app)
      .get("/stats/daily")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').that.has.lengthOf(7);
        done();
      });
  });

  it("gets poi", done => {
    chai
      .request(app)
      .get("/poi")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').that.has.lengthOf(4)
        done();
      });
  });
  
  it("gets poi details", done => {
    chai
      .request(app)
      .get("/poi/details")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').that.has.lengthOf(20)
        done();
      });
  });
});
