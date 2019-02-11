import { createSelector } from 'reselect'

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
  isLoading: false,
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

export const createSelectors = (type, selectors) => {
  const allSelector = createSelector(
    state => state[type] || state,
    root => root,
  )
  const payloadSelector = createSelector(
    allSelector,
    root => root.payload,
  )

  return {
    ...selectors,
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

export const createDuck = ({ type, initialState, selectors, ...rest }) => {
  const action = createActionCreators(type)
  const reducer = createReducer(type, initialState)

  const duck = {
    type,
    action,
    reducer,
    selectors: createSelectors(type, selectors),
  }

  const getAsyncAction = (name, fn) => (props, callback) => async dispatch => {
    dispatch(duck.action.start())

    return fn(props)
      .then(payload => {
        if (callback) return callback(payload)
        return name === 'get' && dispatch(duck.action.finish(payload))
      })
      .catch(error => dispatch(duck.action.error(error)))
  }

  Object.entries(rest).map(
    ([name, value]) => (duck.action[name] = getAsyncAction(name, value)),
  )

  return duck
}
