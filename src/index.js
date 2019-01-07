import React from 'react'
import ReactDOM from 'react-dom'
import { GamePresenter } from './game_of_life/presenter.js'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <div className='body'>
    <GamePresenter
      width={81}
      height={61}
      maxSpeed={20}
    />
  </div>,
  document.getElementById('root')
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
