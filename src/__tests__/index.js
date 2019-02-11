import {
  createTypes,
  createActionCreators,
  createReducer,
  createSelectors,
  createDuck,
} from '../../dist'

test('should create base types', () => {
  expect(createTypes('RANDOM_NAME')).toMatchSnapshot()
  expect(createTypes('ANOTHER_NAME')).toMatchSnapshot()
})

test('should create action creators', () => {
  const action = createActionCreators('RANDOM_NAME')
  expect(action.start()).toMatchSnapshot()
  expect(action.finish({ hello: 'there' })).toMatchSnapshot()
  expect(action.error(new Error('An error occurred'))).toMatchSnapshot()
  expect(action.error()).toMatchSnapshot()
  expect(action.reset()).toMatchSnapshot()
})

test('should create reducer', () => {
  const TYPE = 'RANDOM_NAME'
  expect(createReducer(TYPE)()).toMatchSnapshot()

  const action = createActionCreators(TYPE)
  const reducer = createReducer(TYPE)
  let state = reducer()
  expect(state).toMatchSnapshot()

  state = reducer(state, action.start())
  expect(state).toMatchSnapshot()

  state = reducer(state, action.finish({ it: 'works' }))
  expect(state).toMatchSnapshot()

  state = reducer(state, action.error())
  expect(state).toMatchSnapshot()

  state = reducer(state, action.reset())
  expect(state).toMatchSnapshot()
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

  expect(selectors.getAll(state)).toMatchSnapshot()
  expect(selectors.getIsLoading(state)).toMatchSnapshot()
  expect(selectors.getPayload(state)).toMatchSnapshot()
  expect(selectors.getPayloadData(state)).toMatchSnapshot()
  expect(selectors.getError(state)).toMatchSnapshot()
  expect(selectors.custom(state)).toMatchSnapshot()
  expect(selectors.custom({ RANDOM_NAME: state })).toMatchSnapshot()
})

test('should create duck', () => {
  const duck = createDuck({
    type: 'RANDOM_NAME',
    initialState: {
      isLoading: false,
      error: null,
      payload: { data: { count: 1 } },
    },
    selectors: {
      getCount: state => state.payload.data.count,
    },
  })

  let state = duck.reducer()

  expect(duck.selectors.getAll(state)).toMatchSnapshot()
  expect(duck.selectors.getIsLoading(state)).toMatchSnapshot()
  expect(duck.selectors.getPayload(state)).toMatchSnapshot()
  expect(duck.selectors.getPayloadData(state)).toMatchSnapshot()
  expect(duck.selectors.getError(state)).toMatchSnapshot()
  expect(duck.selectors.getCount(state)).toMatchSnapshot()
})
