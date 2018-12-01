import NavStore from "./nav-store";
import Route from "route-parser";
import BaseRoute from "./base-route";

/**
 *  Dispatcher is a store management and functional router for mobx
 */
class Dispatcher {
  /**
   *  @param {Object} params
   *  @param {BaseRoute} params.baseRoute prefix for application route. Empty string by default
   */
  constructor(params = { baseRoute: null }) {
    /** @member {Object} */
    if (params.baseRoute instanceof BaseRoute) {
      this.baseRoute = params.baseRoute;
    } else {
      this.baseRoute = new BaseRoute("");
    }
    this.stores = new Map();
    this.attachStore(NavStore);
    this.stores.get("nav").baseRoute = this.baseRoute;
    this.routeChangeCallbacks = [];
  }
  /**
   *  @param {Class} StoreClass store class to attach
   *  @param {String} [name] name used to refer store
   *
   */
  attachStore(StoreClass, name) {
    let storeObject = new StoreClass();
    let storeName = "";
    if (typeof name === "string" && name.length > 1) {
      storeName = name;
    } else {
      let nameMatch = StoreClass.name.match(/(.+)Store$/);
      if (nameMatch) {
        storeName = nameMatch[1];
      } else {
        storeName = StoreClass.name;
      }
      storeName = storeName.charAt(0).toLowerCase() + storeName.substr(1);
    }

    if (storeName.length === 0) throw new Error("Store name can't be empty!");
    if (this.stores.get(storeName) !== undefined)
      throw new Error(`store ${storeName} already exists, choose another one`);

    if (storeName !== "nav") {
      storeObject.stores = this.stores;

      storeObject.nav = this.stores.get("nav"); // Just a shortcut

      storeObject.addRoute = (path, callback) => {
        this.stores.get("nav").addRoute(path, callback);
      };
    } else {
      storeObject.dispatcher = this;
    }

    this.stores.set(storeName, storeObject);
    if (typeof this.stores.get(storeName).onAttach === "function")
      this.stores.get(storeName).onAttach();
  }

  /**
   * A method to call when all stores are attached. It renders the current path and call onRouterStart
   * callback for every attached router (if callback exists)
   */
  start() {
    this.stores.forEach(store => {
      if (typeof store.onRouterStart === "function") store.onRouterStart();
    });
  }

  /**
   *  Set page not found root for your application. If not specified, not existing routes are ignored
   *  @param {String} path
   */
  setNotFoundRoute(path) {
    this.stores.nav.notFoundRoute = path;
  }

  onRouteChanged(fn) {
    this.routeChangeCallbacks.push(fn);
  }

  _routeChanged(routeObject) {
    this.routeChangeCallbacks.forEach(cb => {
      cb(routeObject);
    });
  }
}

export default Dispatcher;
