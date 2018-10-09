"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _class, _descriptor;

var _mobx = require("mobx");

var _routeParser = require("route-parser");

var _routeParser2 = _interopRequireDefault(_routeParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

/**
 *  NavStore router is attached automatically to Dispatcher on initialization and it's responsible for routing functionality
 */
let NavStore = (_class =
/*#__PURE__*/
function () {
  function NavStore() {
    _classCallCheck(this, NavStore);

    _initializerDefineProperty(this, "path", _descriptor, this);

    this.baseRoute = "";
    this.notFoundRoute = false;
    this.routes = new Map();

    this.pathObserver = window.onpopstate = () => {
      this._onPathChange();
    };
  }
  /**
   *  Dispatcher callback, check initial route and render appropriate page
   */


  _createClass(NavStore, [{
    key: "onRouterStart",
    value: function onRouterStart() {
      this._onPathChange();
    }
    /**
     *  Event handler is called on path change
     */

  }, {
    key: "_onPathChange",
    value: function _onPathChange() {
      this.path = window.location.pathname;

      this._evaluatePath();
    }
    /**
     *  Add a new path to browser history and rerender the page
     *  
     * @param {String} path path to navigate
    */

  }, {
    key: "goTo",
    value: function goTo(path) {
      window.history.pushState(null, null, path);

      this._onPathChange();
    }
    /**
     *  Change the current path without adding record to history
     *  
     *  @param {String} path new path 
     */

  }, {
    key: "changeTo",
    value: function changeTo(path) {
      window.history.replaceState(null, null, path);

      this._onPathChange();
    }
    /**
     *  add a new route to the router
     *
     *  @param {String} path a new path for the router
     *  @param {
     */

  }, {
    key: "addRoute",
    value: function addRoute(path, callback) {
      this.routes.set(new _routeParser2.default(`${this.baseRoute}${path}`), callback);
    }
  }, {
    key: "_evaluatePath",
    value: function _evaluatePath() {
      console.log(this.routes);

      for (let [route, callback] of this.routes) {
        let match = route.match(this.path);
        if (match) return callback(match);
      }

      if (typeof this.notFoundRoute === 'string') return this.changeTo(this.notFoundRoute);
    }
  }]);

  return NavStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "path", [_mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class.prototype, "goTo", [_mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "goTo"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeTo", [_mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "changeTo"), _class.prototype)), _class);
exports.default = NavStore;