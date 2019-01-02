import React, { Component } from 'react'
import { Game } from './view'
import { World, Patterns } from './model'

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
    this.minDelay = this.props.minDelay
    this.currDelay = this.minDelay
    this.world = new World(props.width, props.height)
    this.patterns = Patterns
  }

  isRunning () {
    return this.isRunning
  }

  start () {
    if (!this.isRunning) {
      this.isRunning = true
      this.intervalTimer = setInterval(this.onTimer.bind(this), this.currDelay)
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

  onTimer () {
    this.advance()
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

  onNextClick () {
    console.log('Next btn clicked')
    this.advance()
  }

  onSliderChange (value) {
    console.log('Slider changed to ' + value)
  }

  onPatternOptionsChange (text, index) {
    console.log('Options changed to [' + index + '] ' + text)
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
      onClick: this.onNextClick.bind(this)
    }

    let sliderProps = {
      min: 1,
      max: 10,
      initialValue: this.state.sliderValue,
      onChange: this.onSliderChange.bind(this)
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
