import React, { useRef } from 'react'
import { useMachine } from '@xstate/react'
import { Machine, assign } from 'xstate'
import { percentage, minutes, seconds } from "../utils"

const videoMachine = new Machine({
  id: 'videoMachine',
  initial: 'loading',
  context: {
    video: null,
    duration: 0,
    elapsed: 0
  },
  states: {
    loading: {
      on: {
        LOADED: {
          target: 'ready',
          actions: assign({
            video: (_context, event) => event.video,
            duration: (_context, event) => event.video.duration
          })
        },
        FAILED: 'failure'
      }
    },
    ready: {
      initial: 'paused',
      states: {
        paused: {
          on: {
            PLAY: { target: 'playing', actions: ["playVideo"] }
          }
        },
        playing: {
          on: {
            PAUSED: { target: 'paused', actions: ["pauseVideo"] },
            END: 'ended',
            TIMING: { target: 'playing', actions: assign({
              elapsed: (context, _event) => context.video.currentTime
            }) }
          }
        },
        ended: {
          on: {
            PLAY : { target: 'playing', actions: ["restartVideo"] }
          }
        }
      }
    },
    failure: {
      type: 'final'
    }
  }
})


// CONTROLS
const playVideo = (context, _event) => {
  context.video.play();
};

const pauseVideo = (context, _event) => {
  context.video.pause();
};

const restartVideo = (context, _event) => {
  context.video.currentTime = 0;
  context.video.play();
};


// VIDEO PLAYER COMPONENT
const VideoPlayer = () => {
  const ref = useRef(null)
  const [current, send] = useMachine(videoMachine, { actions: { playVideo, pauseVideo, restartVideo } });
  const { duration, elapsed } = current.context

  console.log('lplpl', current.value)

  return(
    <div className="container">
      <video
        ref={ref}
        onCanPlay={() => send("LOADED", { video: ref.current  })}
        onError={() => send("FAIL")}
        onTimeUpdate={() => send("TIMING")}
        onEnded={() => send("END")}
      >
        <source src="./fox.mp4" type="video/mp4" />
      </video>

      <div>
        <ElapsedBar elapsed={elapsed} duration={duration} />
        <Buttons current={current} send={send} />
        <Timer elapsed={elapsed} duration={duration} />
      </div>

    </div>
  )
}
export default VideoPlayer


const Buttons = ({ current, send }) => {
  if (current.matches({ ready: "playing" })) {
    return <button onClick={() => send("PAUSED")}>Pause</button>
  }

  return <button onClick={() => send("PLAY")}>Play</button>
}

const ElapsedBar = ({ elapsed, duration }) => (
  <div className="elapsed">
    <div
      className="elapsed-bar"
      style={{ width: `${percentage(duration, elapsed)}%` }}
    />
  </div>
);

const Timer = ({ elapsed, duration }) => (
  <span className="timer">
    {minutes(elapsed)}:{seconds(elapsed)} of {minutes(duration)}:
    {seconds(duration)}
  </span>
);