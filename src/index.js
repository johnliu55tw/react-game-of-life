import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { GamePresenter } from './game_of_life/presenter.js'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <GamePresenter
    width={20}
    height={20}
  />,
  document.getElementById('root')
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
