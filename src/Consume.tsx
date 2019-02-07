const Consume = ({
  Consumer,
  Loading = () => null,
  Error = () => null,
  children,
}) => (
  <Consumer
    mapState={state => ({
      isReady: duck.selectors.getIsReady(state),
      error: duck.selectors.getError(state),
      data: duck.selectors.getPayloadData(state),
    })}
  >
    {({ isReady, error, data }, _actions, dispatch) => {
      if (error) return <Error error={error} />
      if (!isReady) return <Loading />

      return children(data, {
        dispatch,
        // Hook up dispatch to all our actions
        ...R.fromPairs(
          R.toPairs(duck.action).map(([key, action]) => [
            key,
            (...args) => dispatch(action(...args)),
          ]),
        ),
      })
    }}
  </Consumer>
)

export default Consume
