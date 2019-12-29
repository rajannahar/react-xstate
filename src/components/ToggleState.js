import React from 'react';
import { useMachine } from '@xstate/react'
import { Machine } from 'xstate'

const toggleMachine = new Machine({
  id: 'toggleMachine',
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        TOGGLE: 'active'
      }
    },
    active: {
      on: {
        TOGGLE: 'inactive'
      }
    }
  }
})
// toggle state machine with 2 states - active, inactive
// INACTIVE state toggles to ACTIVE
// ACTIVE state toggles to INACTIVE

const ToggleState = () => {
  const [current, send] = useMachine(toggleMachine);
  // useMachine hook to access:
  // CURRENT = FSM state object
  // SEND = FSM send action, similar to dispatch
  console.log('toggle machine', current)

  return(
    <>
      {current.matches('active') && <p>We are active</p>}
      {current.matches('inactive') && <p>We are inactive</p>}
      {/* conditional rendering to load text based on current (state) value */}
      <br />
      <button onClick={() => {
        send('TOGGLE')
        // this sends the TOGGLE action to the FSM
      }}>Toggle State</button>
    </>
  )
}

export default ToggleState