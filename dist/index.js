'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

// interface DuckOptions {
//   type: Type
//   defaultPayload: any
//   [key: string]: (args: any) => void
// }
var createTypes = function (type) { return ({
    START: type + "/START",
    RESET: type + "/RESET",
    FINISH: type + "/FINISH",
    ERROR: type + "/ERROR",
}); };
var createActionCreators = function (type) {
    var _a = createTypes(type), START = _a.START, RESET = _a.RESET, FINISH = _a.FINISH, ERROR = _a.ERROR;
    return {
        start: function () { return ({ type: START }); },
        reset: function () { return ({ type: RESET }); },
        finish: function (payload) { return ({ type: FINISH, payload: payload }); },
        error: function (error) { return ({
            type: ERROR,
            error: (error && error.message) || 'Something went wrong',
        }); },
    };
};
var INITIAL_STATE = {
    status: {
        isLoading: false,
        isLoaded: false,
    },
    error: null,
    payload: null,
};
var createReducer = function (type, defaultPayload) {
    if (defaultPayload === void 0) { defaultPayload = null; }
    return function (state, action) {
        if (state === void 0) { state = INITIAL_STATE; }
        var _a = createTypes(type), START = _a.START, FINISH = _a.FINISH, ERROR = _a.ERROR, RESET = _a.RESET;
        switch (action.type) {
            case START:
                return {
                    status: { isLoading: true, isLoaded: false },
                    error: null,
                    payload: defaultPayload,
                };
            case FINISH:
                return {
                    status: { isLoading: false, isLoaded: true },
                    error: null,
                    payload: action.payload,
                };
            case ERROR:
                return {
                    status: { isLoading: false, isLoaded: true },
                    error: action.error,
                    payload: defaultPayload,
                };
            case RESET:
                return __assign({}, INITIAL_STATE, { payload: defaultPayload });
            default:
                return state;
        }
    };
};
var createSelectors = function (type) {
    var rootSelector = createSelector(function (state) { return state[type]; }, function (root) { return root; });
    var statusSelector = createSelector(rootSelector, function (root) { return root.status; });
    var payloadSelector = createSelector(rootSelector, function (root) { return root.payload; });
    return {
        getIsReady: createSelector(statusSelector, function (status) { return status.isLoaded && !status.isLoading; }),
        getStatus: statusSelector,
        getPayload: payloadSelector,
        getPayloadData: createSelector(payloadSelector, function (payload) { return (payload && payload.data ? payload.data : null); }),
        getError: createSelector(rootSelector, function (root) { return root.error; }),
    };
};
// export const createDuck = ({ type, defaultPayload, ...rest }: DuckOptions) => {
//   const action = createActionCreators(type)
//   const reducer = createReducer(type, defaultPayload)
//   const duck = {
//     type,
//     action,
//     reducer,
//     selectors: createSelectors(type),
//   }
//   const getAsyncAction = (name, fn) => (
//     props: any,
//     callback: (payload: Payload) => void,
//   ) => async (dispatch: (action: Action) => void) => {
//     dispatch(duck.action.start())
//     return fn(props)
//       .then(payload => {
//         if (callback) return callback(payload)
//         return name === 'get' && dispatch(duck.action.finish(payload))
//       })
//       .catch(error => dispatch(duck.action.error(error)))
//   }
//   Object.entries(rest).map(
//     ([name, value]) => (duck.action[name] = getAsyncAction(name, value)),
//   )
//   return duck
// }

exports.createTypes = createTypes;
exports.createActionCreators = createActionCreators;
exports.createReducer = createReducer;
exports.createSelectors = createSelectors;
//# sourceMappingURL=index.js.map
