import Dispatcher from "../es6/dispatcher";

const jsdom = require("mocha-jsdom");
const chai = require("chai");
const spies = require("chai-spies");

chai.use(spies);
const { expect, spy } = chai;

const FakeStore = class {};

describe("Dispatcher", function() {
  jsdom({
    url: "http://fake.url"
  });

  before(function() {});

  it("has only nav store by default", function() {
    const dispatcher = new Dispatcher();
    expect(dispatcher.stores).to.be.an.instanceOf(Map);
    expect(dispatcher.stores.size).to.equal(1);
    expect(dispatcher.stores.get("nav")).to.not.be.undefined;
  });

  it("attaches store", function() {
    const dispatcher = new Dispatcher();
    dispatcher.attachStore(FakeStore);
    expect(dispatcher.stores.size).to.equal(2);
  });

  it("names attached store correctly", function() {
    const dispatcher = new Dispatcher();
    dispatcher.attachStore(FakeStore);
    dispatcher.attachStore(FakeStore, "G0NCULAT0R");
    expect(dispatcher.stores.get("fake")).to.be.an.instanceOf(FakeStore);
    expect(dispatcher.stores.get("G0NCULAT0R")).to.be.an.instanceOf(FakeStore);
  });

  it("includes references to stores map", function() {
    const dispatcher = new Dispatcher();
    dispatcher.attachStore(FakeStore);
    expect(dispatcher.stores.get("fake")).has.property("stores");
    expect(dispatcher.stores.get("fake").stores).to.equal(dispatcher.stores);
  });

  it("includes reference to nav store", function() {
    const dispatcher = new Dispatcher();
    dispatcher.attachStore(FakeStore);
    expect(dispatcher.stores.get("fake")).has.property("nav");
    expect(dispatcher.stores.get("nav")).to.equal(
      dispatcher.stores.get("fake").nav
    );
  });

  it("includes addRoute method", function() {
    const dispatcher = new Dispatcher();
    dispatcher.attachStore(FakeStore);
    expect(dispatcher.stores.get("fake")).has.property("addRoute");
  });

  it("addRoute method is working", function() {
    const dispatcher = new Dispatcher();
    dispatcher.attachStore(FakeStore);
    dispatcher.stores.get("fake").addRoute("/test", () => {
      return true;
    });
    expect(dispatcher.stores.get("nav").routes.size).to.equal(1);
  });

  it ("triggers route change event", function() {
    let called = true;
    const dispatcher = new Dispatcher();
    dispatcher.attachStore(FakeStore);
    dispatcher.onRouteChanged(
      () => {
        this.called = true;
      }
    );
    dispatcher.stores.get('nav').goTo('/test');
    expect(called).to.be.true;
    });

  //Can't really use spies here, because attachStore accepts class, not instance
  it("calls onAttach hook", function() {
    let called = false;
    const dispatcher = new Dispatcher();
    let FakerStore = class {
      onAttach() {
        called = true;
      }
    };
    dispatcher.attachStore(FakerStore);
    expect(called).to.be.true;
  });

  it("calls onRouterStart hook", function() {
    let called = false;
    const dispatcher = new Dispatcher();
    let FakerStore = class {
      onRouterStart() {
        called = true;
      }
    };
    dispatcher.attachStore(FakerStore);
    dispatcher.start();
    expect(called).to.be.true;
  });

});
