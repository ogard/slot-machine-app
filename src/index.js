// @flow

import * as React from 'elm-ts/lib/React'
import { render } from 'react-dom'
import * as App from './App'

const appElement = document.getElementById('app')
if (appElement != null) {
  React.run(React.program(App.init, App.update, App.view), dom => render(dom, appElement))
}
