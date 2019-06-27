import { render } from 'react-dom'
import React, { useState, useEffect } from 'react'
import { useTransition, animated } from 'react-spring'
import shuffle from 'lodash/shuffle'
import data from './data'
import './styles.css'

function App() {
  // useEffect(() => {
  //   const state = [...data]
  //   const rnd = Math.floor(Math.random() * state.length + 0)
  //   const mutable = state.map((it, i) => (i === rnd ? { ...it, ball: true } : { ...it }))
  //   set([...mutable])
  // }, [])
  const [rows, set] = useState(data)
  const [disabled, setDisabled] = useState(false)
  const [shallow, setShallow] = useState(false)
  const [gameInterval, setGameInterval] = useState(1000)
  const [score, setScore] = useState(0)

  const startGame = () => {
    const state = [...data]
    const rnd = Math.floor(Math.random() * state.length + 0)
    const mutable = state.map((it, i) => (i === rnd ? { ...it, ball: true } : { ...it }))
    set([...mutable])

    setDisabled(true)
    setTimeout(() => setShallow(true), 1000)
    const interval = setInterval(() => set(shuffle), gameInterval)
    setTimeout(() => {
      clearInterval(interval)
      setDisabled(false)
    }, 5000)
  }

  const define = item => {
    setDisabled(false)
    if (item.ball && score === 4) {
      setScore(0)
      alert('All Game you WIN')
      return setGameInterval(3000)
    }
    if (item.ball) {
      alert('YOU WIN')
      setScore(score + 1)
      console.log(score)
      // console.log(gameInterval - score * 200)
      return setGameInterval(gameInterval - score * 200)
    }

    setScore(0)
    setGameInterval(3000)
    alert('YOU LOST')
  }

  let height = 0
  const transitions = useTransition(
    rows.map(data => ({ ...data, x: (height += data.width) - data.width })),
    d => d.name,
    {
      from: { width: 100, height: 0 },
      leave: { width: 100, height: 0 },
      enter: ({ x, width, height }) => ({ x, width, height }),
      update: ({ x, width, height }) => ({ x, width, height })
    }
  )

  return (
    <div>
      <div className="list">
        {transitions.map(({ item, props: { x, ...rest }, key }, index) => (
          <animated.div
            key={key}
            className="card"
            style={{ transform: x.interpolate(x => `translate3d(${x}px,0,0)`), ...rest }}>
            <div className="cell" onClick={() => define(item)} disabled={disabled}>
              <div className="details" style={{ backgroundImage: item.css }}>
                {item.ball && <div className={`ball ${shallow ? 'shallow' : ''}`} />}
              </div>
            </div>
          </animated.div>
        ))}
      </div>
      <button onClick={startGame} disabled={disabled}>
        Start Game
      </button>
      <div>score:{score}</div>
    </div>
  )
}

render(<App />, document.getElementById('root'))
