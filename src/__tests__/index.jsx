import { createTypes, createActionCreators, createReducer } from '../../dist'

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
  expect(createReducer(TYPE, { data: null })(undefined, {})).toMatchSnapshot()

  const action = createActionCreators(TYPE)
  const reducer = createReducer(TYPE)
  let state = reducer(undefined, {})
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
