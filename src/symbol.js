// @flow
import * as React from 'react'
import * as Cmd from 'elm-ts/lib/Cmd'
import * as Task from 'elm-ts/lib/Task'

export type Value =
  | 'Symbol1'
  | 'Symbol2'
  | 'Symbol3'
  | 'Symbol4'
  | 'Symbol5'
  | 'Symbol6'
  | 'Symbol7'
  | 'Symbol8'
  | 'Symbol9'
  | 'Symbol10'
  | 'Symbol11'
  | 'Symbol12'

export const displayImage: { [key: Value]: React.Node } = {
  Symbol1: <img src="../assets/images/icons8-cards-50.png" />,
  Symbol2: <img src="../assets/images/icons8-cards-50.png" />,
  Symbol3: <img src="../assets/images/icons8-cherry-50.png" />,
  Symbol4: <img src="../assets/images/icons8-chip-50.png" />,
  Symbol5: <img src="../assets/images/icons8-clover-50.png" />,
  Symbol6: <img src="../assets/images/icons8-hazelnut-50.png" />,
  Symbol7: <img src="../assets/images/icons8-horseshoe-50.png" />,
  Symbol8: <img src="../assets/images/icons8-magnet-50.png" />,
  Symbol9: <img src="../assets/images/icons8-roulette-50.png" />,
  Symbol10: <img src="../assets/images/icons8-slot-machine-50.png" />,
  Symbol11: <img src="../assets/images/icons8-three-leaf-clover-50.png" />,
  Symbol12: <img src="../assets/images/icons8-win-50.png" />,
}

const validValues: Array<Value> = Object.keys(displayImage)
const getRandom = (): Value => validValues[Math.floor(Math.random() * validValues.length)]

export const get3Random = (): Task.Task<[Value, Value, Value]> =>
  new Task.Task(
    () =>
      new Promise(resolve => {
        resolve([getRandom(), getRandom(), getRandom()])
      }),
  )

export const generateRandom = (timer: number): Task.Task<Value> =>
  new Task.Task(
    () =>
      new Promise(resolve => {
        setTimeout(() => {
          const validValues: Array<Value> = Object.keys(displayImage)
          resolve(getRandom())
        }, timer)
      }),
  )
