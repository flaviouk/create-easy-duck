import { createSelector } from 'reselect'

type Type = string
type Payload = any
type ErrorMessage = any

interface Types {
  START: string
  RESET: string
  FINISH: string
  ERROR: string
}

interface Action {
  type: Type
  payload?: Payload
  error?: ErrorMessage
}

interface ReducerState {
  status: {
    isLoading: boolean
    isLoaded: boolean
  }
  error: null
  payload: null
}

// interface DuckOptions {
//   type: Type
//   defaultPayload: any
//   [key: string]: (args: any) => void
// }

export const createTypes = (type: Type): Types => ({
  START: `${type}/START`,
  RESET: `${type}/RESET`,
  FINISH: `${type}/FINISH`,
  ERROR: `${type}/ERROR`,
})

export const createActionCreators = (type: Type) => {
  const { START, RESET, FINISH, ERROR } = createTypes(type)

  return {
    start: (): Action => ({ type: START }),
    reset: (): Action => ({ type: RESET }),
    finish: (payload: Payload): Action => ({ type: FINISH, payload }),
    error: (error: { message: ErrorMessage }): Action => ({
      type: ERROR,
      error: (error && error.message) || 'Something went wrong',
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

export const createReducer = (type: Type, defaultPayload = null) => (
  state = INITIAL_STATE,
  action: Action,
): ReducerState => {
  const { START, FINISH, ERROR, RESET } = createTypes(type)

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

export const createSelectors = (type: Type) => {
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
      payload => (payload && payload.data ? payload.data : null),
    ),
    getError: createSelector(
      rootSelector,
      root => root.error,
    ),
  }
}

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
