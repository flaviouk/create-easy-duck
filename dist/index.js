'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function defaultEqualityCheck(a, b) {
  return a === b;
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  var length = prev.length;
  for (var i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

function defaultMemoize(func) {
  var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;

  var lastArgs = null;
  var lastResult = null;
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments);
    }

    lastArgs = arguments;
    return lastResult;
  };
}

function getDependencies(funcs) {
  var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

  if (!dependencies.every(function (dep) {
    return typeof dep === 'function';
  })) {
    var dependencyTypes = dependencies.map(function (dep) {
      return typeof dep;
    }).join(', ');
    throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
  }

  return dependencies;
}

function createSelectorCreator(memoize) {
  for (var _len = arguments.length, memoizeOptions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    memoizeOptions[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      funcs[_key2] = arguments[_key2];
    }

    var recomputations = 0;
    var resultFunc = funcs.pop();
    var dependencies = getDependencies(funcs);

    var memoizedResultFunc = memoize.apply(undefined, [function () {
      recomputations++;
      // apply arguments instead of spreading for performance.
      return resultFunc.apply(null, arguments);
    }].concat(memoizeOptions));

    // If a selector is called with the exact same arguments we don't need to traverse our dependencies again.
    var selector = memoize(function () {
      var params = [];
      var length = dependencies.length;

      for (var i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments));
      }

      // apply arguments instead of spreading for performance.
      return memoizedResultFunc.apply(null, params);
    });

    selector.resultFunc = resultFunc;
    selector.dependencies = dependencies;
    selector.recomputations = function () {
      return recomputations;
    };
    selector.resetRecomputations = function () {
      return recomputations = 0;
    };
    return selector;
  };
}

var createSelector = createSelectorCreator(defaultMemoize);

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
  isLoading: false,
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
var createSelectors = function createSelectors(type, selectors) {
  var allSelector = createSelector(function (state) {
    return state[type] || state;
  }, function (root) {
    return root;
  });
  var payloadSelector = createSelector(allSelector, function (root) {
    return root.payload;
  });
  return _objectSpread({}, selectors, {
    getAll: allSelector,
    getIsLoading: createSelector(allSelector, function (root) {
      return root.isLoading;
    }),
    getPayload: payloadSelector,
    getPayloadData: createSelector(payloadSelector, function (payload) {
      return payload && payload.data ? payload.data : null;
    }),
    getError: createSelector(allSelector, function (root) {
      return root.error;
    })
  });
};
var createDuck = function createDuck(_ref) {
  var type = _ref.type,
      initialState = _ref.initialState,
      selectors = _ref.selectors,
      rest = _objectWithoutProperties(_ref, ["type", "initialState", "selectors"]);

  var action = createActionCreators(type);
  var reducer = createReducer(type, initialState);
  var duck = {
    type: type,
    action: action,
    reducer: reducer,
    selectors: createSelectors(type, selectors)
  };

  var getAsyncAction = function getAsyncAction(name, fn) {
    return function (props, callback) {
      return (
        /*#__PURE__*/
        function () {
          var _ref2 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(dispatch) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    dispatch(duck.action.start());
                    return _context.abrupt("return", fn(props).then(function (payload) {
                      if (callback) return callback(payload);
                      return name === 'get' && dispatch(duck.action.finish(payload));
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
            return _ref2.apply(this, arguments);
          };
        }()
      );
    };
  };

  Object.entries(rest).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        name = _ref4[0],
        value = _ref4[1];

    return duck.action[name] = getAsyncAction(name, value);
  });
  return duck;
};

exports.createTypes = createTypes;
exports.createActionCreators = createActionCreators;
exports.createReducer = createReducer;
exports.createSelectors = createSelectors;
exports.createDuck = createDuck;
//# sourceMappingURL=index.js.map
