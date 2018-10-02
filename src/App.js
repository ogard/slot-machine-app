// @flow

import * as React from 'react'
import * as Cmd from 'elm-ts/lib/Cmd'
import type { Html } from 'elm-ts/lib/React'

export type Model = number

export const init: [Model, Cmd.Cmd<Msg>] = [0, Cmd.none]

export type Msg = {| type: 'Increment' |} | {| type: 'Decrement' |}

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case 'Increment':
      return [model + 1, Cmd.none]
    case 'Decrement':
      return [model - 1, Cmd.none]
    default:
      return assertNever(msg.type)
  }
}

export const view = (model: Model): Html<Msg> => dispatch => (
  <div>
    Count: {model}
    <button onClick={() => dispatch({ type: 'Increment' })}>+</button>
    <button onClick={() => dispatch({ type: 'Decrement' })}>-</button>
  </div>
)
