import { createSelector } from 'reselect'

import {
  createTypes,
  createActionCreators,
  createReducer,
  createSelectors,
  createDuck,
} from '../../dist'

test('should create base types', () => {
  expect(createTypes('RANDOM_NAME')).toEqual({
    ERROR: 'RANDOM_NAME/ERROR',
    FINISH: 'RANDOM_NAME/FINISH',
    RESET: 'RANDOM_NAME/RESET',
    START: 'RANDOM_NAME/START',
  })

  expect(createTypes('ANOTHER_NAME')).toEqual({
    ERROR: 'ANOTHER_NAME/ERROR',
    FINISH: 'ANOTHER_NAME/FINISH',
    RESET: 'ANOTHER_NAME/RESET',
    START: 'ANOTHER_NAME/START',
  })
})

test('should create action creators', () => {
  const action = createActionCreators('RANDOM_NAME')
  expect(action.start()).toEqual({
    type: 'RANDOM_NAME/START',
  })
  expect(action.finish({ hello: 'there' })).toEqual({
    type: 'RANDOM_NAME/FINISH',
    payload: { hello: 'there' },
  })
  expect(action.error(new Error('An error occurred'))).toEqual({
    type: 'RANDOM_NAME/ERROR',
    error: 'An error occurred',
  })
  expect(action.error()).toEqual({
    type: 'RANDOM_NAME/ERROR',
    error: 'Something went wrong',
  })
  expect(action.reset()).toEqual({ type: 'RANDOM_NAME/RESET' })
})

test('should create reducer', () => {
  const TYPE = 'RANDOM_NAME'
  const INITIAL_STATE = {
    error: null,
    isLoading: true,
    payload: null,
  }

  expect(createReducer(TYPE)()).toEqual(INITIAL_STATE)

  const action = createActionCreators(TYPE)
  const reducer = createReducer(TYPE)
  let state = reducer()
  expect(state).toEqual(INITIAL_STATE)

  state = reducer(state, action.start())
  expect(state).toEqual(INITIAL_STATE)

  state = reducer(state, action.finish({ it: 'works' }))
  expect(state).toEqual({
    error: null,
    isLoading: false,
    payload: { it: 'works' },
  })

  state = reducer(state, action.error())
  expect(state).toEqual({
    error: 'Something went wrong',
    isLoading: false,
    payload: null,
  })

  state = reducer(state, action.reset())
  expect(state).toEqual(INITIAL_STATE)
})

test('should create selectors', () => {
  const selectors = createSelectors('RANDOM_NAME', {
    custom: state => (state.isLoading ? 'Loading' : 'Loaded'),
  })
  const state = {
    isLoading: false,
    payload: { data: { hello: 'there' } },
    error: 'It failed!',
  }

  expect(selectors.getAll(state)).toEqual({
    error: 'It failed!',
    isLoading: false,
    payload: {
      data: {
        hello: 'there',
      },
    },
  })
  expect(selectors.getIsLoading(state)).toBe(false)
  expect(selectors.getPayload(state)).toEqual({
    data: {
      hello: 'there',
    },
  })
  expect(selectors.getPayloadData(state)).toEqual({
    hello: 'there',
  })
  expect(selectors.getError(state)).toBe('It failed!')
  expect(selectors.custom(state)).toBe('Loaded')
  expect(selectors.custom({ RANDOM_NAME: state })).toBe('Loaded')
})

test('should create duck', () => {
  const duck = createDuck({
    type: 'RANDOM_NAME',
    initialState: {
      isLoading: false,
      error: null,
      payload: { data: { count: 1 } },
    },
    getSelectors: selectors => ({
      getCount: createSelector(
        selectors.getPayloadData,
        data => data.count,
      ),
    }),
  })

  let state = duck.reducer()

  expect(duck.selector.getAll(state)).toEqual({
    error: null,
    isLoading: false,
    payload: {
      data: {
        count: 1,
      },
    },
  })
  expect(duck.selector.getIsLoading(state)).toBe(false)
  expect(duck.selector.getPayload(state)).toEqual({
    data: {
      count: 1,
    },
  })
  expect(duck.selector.getPayloadData(state)).toEqual({
    count: 1,
  })
  expect(duck.selector.getError(state)).toBe(null)
  expect(duck.selector.getCount(state)).toBe(1)
})
