"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _navStore = require("./nav-store");

var _navStore2 = _interopRequireDefault(_navStore);

var _routeParser = require("route-parser");

var _routeParser2 = _interopRequireDefault(_routeParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 *  Dispatcher is a store management and functional router for mobx
 */
let Dispatcher =
/*#__PURE__*/
function () {
  /**
   *  @param {String} baseRouter scope for application route. Empty string by default
   */
  function Dispatcher(baseRoute = "") {
    _classCallCheck(this, Dispatcher);

    /** @member {Object} */
    this.stores = {};
    this.attachStore(_navStore2.default);
    this.stores.nav.baseRoute = baseRoute;
  }
  /**
   *  @param {Class} StoreClass store class to attach
   *  @param {String} [name] name used to refer store
   *
   *
   */


  _createClass(Dispatcher, [{
    key: "attachStore",
    value: function attachStore(StoreClass, name) {
      let storeObject = new StoreClass();
      let storeName = "";

      if (typeof name === 'string' && name.length > 1) {
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
      if (Object.keys(this.stores).indexOf(storeName) !== -1) throw new Error(`store ${storeName} already exists, choose another one`);

      if (storeName !== 'nav') {
        storeObject.stores = this.stores;

        storeObject.navigateTo = path => {
          return this.stores.nav.goTo(path);
        };

        storeObject.changePath = path => {
          return this.stores.nav.changeTo(path);
        };

        storeObject.addRoute = (path, callback) => {
          this.stores.nav.addRoute(path, callback);
        };
      }

      this.stores[storeName] = storeObject;
      if (typeof this.stores[storeName].onAttach === 'function') this.stores[storeName].onAttach();
    }
    /**
     * A method to call when all stores are attached. It renders the current path and call onRouterStart
     * callback for every attached router (if callback exists)
     */

  }, {
    key: "start",
    value: function start() {
      Object.keys(this.stores).forEach(store => {
        if (typeof this.stores[store].onRouterStart === 'function') this.stores[store].onRouterStart();
      });
    }
    /**
     *  Set page not found root for your application. If not specified, not existing routes are ignored
     *  @param {String} path
     */

  }, {
    key: "setNotFoundRoute",
    value: function setNotFoundRoute(path) {
      this.stores.nav.notFoundRoute = path;
    }
  }]);

  return Dispatcher;
}();

exports.default = Dispatcher;