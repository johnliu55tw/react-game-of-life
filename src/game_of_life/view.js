import React, { Component } from 'react'
import './view.css'

export class Cell extends Component {
  handleClick (event) {
    this.props.onClick(this.props.coordinate)
  }

  render () {
    let className = this.props.aliveness ? 'cell alive' : 'cell dead'
    return (
      // Don't know whether using span as button is a good idea or not...
      <span className={className} onClick={this.handleClick.bind(this)} />
    )
  }
}

export class Grid extends Component {
  determineCellAliveness (x, y) {
    return Boolean(this.props.alives.find((coor) => (coor[0] === x && coor[1] === y)))
  }

  renderRow (rowNum) {
    let row = []
    for (let x = 0; x < this.props.width; x++) {
      let key = rowNum * this.props.width + x
      row.push(
        <Cell
          coordinate={[x, rowNum]}
          aliveness={this.determineCellAliveness(x, rowNum)}
          key={key}
          onClick={this.props.onCellClick}
        />
      )
    }

    return (
      <div className='grid-row' key={rowNum}>
        {row}
      </div>
    )
  }

  render () {
    let rows = []
    for (let y = 0; y < this.props.height; y++) {
      rows.push(this.renderRow(y))
    }

    return (
      <div className='grid'>
        {rows}
      </div>
    )
  }
}

export function Game (props) {
  return (
    <div className='game'>
      <Grid
        width={props.gridProps.width}
        height={props.gridProps.height}
        onCellClick={props.gridProps.onCellClick}
        alives={props.gridProps.alives}
      />
      <div className='control-bar'>
        <Button
          text={props.btnStartProps.text}
          onClick={props.btnStartProps.onClick} />
        <Button
          text='Next'
          onClick={props.btnNextProps.onClick} />
        <Slider
          min={props.sliderProps.min}
          max={props.sliderProps.max}
          step={props.sliderProps.step}
          initialValue={props.sliderProps.initialValue}
          onChange={props.sliderProps.onChange}
        />
        <Selector
          options={props.patternOptionsProps.options}
          initialIndex={props.patternOptionsProps.initialIndex}
          onChange={props.patternOptionsProps.onChange}
        />
      </div>
    </div>
  )
}

export function Button (props) {
  return (
    <button className='button' onClick={props.onClick}>
      {props.text}
    </button>
  )
}

export class Slider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.initialValue
    }
  }

  handleChange (event) {
    let value = event.target.value
    this.setState({
      value: value
    })
    this.props.onChange(value)
  }

  render () {
    return (
      <input
        type='range'
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        value={this.state.value} // This is required for the element to work
        onChange={this.handleChange.bind(this)}
      />)
  }
}

export class Selector extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedIndex: props.initialIndex,
      selectedText: props.options[props.initialIndex]
    }
  }

  handleChange (event) {
    let newValue = event.target.value
    let newValueIndex = this.props.options.findIndex((val) => val === newValue)
    this.setState({
      selectedIndex: newValueIndex,
      selectedText: newValue
    })
    // Call the callback
    this.props.onChange(newValue, newValueIndex)
  }

  renderOptions () {
    return this.props.options.map((value) => {
      return (
        <option key={value} value={value}>{value}</option>
      )
    })
  }

  render () {
    return (
      <select value={this.state.selectedText} onChange={this.handleChange.bind(this)}>
        {this.renderOptions()}
      </select>
    )
  }
}
