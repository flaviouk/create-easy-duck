'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

const createTypes = type => ({
  START: `${type}/START`,
  RESET: `${type}/RESET`,
  FINISH: `${type}/FINISH`,
  ERROR: `${type}/ERROR`
});
const createActionCreators = type => {
  const {
    START,
    RESET,
    FINISH,
    ERROR
  } = createTypes(type);
  return {
    start: () => ({
      type: START
    }),
    reset: () => ({
      type: RESET
    }),
    finish: payload => ({
      type: FINISH,
      payload
    }),
    error: error => ({
      type: ERROR,
      error: error && error.message || 'Something went wrong'
    })
  };
};
const INITIAL_STATE = {
  isLoading: false,
  error: null,
  payload: null
};
const createReducer = (type, initialState = {}) => (state = INITIAL_STATE, action = {}) => {
  const {
    START,
    FINISH,
    ERROR,
    RESET
  } = createTypes(type);
  const INITIAL = { ...INITIAL_STATE,
    ...initialState
  };

  switch (action.type) {
    case START:
      return {
        isLoading: true,
        error: null,
        payload: INITIAL.payload
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
        payload: INITIAL.payload
      };

    case RESET:
    default:
      return INITIAL;
  }
};
const createSelectors = (type, selectors) => {
  const allSelector = createSelector(state => state[type] || state, root => root);
  const payloadSelector = createSelector(allSelector, root => root.payload);
  return { ...selectors,
    getAll: allSelector,
    getIsLoading: createSelector(allSelector, root => root.isLoading),
    getPayload: payloadSelector,
    getPayloadData: createSelector(payloadSelector, payload => payload && payload.data ? payload.data : null),
    getError: createSelector(allSelector, root => root.error)
  };
};
const createDuck = ({
  type,
  initialState,
  selectors,
  ...rest
}) => {
  const action = createActionCreators(type);
  const reducer = createReducer(type, initialState);
  const duck = {
    type,
    action,
    reducer,
    selectors: createSelectors(type, selectors)
  };

  const getAsyncAction = (name, fn) => (props, callback) => async dispatch => {
    dispatch(duck.action.start());
    return fn(props).then(payload => {
      if (callback) return callback(payload);
      return name === 'get' && dispatch(duck.action.finish(payload));
    }).catch(error => dispatch(duck.action.error(error)));
  };

  Object.entries(rest).map(([name, value]) => duck.action[name] = getAsyncAction(name, value));
  return duck;
};

exports.createTypes = createTypes;
exports.createActionCreators = createActionCreators;
exports.createReducer = createReducer;
exports.createSelectors = createSelectors;
exports.createDuck = createDuck;
//# sourceMappingURL=index.js.map
