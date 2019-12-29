import React from 'react'
import { useMachine } from '@xstate/react'
import { Machine, assign } from 'xstate'

const allData = new Array(25).fill(0).map((_val, i) => i + 1);
// create a new array, fill with 25 items and each of these is a numeric value stating from 1
// array of 1-25

const perPage = 10;
// constant of 10

const dataMachine = new Machine({
  id: 'dataMachine',
  initial: 'loading',
  context: {
    data: []
  },
  states: {
    loading: {
      invoke: {
        id: 'dataLoader',
        src: (context, _event) => {
          return (callback, _onEvent) => {
            setTimeout(() => {

              const { data } = context;
              const newData = allData.slice(data.length, data.length + perPage)
              // slice array from starting 0 to 10, then increments of 10 (perPage)
              const hasMore = newData.length === perPage;
              // if array length is equal to 10 (perPage)

              if (hasMore) {
                callback({type: 'DONE_MORE', newData})
                // if hasMore is truthy, then more data can be loaded - LOAD MORE logic
              } else {
                callback({type: 'DONE_COMPLETE', newData})
                // if hasMore is falsy, then NO more data can be loaded - LOAD MORE logic
              }

            }, 1000);
          }
        }
      },
      on: {
        DONE_MORE: {
          target: 'more',
          actions: assign({
            data: (context, event) => [...context.data, ...event.newData]
          }) },
        DONE_COMPLETE: {
          target: 'complete',
          actions: assign({
            data: (context, event) => [...context.data, ...event.newData]
          }) },
        FAIL: 'failure'
      }
    },
    more: {
      on: {
        LOAD: 'loading'
      }
    },
    complete: {
      type: 'final'
    },
    failure: {
      type: 'final'
    }
  }
})

const LoadingDataState = () => {

  const [current, send] = useMachine(dataMachine)
  // useMachine hook to access:
  // CURRENT = FSM state object
  // SEND = FSM send action, similar to dispatch

  const { data } = current.context
  // destructing data from current.context

  console.log('loading machine', current)

  return(
    <>
      <ul style={{ listStyle: 'none', padding: '20px', }}>
        {/* maps through destructured DATA from CURRENT.CONTEXT (FSM state) */}
        {data.map(row => (
          <li key={row} style={{ background: 'orange' }}>
            {row}
          </li>
        ))}

        {/* conditional rendering is current (state) value matches LOADING */}
        {current.matches('loading') && <li style={{ padding: '20px 0  40px 0' }}>Loading...</li>}

        {/* conditional rendering is current (state) value matches MORE */}
        {current.matches('more') && (
          <li style={{ background: 'green', padding: '20px 0 40px 0' }}>
            <button onClick={() => {
              send("LOAD")
              // SENDS the LOAD action to the FSM
            }}>Load more</button>
          </li>
        )}
      </ul>
    </>
  )
}

export default LoadingDataState