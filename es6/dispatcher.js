import NavStore from "./nav-store";
import Route from "route-parser";

/**
 *  Dispatcher is a store management and functional router for mobx
 */
class Dispatcher {
  /**
   *  @param {Object} params
   *  @param {String} params.baseRoute prefix for application route. Empty string by default
   */
  constructor({ baseRoute = "" }) {
    /** @member {Object} */
    this.stores = {};
    this.attachStore(NavStore);
    this.stores.nav.baseRoute = baseRoute;
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
    if (Object.keys(this.stores).indexOf(storeName) !== -1)
      throw new Error(`store ${storeName} already exists, choose another one`);

    if (storeName !== "nav") {
      storeObject.stores = this.stores;

      storeObject.addRoute = (path, callback) => {
        this.stores.nav.addRoute(path, callback);
      };
    }

    this.stores[storeName] = storeObject;
    if (typeof this.stores[storeName].onAttach === "function")
      this.stores[storeName].onAttach();
  }
  /**
   * A method to call when all stores are attached. It renders the current path and call onRouterStart
   * callback for every attached router (if callback exists)
   */
  start() {
    Object.keys(this.stores).forEach(store => {
      if (typeof this.stores[store].onRouterStart === "function")
        this.stores[store].onRouterStart();
    });
  }

  /**
   *  Set page not found root for your application. If not specified, not existing routes are ignored
   *  @param {String} path
   */
  setNotFoundRoute(path) {
    this.stores.nav.notFoundRoute = path;
  }
}

export default Dispatcher;
