class BaseRoute {
  constructor(prototypeRoute = "", currentRoute) {
    this.prototypeRoute = prototypeRoute;
    this.currentRoute = currentRoute;
  }

  getPrototype() {
    return this.prototypeRoute;
  }

  getCurrent() {
    if (typeof this.currentRoute === "function") return this.currentRoute();
    return this.prototypeRoute;
  }
}

export default BaseRoute;
