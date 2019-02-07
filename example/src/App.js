import React from 'react'

import { useMyHook } from 'create-easy-duck'

const App = () => {
  const example = useMyHook()
  return <div>{example}</div>
}
export default App
