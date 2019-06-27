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
  const [finished, setFinished] = useState(false)
  const startGame = () => {
    const state = [...data]
    const rnd = Math.floor(Math.random() * state.length + 0)
    if (finished) {
      set(prevState =>
        prevState
          .map(it =>
            it.ball
              ? {
                  name: it.name,
                  description: it.description,
                  css: it.css,
                  height: it.height,
                  width: it.width
                }
              : it
          )
          .map((it, i) => (i === rnd ? { ...it, ball: true } : { ...it }))
      )
    }

    setFinished(false)
    const mutable = state.map((it, i) => (i === rnd ? { ...it, ball: true } : { ...it }))
    set([...mutable])

    setDisabled(true)
    setTimeout(() => setShallow(true), 1000)
    const interval = setInterval(() => set(shuffle), gameInterval)
    setTimeout(() => {
      clearInterval(interval)
      setDisabled(false)
      setFinished(true)
    }, 5000)
  }

  const define = item => {
    if (finished) {
      if (item.ball && score === 4) {
        setScore(0)
        alert('All Game you WIN')
        setFinished(false)
        return setGameInterval(3000)
      }
      if (item.ball) {
        alert('YOU WIN')
        setScore(score + 1)
        setFinished(false)
        return setGameInterval(gameInterval - score * 200)
      }
      setFinished(false)
      setScore(0)
      setGameInterval(3000)
      alert('YOU LOST')
    }
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
            <div className="cell" onClick={() => define(item)}>
              <div className="details" style={{ backgroundImage: item.css }}>
                {item.ball && <div className={`ball ${shallow ? 'shallow' : 'shallowsee'}`} />}
              </div>
            </div>
          </animated.div>
        ))}
      </div>
      <button onClick={startGame} disabled={disabled} className="btn">
        Start Game
      </button>
      <div className="resScore">
        Level {score} | score:{score * 30}
      </div>
    </div>
  )
}

render(<App />, document.getElementById('root'))
