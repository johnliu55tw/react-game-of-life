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

    this.intervalTimerID = null
    this.world = new World(props.width, props.height)
    this.patterns = Patterns
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
  }

  onNextClick () {
    console.log('Next btn clicked')
    this.world.advance()
    this.setState((prevState, props) => {
      return {alives: this.world.getAlives()}
    })
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
