import React from 'react'
import ReactDOM from 'react-dom'
import { GamePresenter } from './game_of_life/presenter.js'
import './index.css'
import * as serviceWorker from './serviceWorker'

function GithubRibbon (props) {
  const style = {position: 'absolute', top: 0, right: 0, border: 0}
  return (
    <a href='https://github.com/johnliu55tw/react-game-of-life'>
      <img
        style={style}
        src='https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png'
        alt='Fork me on GitHub' />
    </a>
  )
}

ReactDOM.render(
  <div className='container'>
    <GithubRibbon />
    <div className='body'>
      <h1>Game of Life in React.js</h1>
      <GamePresenter
        width={81}
        height={61}
        maxSpeed={20}
      />
    </div>
  </div>,
  document.getElementById('root')
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
