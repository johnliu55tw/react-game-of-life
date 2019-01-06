import React, { Component } from 'react'
import { Game } from './view'
import { World, Patterns } from './model'
import { ValueError } from './exceptions'

export class GamePresenter extends Component {
  constructor (props) {
    super(props)

    this.state = {
      alives: [],
      btnStartText: 'Start',
      sliderValue: 5,
      patternIndex: 0
    }

    this.isRunning = false
    this.intervalTimer = null
    this.speed = 1
    this.world = new World(props.width, props.height)
    this.patterns = Patterns
  }

  start () {
    if (!this.isRunning) {
      this.isRunning = true
      this.intervalTimer = setInterval(this.advance.bind(this),
                                       (1 / this.speed) * 1000)
    }
  }

  stop () {
    if (this.isRunning) {
      this.isRunning = false
      clearInterval(this.intervalTimer)
      this.intervalTimer = null
    }
  }

  advance () {
    this.world.advance()
    this.setState((prevState, props) => {
      return {alives: this.world.getAlives()}
    })
  }

  setSpeed (speed) {
    console.log('setSpeed to ' + speed)
    if (speed < 1 || speed > this.props.maxSpeed) {
      throw new ValueError('speed must be >= 1 and <= ' + this.props.maxSpeed)
    }

    this.speed = speed

    if (this.isRunning) {
      this.stop()
      this.start()
    }
  }

  onCellClick (coor) {
    console.log('Cell clicked: ' + coor[0] + ', ' + coor[1])
    this.world.toggleAliveness(coor[0], coor[1])
    this.setState((prevState, props) => {
      return {alives: this.world.getAlives()}
    })
  }

  onStartClick () {
    console.log('Start btn clicked.')
    if (this.isRunning) {
      this.stop()
      this.setState((prevState, props) => {
        return {btnStartText: 'Start'}
      })
    } else {
      this.start()
      this.setState((prevState, props) => {
        return {btnStartText: 'Stop'}
      })
    }
  }

  onPatternOptionsChange (text, index) {
    console.log('Options changed to [' + index + '] ' + text)
    const p = this.patterns[index]
    this.world = new World(this.props.width, this.props.height)
    for (let [x, y] of p.asScreenCoordinate(this.props.width, this.props.height)) {
      this.world.setAlive(x, y)
    }
    this.setState((prevState, props) => {
      return {alives: this.world.getAlives()}
    })
  }

  render () {
    let gridProps = {
      width: this.props.width,
      height: this.props.height,
      onCellClick: this.onCellClick.bind(this),
      alives: this.world.getAlives()
    }

    let btnStartProps = {
      text: this.state.btnStartText,
      onClick: this.onStartClick.bind(this)
    }

    let btnNextProps = {
      onClick: this.advance.bind(this)
    }

    let sliderProps = {
      min: 1,
      max: this.props.maxSpeed,
      step: 1,
      initialValue: 1,
      onChange: this.setSpeed.bind(this)
    }

    let patternOptionsProps = {
      options: this.patterns.map((pattern) => pattern.name),
      initialIndex: this.state.patternIndex,
      onChange: this.onPatternOptionsChange.bind(this)
    }

    return (
      <Game
        gridProps={gridProps}
        btnStartProps={btnStartProps}
        btnNextProps={btnNextProps}
        sliderProps={sliderProps}
        patternOptionsProps={patternOptionsProps}
      />
    )
  }
}
