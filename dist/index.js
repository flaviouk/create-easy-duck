'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var reselect = require('reselect');
var createSagaMiddleware = _interopDefault(require('redux-saga'));
var redux = require('redux');
var thunk = _interopDefault(require('redux-thunk'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var createTypes = function createTypes(type) {
  return {
    START: "".concat(type, "/START"),
    RESET: "".concat(type, "/RESET"),
    FINISH: "".concat(type, "/FINISH"),
    ERROR: "".concat(type, "/ERROR")
  };
};
var createActionCreators = function createActionCreators(type) {
  var _createTypes = createTypes(type),
      START = _createTypes.START,
      RESET = _createTypes.RESET,
      FINISH = _createTypes.FINISH,
      ERROR = _createTypes.ERROR;

  return {
    start: function start() {
      return {
        type: START
      };
    },
    reset: function reset() {
      return {
        type: RESET
      };
    },
    finish: function finish(payload) {
      return {
        type: FINISH,
        payload: payload
      };
    },
    error: function error(_error) {
      return {
        type: ERROR,
        error: _error && _error.message || 'Something went wrong'
      };
    }
  };
};
var INITIAL_STATE = {
  isLoading: true,
  error: null,
  payload: null
};
var createReducer = function createReducer(type) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INITIAL_STATE;
  return function (state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _createTypes2 = createTypes(type),
        START = _createTypes2.START,
        FINISH = _createTypes2.FINISH,
        ERROR = _createTypes2.ERROR,
        RESET = _createTypes2.RESET;

    switch (action.type) {
      case START:
        return {
          isLoading: true,
          error: null,
          payload: initialState.payload
        };

      case FINISH:
        return {
          isLoading: false,
          error: null,
          payload: action.payload
        };

      case ERROR:
        return {
          isLoading: false,
          error: action.error,
          payload: initialState.payload
        };

      case RESET:
        return initialState;

      default:
        return state || initialState;
    }
  };
};
var createSelectors = function createSelectors(type) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var allSelector = reselect.createSelector(function (state) {
    return state[type] || state;
  }, function (root) {
    return root;
  });
  var payloadSelector = reselect.createSelector(allSelector, function (root) {
    return root.payload;
  });
  return _objectSpread({}, selector, {
    getAll: allSelector,
    getIsLoading: reselect.createSelector(allSelector, function (root) {
      return root.isLoading;
    }),
    getPayload: payloadSelector,
    getPayloadData: reselect.createSelector(payloadSelector, function (payload) {
      return payload && payload.data ? payload.data : null;
    }),
    getError: reselect.createSelector(allSelector, function (root) {
      return root.error;
    })
  });
};
var createDuck = function createDuck() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var duck = {
    type: options.type,
    action: createActionCreators(options.type),
    reducer: createReducer(options.type, options.initialState),
    selector: createSelectors(options.type, options.selector)
  };

  var getAsyncAction = function getAsyncAction(fn) {
    return function (props) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : duck.action.finish;
      return (
        /*#__PURE__*/
        function () {
          var _ref = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(dispatch) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    dispatch(duck.action.start());
                    return _context.abrupt("return", fn(props).then(function (payload) {
                      if (callback) dispatch(callback(payload));
                      return payload;
                    }).catch(function (error) {
                      return dispatch(duck.action.error(error));
                    }));

                  case 2:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }()
      );
    };
  };

  Object.entries(options.action || {}).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        name = _ref3[0],
        fn = _ref3[1];

    return duck.action[name] = getAsyncAction(fn);
  });

  if (options.getSelectors) {
    duck.selector = _objectSpread({}, duck.selector, options.getSelectors(duck.selector));
  }

  if (options.getActions) {
    duck.action = _objectSpread({}, duck.action, options.getActions(duck.action));
  }

  return duck;
};
var createEasyStore = function createEasyStore(_ref4) {
  var _ref4$reducer = _ref4.reducer,
      reducer = _ref4$reducer === void 0 ? function (state) {
    return state;
  } : _ref4$reducer,
      _ref4$middlewares = _ref4.middlewares,
      middlewares = _ref4$middlewares === void 0 ? [] : _ref4$middlewares,
      saga = _ref4.saga,
      name = _ref4.name;
  var composeEnhancers = (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    name: name,
    serialize: true
  }) : redux.compose;
  var sagaMiddleware = saga && createSagaMiddleware();
  var allMiddlewares = [thunk].concat(_toConsumableArray(middlewares));
  if (sagaMiddleware) allMiddlewares.push(sagaMiddleware);
  var store = redux.createStore(reducer, composeEnhancers(redux.applyMiddleware.apply(void 0, _toConsumableArray(allMiddlewares))));
  if (sagaMiddleware) sagaMiddleware.run(saga);
  return store;
};

exports.createTypes = createTypes;
exports.createActionCreators = createActionCreators;
exports.createReducer = createReducer;
exports.createSelectors = createSelectors;
exports.createDuck = createDuck;
exports.createEasyStore = createEasyStore;
//# sourceMappingURL=index.js.map
