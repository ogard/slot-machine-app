// @flow

import * as React from 'react'
import * as Cmd from 'elm-ts/lib/Cmd'
import * as Task from 'elm-ts/lib/Task'
import type { Html } from 'elm-ts/lib/React'
import * as Symbol from './symbol'
import '../assets/css/app.css'

type SymbolModel = {| type: 'Generating' |} | {| type: 'Generated', value: Symbol.Value |}

export type Model = {|
  symbol1: SymbolModel,
  symbol2: SymbolModel,
  symbol3: SymbolModel,
  game: 'Demo' | 'InProgress' | 'Finished',
|}

export const init: [Model, Cmd.Cmd<Msg>] = [
  {
    symbol1: { type: 'Generating' },
    symbol2: { type: 'Generating' },
    symbol3: { type: 'Generating' },
    game: 'Demo',
  },
  Task.perform(Symbol.get3Random(), values => ({ type: 'NewSymbols', values })),
]

export type Msg =
  | {| type: 'NewSymbols', values: [Symbol.Value, Symbol.Value, Symbol.Value] |}
  | {| type: 'StartGame' |}
  | {| type: 'NewSymbol1', value: Symbol.Value |}
  | {| type: 'NewSymbol2', value: Symbol.Value |}
  | {| type: 'NewSymbol3', value: Symbol.Value |}

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case 'NewSymbols':
      return [
        {
          ...model,
          symbol1: { type: 'Generated', value: msg.values[0] },
          symbol2: { type: 'Generated', value: msg.values[1] },
          symbol3: { type: 'Generated', value: msg.values[2] },
        },
        Cmd.none,
      ]
    case 'StartGame':
      return [
        { ...model, symbol1: { type: 'Generating' }, game: 'InProgress' },
        Task.perform(Symbol.generateRandom(2000), value => ({
          type: 'NewSymbol1',
          value,
        })),
      ]
    case 'NewSymbol1':
      return [
        {
          ...model,
          symbol1: { type: 'Generated', value: msg.value },
          symbol2: { type: 'Generating' },
        },
        Task.perform(Symbol.generateRandom(1000), value => ({
          type: 'NewSymbol2',
          value,
        })),
      ]
    case 'NewSymbol2':
      return [
        {
          ...model,
          symbol2: { type: 'Generated', value: msg.value },
          symbol3: { type: 'Generating' },
        },
        Task.perform(Symbol.generateRandom(1000), value => ({
          type: 'NewSymbol3',
          value,
        })),
      ]
    case 'NewSymbol3':
      return [
        {
          ...model,
          symbol3: { type: 'Generated', value: msg.value },
          game: 'Finished',
        },
        Cmd.none,
      ]
    default:
      return assertNever(msg.type)
  }
}

const drawSymbol = (model: SymbolModel): React.Node => {
  switch (model.type) {
    case 'Generating':
      return (
        <div className="spinner">
          <div>...</div>
          <audio autoPlay="autoplay" loop={true} src="../assets/audio/spinning.mp3" />
        </div>
      )
    case 'Generated':
      return <div className="spinner">{Symbol.displayImage[model.value]}</div>
    default:
      return assertNever(model.type)
  }
}

const getResult = (arr: Array<Symbol.Value>): React.Node => {
  if (arr.every(x => x === arr[0])) {
    return (
      <div>
        <p>You are the winner</p>
        <audio autoPlay="autoplay" loop={false} src="../assets/audio/winning_slot.wav" />
      </div>
    )
  }
  return <p>You lost. Better luck next time!</p>
}

export const view = (model: Model): Html<Msg> => dispatch => (
  <div className="page">
    <div className="centered">
      <div style={{ display: 'flex', width: 165, justifyContent: 'space-between' }}>
        {drawSymbol(model.symbol1)}
        {drawSymbol(model.symbol2)}
        {drawSymbol(model.symbol3)}
      </div>
    </div>
    <div style={{ alignSelf: 'center', marginTop: 10 }}>
      {' '}
      <button
        className="actionButton"
        disabled={model.game === 'InProgress'}
        onClick={() => dispatch({ type: 'StartGame' })}
      >
        Spin
      </button>
    </div>

    {model.symbol1.type === 'Generated' &&
      model.symbol2.type === 'Generated' &&
      model.symbol3.type === 'Generated' &&
      model.game === 'Finished' &&
      getResult([model.symbol1.value, model.symbol2.value, model.symbol3.value])}
  </div>
)
