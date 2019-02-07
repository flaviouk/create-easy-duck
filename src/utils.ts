import { createSelector } from 'reselect'

import * as d from './typings/utils'

export const createTypes = (type: d.Action.type): d.Types => ({
  START: `${type}/START`,
  RESET: `${type}/RESET`,
  FINISH: `${type}/FINISH`,
  ERROR: `${type}/ERROR`,
})

export const createActionCreators = (type: d.Action.type) => {
  const { START, RESET, FINISH, ERROR } = createTypes(type)

  return {
    start: (): d.Action => ({ type: START }),
    reset: (): d.Action => ({ type: RESET }),
    finish: (payload: any): Action => ({ type: FINISH, payload }),
    error: (error: { message: string }): Action => ({
      type: ERROR,
      error: error.message,
    }),
  }
}

const INITIAL_STATE = {
  status: {
    isLoading: false,
    isLoaded: false,
  },
  error: null,
  payload: null,
}

export const createReducer = (type: d.Action.type, defaultPayload = null) => (
  state = INITIAL_STATE,
  action: d.Action,
): d.ReducerState => {
  const { START, FINISH, ERROR, RESETT } = createTypes(type)

  switch (action.type) {
    case START:
      return {
        status: { isLoading: true, isLoaded: false },
        error: null,
        payload: defaultPayload,
      }

    case FINISH:
      return {
        status: { isLoading: false, isLoaded: true },
        error: null,
        payload: action.payload,
      }

    case ERROR:
      return {
        status: { isLoading: false, isLoaded: true },
        error: action.error,
        payload: defaultPayload,
      }

    case RESET:
      return { ...INITIAL_STATE, payload: defaultPayload }

    default:
      return state
  }
}

const createSelectors = type => {
  const rootSelector = createSelector(
    state => state[type],
    root => root,
  )
  const statusSelector = createSelector(
    rootSelector,
    root => root.status,
  )
  const payloadSelector = createSelector(
    rootSelector,
    root => root.payload,
  )

  return {
    getIsReady: createSelector(
      statusSelector,
      status => status.isLoaded && !status.isLoading,
    ),
    getStatus: statusSelector,
    getPayload: payloadSelector,
    getPayloadData: createSelector(
      payloadSelector,
      payload => get(payload, 'data', null),
    ),
    getError: createSelector(
      rootSelector,
      root => root.error,
    ),
  }
}

export const createDuck = ({ type, defaultPayload, ...rest }) => {
  const action = createActionCreators(type)
  const reducer = createReducer(
    type,
    defaultPayload || api ? { data: null } : null,
  )

  const duck = {
    type,
    action,
    reducer,
    selectors: createSelectors(type),
  }

  const getAsyncAction = (method, fn) => (
    props,
    callback,
  ) => async dispatch => {
    dispatch(duck.action.start())

    return fn(props)
      .then(payload => {
        if (callback) return callback(payload)
        return method === 'get' && dispatch(duck.action.finish(payload))
      })
      .catch(error => dispatch(duck.action.error(error)))
  }
  ;['get', 'put', 'post', 'patch', 'delete'].forEach(method => {
    const fn = rest[method]
    // If method exists
    if (fn) duck.action[method] = getAsyncAction(method, fn)
  })

  return duck
}
