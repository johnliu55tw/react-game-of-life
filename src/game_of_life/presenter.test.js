/* eslint-env jest */
import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { Game } from './view'
import { World } from './model'
import { ValueError } from './exceptions'

import { GamePresenter } from './presenter'

Enzyme.configure({ adapter: new Adapter() })

jest.mock('./model')

describe('GamePresenter presenter test case', () => {
  let presenterWrapper = null
  let presenterInstance = null

  beforeEach(() => {
    jest.useFakeTimers()
    World.mockClear()
    presenterWrapper = shallow(
      <GamePresenter
        width={20}
        height={30}
        maxSpeed={20}
      />
    )

    presenterInstance = presenterWrapper.instance()
  })

  test('renders "Game" view', () => {
    expect(presenterWrapper.is(Game)).toBe(true)
  })

  test('isRunning attribute should be false after initialized', () => {
    expect(presenterInstance.isRunning).toBe(false)
  })

  test('advance method should perform correctly', () => {
    const mockWorld = World.mock.instances[0]
    mockWorld.getAlives.mockReturnValue('fake alives value')

    presenterInstance.advance()

    expect(mockWorld.advance).toHaveBeenCalledTimes(1)
    expect(presenterWrapper.state().alives).toEqual('fake alives value')
  })

  test('start method should start the interval timer with min speed', () => {
    presenterInstance.start()

    expect(presenterInstance.isRunning).toBe(true)
    expect(setInterval).toHaveBeenCalledTimes(1)
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function),
                                             1000)
  })

  test('stop method should stop the interval timer if is running', () => {
    presenterInstance.start()
    presenterInstance.stop()

    expect(presenterInstance.isRunning).toBe(false)
    expect(clearInterval).toHaveBeenCalledTimes(1)
    expect(clearInterval).toHaveBeenCalledWith(setInterval.mock.results[0].value)
  })

  test('setSpeed method throw exception if speed is not within the range', () => {
    const maxSpeed = presenterInstance.props.maxSpeed

    // range: 1 <= speed <= maxFreq
    expect(() => presenterInstance.setSpeed(0.99)).toThrow(ValueError)
    expect(() => presenterInstance.setSpeed(maxSpeed + 0.1)).toThrow(ValueError)
  })

  test('setSpeed method should restart the interval timer if is running', () => {
    const newSpeed = 5

    presenterInstance.start()

    presenterInstance.setSpeed(newSpeed)

    expect(setInterval).toHaveBeenCalledTimes(2)
    expect(clearInterval).toHaveBeenCalledTimes(1)
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function),
                                                 (1 / newSpeed) * 1000)
  })

  test('onStartClick method should call start if not running', () => {
    const spy = jest.spyOn(presenterInstance, 'start')

    presenterInstance.onStartClick()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onStartClick method should change the text of the start button if not running', () => {
    presenterInstance.onStartClick()

    expect(presenterWrapper.state().btnStartText).toEqual('Stop')
  })

  test('onStartClick method should call stop if is running', () => {
    const spy = jest.spyOn(presenterInstance, 'stop')
    presenterInstance.start()

    presenterInstance.onStartClick()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onStartClick method should change the text of the start button if running', () => {
    presenterInstance.start()

    presenterInstance.onStartClick()

    expect(presenterWrapper.state().btnStartText).toEqual('Start')
  })
})
