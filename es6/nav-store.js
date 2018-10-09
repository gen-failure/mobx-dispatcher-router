import {action, observable} from 'mobx';
import Route from 'route-parser';

/**
 *  NavStore router is attached automatically to Dispatcher on initialization and it's responsible for routing functionality
 */
class NavStore {
  @observable path;
  constructor() {
    this.baseRoute = "";
    this.notFoundRoute = false;
    this.routes = new Map();
    this.pathObserver = window.onpopstate= () => {
      this._onPathChange();
    }
  }
  /**
   *  Dispatcher callback, check initial route and render appropriate page
   */
  onRouterStart() {
    this._onPathChange();
  }

  /**
   *  Event handler is called on path change
   */
  _onPathChange() {
    this.path = window.location.pathname;
    this._evaluatePath();
  }

  /**
   *  Add a new path to browser history and rerender the page
   *  
   * @param {String} path path to navigate
  */
  @action goTo(path) {
    window.history.pushState(null, null, path);
    this._onPathChange();
  }

  /**
   *  Change the current path without adding record to history
   *  
   *  @param {String} path new path 
   */
  @action changeTo(path) {
    window.history.replaceState(null, null, path);
    this._onPathChange();
  }

  /**
   *  add a new route to the router
   *
   *  @param {String} path a new path for the router
   *  @param {
   */
  addRoute(path, callback) {
    this.routes.set(new Route(`${this.baseRoute}${path}`), callback)
  }


  _evaluatePath() {
    console.log(this.routes);
    for (let [route,callback] of this.routes) {
      let match = route.match(this.path);
      if (match) return callback(match);
    }
    if (typeof this.notFoundRoute === 'string' ) return this.changeTo(this.notFoundRoute);
  }
}

export default NavStore
