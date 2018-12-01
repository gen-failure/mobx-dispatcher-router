import NavStore from "../es6/nav-store";
import BaseRoute from "../es6/base-route";
const { JSDOM } = require("jsdom");
const chai = require("chai");
const spies = require("chai-spies");

chai.use(spies);
const { expect, spy } = chai;
const DEFAULT_URL = "http://fake.url/";

describe("NavStore", function() {
  beforeEach(function() {
    delete global.window;
    let dom = new JSDOM("", {
      url: DEFAULT_URL
    });
    global.window = dom.window;
    dom.window.location.pathname = "/";
  });

  it("changes the route", function() {
    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute();
    expect(window.location.pathname).to.equal("/");
    expect(window.history.length).to.equal(1);
    navStore.changeTo("/test");
    expect(window.location.pathname).to.equal("/test");
    expect(window.history.length).to.equal(1);
  });

  it("navigates to the route", function() {
    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute();
    expect(window.location.pathname).to.equal("/");
    navStore.goTo("/test");
    expect(window.location.pathname).to.equal("/test");
    expect(window.history.length).to.equal(2);
  });

  it("uses static base route route when changingRoute", function() {
    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute("/prefix");
    expect(window.location.pathname).to.equal("/");
    navStore.changeTo("/test");
    expect(window.location.pathname).to.equal("/prefix/test");
    expect(window.history.length).to.equal(1);
  });

  it("uses static base route route when navigating to route", function() {
    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute("/prefix");
    expect(window.location.pathname).to.equal("/");
    navStore.goTo("/test");
    expect(window.location.pathname).to.equal("/prefix/test");
    expect(window.history.length).to.equal(2);
  });

  it("uses dynamic base route route when changingRoute", function() {
    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute("/prefix", function() {
      return "dynamic-prefix";
    });
    expect(window.location.pathname).to.equal("/");
    navStore.changeTo("/test");
    expect(window.location.pathname).to.equal("/dynamic-prefix/test");
    expect(window.history.length).to.equal(1);
  });

  it("uses dynamic base route route when navigating to route", function() {
    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute("prefix", function() {
      return "dynamic-prefix";
    });
    expect(window.location.pathname).to.equal("/");
    navStore.goTo("/test");
    expect(window.location.pathname).to.equal("/dynamic-prefix/test");
    expect(window.history.length).to.equal(2);
  });
  
  it("evaluates route", function() {
    let cbTriggered = false;

    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute();
    expect(window.location.pathname).to.equal("/");
    navStore.addRoute("/test", () => {
      cbTriggered = true;
    })
    navStore.goTo("/test");
    expect(window.history.length).to.equal(2);
    expect(cbTriggered).to.be.true;
  });
  
  it("evaluates route with parameters", function() {
    let params = {};

    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute();
    expect(window.location.pathname).to.equal("/");
    navStore.addRoute("/test/:number1/delimiter/:number2", (p) => {
      params = p;
    })
    navStore.goTo("/test/42/delimiter/1701");
    expect(window.history.length).to.equal(2);
    expect(Object.keys(params).length).to.be.equal(2);
    expect(params.number1).to.be.equal("42");
    expect(params.number2).to.be.equal("1701");
  });
  
  it("evaluates route with optional parameters", function() {
    let params = {};

    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute();
    expect(window.location.pathname).to.equal("/");
    navStore.addRoute("/test/:number1/delimiter/:number2(/break/:number3)", (p) => {
      params = p;
    })
    navStore.goTo("/test/42/delimiter/1701");
    expect(window.history.length).to.equal(2);
    expect(Object.keys(params).length).to.be.equal(2);
    expect(params.number1).to.be.equal("42");
    expect(params.number2).to.be.equal("1701");
    navStore.goTo("/test/42/delimiter/1701/break/666");
    expect(window.history.length).to.equal(3);
    expect(Object.keys(params).length).to.be.equal(3);
    expect(params.number1).to.be.equal("42");
    expect(params.number2).to.be.equal("1701");
    expect(params.number3).to.be.equal("666");
  });
  
  it("evaluates parameters in baseRoute", function() {
    let params = {};

    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute("/:prefix", function() {
      return '/dynamic';
    });
    expect(window.location.pathname).to.equal("/");
    navStore.addRoute("/test/:number", (p) => {
      params = p;
    })
    navStore.goTo("/test/42");
    expect(window.history.length).to.equal(2);
    expect(Object.keys(params).length).to.be.equal(2);
    expect(window.location.pathname).to.equal("/dynamic/test/42");
    expect(params.number).to.be.equal("42");
    expect(params.prefix).to.be.equal("dynamic");
  });
  
  it("evaluates optional parameters in baseRoute", function() {
    let params = {};
    let prefix = '';

    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute("(/:prefix)", function() {
      return prefix;
    });
    expect(window.location.pathname).to.equal("/");
    navStore.addRoute("/test/:number", (p) => {
      params = p;
    })
    navStore.goTo("/test/42");
    expect(window.history.length).to.equal(2);
    expect(Object.keys(params).length).to.be.equal(1);
    expect(window.location.pathname).to.equal("/test/42");
    expect(params.number).to.be.equal("42");
    prefix = '/dynamic';
    navStore.goTo("/test/24");
    expect(window.history.length).to.equal(3);
    expect(Object.keys(params).length).to.be.equal(2);
    expect(window.location.pathname).to.equal("/dynamic/test/24");
    expect(params.number).to.be.equal("24");
    expect(params.prefix).to.be.equal("dynamic");
  });
  it("evaluates query string correctly", function() {
    let params = {};

    const navStore = new NavStore();
    navStore.baseRoute = new BaseRoute();
    expect(window.location.pathname).to.equal("/");
    navStore.addRoute("/test", (p,q) => {
      params = q;
    })
    navStore.goTo("/test?a=1&a=2&a=3&b=test");
    expect(window.history.length).to.equal(2);
    expect(Object.keys(params).length).to.be.equal(2);
    expect(window.location.pathname).to.equal("/test");
    expect(params.a).to.be.an.instanceOf(Array);
    expect(typeof params.b).to.equal('string');
  });
});
