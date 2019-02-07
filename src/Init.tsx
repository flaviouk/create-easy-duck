import * as React from 'react'

const Init = ({
  Consumer,
  init = duck.action.get,
  reset = duck.action.reset,
  ...props
}) => (
  <Consumer>
    {(_state, _action, dispatch) => (
      <Component
        didMount={() => dispatch(init(props))}
        willUnmount={() => dispatch(reset())}
      >
        {props.children}
      </Component>
    )}
  </Consumer>
)

export default Init
