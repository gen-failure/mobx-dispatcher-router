import { action, observable } from "mobx";
import Route from "route-parser";
import URLSearchParamsPolyfill from "url-search-params-polyfill";

/**
 *  NavStore router is attached automatically to Dispatcher on initialization and it's responsible for routing functionality
 */

class NavStore {
  @observable path = "";
  @observable query = "";

  constructor() {
    this.appPath = null;
    this.notFoundRoute = false;
    this.routes = new Map();
    this.routeObserver = window.onpopstate = () => {
      this._onRouteChange();
    };

    this.urlSearchParams = window.URLSearchParams || URLSearchParamsPolyfill;
  }
  /**
   *  Dispatcher callback, check initial route and render appropriate page
   */
  onRouterStart() {
    this._onRouteChange();
  }

  /**
   *  Event handler is called on path change
   */
  _onRouteChange() {
    this.path = window.location.pathname;
    this.query = window.location.search;

    this._evaluateRoute();
  }

  get _queryObject() {
    let query = {};

    let queryIterator = new this.urlSearchParams(this.query);
    for (let [param, value] of queryIterator.entries()) {
      switch (typeof query[param]) {
        case "object":
          query[param].push(value);
          break;
        case "string":
          query[param] = [query[param], value];
          break;
        case "undefined":
          query[param] = value;
          break;
        default:
          throw new Error("failed to parse parameters");
      }
      this.query = window.location.search;
    }

    return query;
  }

  /**
   *  Add a new path to browser history and rerender the page
   *
   * @param {String} path path to navigate
   */
  @action goTo(path) {
    this.appPath = path;
    window.history.pushState(
      null,
      null,
      `${this.baseRoute.getCurrent()}${path}`
    );
    this._onRouteChange();
  }

  /**
   *  Change the current path without adding record to history
   *
   *  @param {String} path new path
   */
  @action changeTo(path) {
    this.appPath = path;
    window.history.replaceState(
      null,
      null,
      `${this.baseRoute.getCurrent()}${path}`
    );
    this._onRouteChange();
  }

  /**
   *  add a new route to the router
   *
   *  @param {String} path a new path for the router
   *  @param {
   */
  addRoute(path, callback) {
    let newRoute = `${this.baseRoute.getPrototype()}${path}`;
    this.routes.set(new Route(newRoute), callback);
  }

  _evaluateRoute() {
    let r = this.appPath
      ? `${this.baseRoute.getCurrent()}${this.appPath}`
      : `${this.path}${this.query}`;
    for (let [route, callback] of this.routes) {
      let match = route.match(r);
      if (match) {
        Object.keys(match).forEach(key => {
          if (match[key] === undefined) delete match[key];
        });
        callback(match, this._queryObject);
        if (this.dispatcher) {
          this.dispatcher._routeChanged({
            params: match,
            query: this._queryObject,
            raw: this.currentPath
          });
        }
        return true;
      }
    }
    if (typeof this.notFoundRoute === "string")
      return this.changeTo(this.notFoundRoute);
  }

  get currentPath() {
    return `${this.path}${this.query}`;
  }
}
export default NavStore;
