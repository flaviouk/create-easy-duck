import { createSelector } from 'reselect'
import createSagaMiddleware from 'redux-saga'
import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'

export const createTypes = type => ({
  START: `${type}/START`,
  RESET: `${type}/RESET`,
  FINISH: `${type}/FINISH`,
  ERROR: `${type}/ERROR`,
})

export const createActionCreators = type => {
  const { START, RESET, FINISH, ERROR } = createTypes(type)

  return {
    start: () => ({ type: START }),
    reset: () => ({ type: RESET }),
    finish: payload => ({ type: FINISH, payload }),
    error: error => ({
      type: ERROR,
      error: (error && error.message) || 'Something went wrong',
    }),
  }
}

const INITIAL_STATE = {
  isLoading: true,
  error: null,
  payload: null,
}

export const createReducer = (type, initialState = INITIAL_STATE) => (
  state,
  action = {},
) => {
  const { START, FINISH, ERROR, RESET } = createTypes(type)

  switch (action.type) {
    case START:
      return {
        isLoading: true,
        error: null,
        payload: initialState.payload,
      }

    case FINISH:
      return {
        isLoading: false,
        error: null,
        payload: action.payload,
      }

    case ERROR:
      return {
        isLoading: false,
        error: action.error,
        payload: initialState.payload,
      }

    case RESET:
      return initialState

    default:
      return state || initialState
  }
}

export const createSelectors = (type, selector = {}) => {
  const allSelector = createSelector(
    state => state[type] || state,
    root => root,
  )
  const payloadSelector = createSelector(
    allSelector,
    root => root.payload,
  )

  return {
    ...selector,
    getAll: allSelector,
    getIsLoading: createSelector(
      allSelector,
      root => root.isLoading,
    ),
    getPayload: payloadSelector,
    getPayloadData: createSelector(
      payloadSelector,
      payload => (payload && payload.data ? payload.data : null),
    ),
    getError: createSelector(
      allSelector,
      root => root.error,
    ),
  }
}

export const createDuck = (options = {}) => {
  const duck = {
    type: options.type,
    action: createActionCreators(options.type),
    reducer: createReducer(options.type, options.initialState),
    selector: createSelectors(options.type, options.selector),
  }

  const getAsyncAction = fn => (
    props,
    callback = duck.action.finish,
  ) => async dispatch => {
    dispatch(duck.action.start())

    return fn(props)
      .then(payload => {
        if (callback) dispatch(callback(payload))
        return payload
      })
      .catch(error => dispatch(duck.action.error(error)))
  }

  Object.entries(options.action || {}).map(
    ([name, fn]) => (duck.action[name] = getAsyncAction(fn)),
  )

  if (options.getSelectors) {
    duck.selector = {
      ...duck.selector,
      ...options.getSelectors(duck.selector),
    }
  }

  return duck
}

export const createEasyStore = ({
  reducer = state => state,
  middlewares = [],
  saga,
  name,
}) => {
  const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          name,
          serialize: true,
        })
      : compose

  const sagaMiddleware = saga && createSagaMiddleware()

  const allMiddlewares = [thunk, ...middlewares]

  if (sagaMiddleware) allMiddlewares.push(sagaMiddleware)

  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...allMiddlewares)),
  )

  if (sagaMiddleware) sagaMiddleware.run(saga)

  return store
}
