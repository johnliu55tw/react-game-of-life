/* eslint-env jest */
import { World, ValueError, OutOfBoundError } from './model'

test('Constructor', () => {
  let world = new World(20, 30)

  expect(world.width).toBe(20)
  expect(world.height).toBe(30)
})

test('Constructor failed', () => {
  expect(() => new World(-10, 10)).toThrow(ValueError)
  expect(() => new World(0, 10)).toThrow(ValueError)
  expect(() => new World(10, -10)).toThrow(ValueError)
  expect(() => new World(10, 0)).toThrow(ValueError)
  expect(() => new World(-10, -10)).toThrow(ValueError)
  expect(() => new World(0, 0)).toThrow(ValueError)
})

test('setAlive method using isAlive method', () => {
  let world = new World(20, 30)

  world.setAlive(2, 3)

  expect(world.isAlive(2, 3)).toBe(true)
})

test('setAlive method will not duplicate element', () => {
  let world = new World(20, 30)

  world.setAlive(2, 3)
  world.setAlive(2, 3)

  expect(world.getAlives()).toEqual([[2, 3]].sort())
})

test('setAlive method value out of bound', () => {
  let world = new World(20, 30)

  expect(() => world.setAlive(999, 999)).toThrow(OutOfBoundError)
  expect(() => world.setAlive(-1, -2)).toThrow(OutOfBoundError)
})

test('isAlive method value out of bound', () => {
  let world = new World(20, 30)

  expect(() => world.isAlive(999, 999)).toThrow(OutOfBoundError)
  expect(() => world.isAlive(-1, -2)).toThrow(OutOfBoundError)
})

test('getAlives method', () => {
  let world = new World(20, 30)

  world.setAlive(3, 4)
  world.setAlive(4, 5)
  world.setAlive(6, 7)

  expect(world.getAlives().sort()).toEqual(
         [[3, 4], [4, 5], [6, 7]].sort())
})

test('setDead method', () => {
  let world = new World(20, 30)

  world.setAlive(3, 4)
  world.setDead(3, 4)

  expect(world.isAlive(3, 4)).toBe(false)
})

test('setDead method value out of bound', () => {
  let world = new World(20, 30)

  expect(() => world.setDead(999, 999)).toThrow(OutOfBoundError)
  expect(() => world.setDead(-1, -2)).toThrow(OutOfBoundError)
})

test('toggleAliveness method from alive to dead', () => {
  let world = new World(20, 30)

  world.setAlive(3, 4)
  world.toggleAliveness(3, 4)

  expect(world.isAlive(3, 4)).toBe(false)
})

test('toggleAliveness method from dead to alive', () => {
  let world = new World(20, 30)

  world.toggleAliveness(3, 4)

  expect(world.isAlive(3, 4)).toBe(true)
})

test('toggleAliveness method value out of bound', () => {
  let world = new World(20, 30)

  expect(() => world.toggleAliveness(999, 999)).toThrow(OutOfBoundError)
  expect(() => world.toggleAliveness(-1, -2)).toThrow(OutOfBoundError)
})

test('calcNeighbors method', () => {
  let world = new World(20, 30)

  let nbrs = world._calcNeighbors(3, 4).sort()

  expect(nbrs).toEqual(
         [[2, 3],
          [2, 4],
          [2, 5],
          [3, 3],
          [3, 5],
          [4, 3],
          [4, 4],
          [4, 5]].sort())
})

test('_calcNeighbors method at corners', () => {
  let world = new World(20, 30)
  let nbrs

  // Bottom left
  nbrs = world._calcNeighbors(0, 0).sort()
  expect(nbrs).toEqual(
         [[0, 1],
          [1, 0],
          [1, 1]].sort())

  // Bottom right
  nbrs = world._calcNeighbors(19, 0).sort()
  expect(nbrs).toEqual(
         [[18, 0],
          [18, 1],
          [19, 1]].sort())

  // Upper left
  nbrs = world._calcNeighbors(0, 29).sort()
  expect(nbrs).toEqual(
         [[0, 28],
          [1, 28],
          [1, 29]].sort())

  // Upper right
  nbrs = world._calcNeighbors(19, 29).sort()
  expect(nbrs).toEqual(
         [[18, 28],
          [18, 29],
          [19, 28]].sort())
})

test('_calcNeighbors method at side', () => {
  let world = new World(20, 30)
  let nbrs

  // Left side
  nbrs = world._calcNeighbors(0, 5).sort()
  expect(nbrs).toEqual(
         [[0, 6],
          [1, 6],
          [1, 5],
          [1, 4],
          [0, 4]].sort())

  // Right side
  nbrs = world._calcNeighbors(19, 5).sort()
  expect(nbrs).toEqual(
         [[19, 6],
          [18, 6],
          [18, 5],
          [18, 4],
          [19, 4]].sort())

  // Upper side
  nbrs = world._calcNeighbors(5, 29).sort()
  expect(nbrs).toEqual(
         [[4, 29],
          [4, 28],
          [5, 28],
          [6, 28],
          [6, 29]].sort())

  // Bottom side
  nbrs = world._calcNeighbors(5, 0).sort()
  expect(nbrs).toEqual(
         [[4, 0],
          [4, 1],
          [5, 1],
          [6, 1],
          [6, 0]].sort())
})

test('_calcNeighbors method value out of bound', () => {
  let world = new World(20, 30)

  expect(() => world._calcNeighbors(999, 999)).toThrow(OutOfBoundError)
  expect(() => world._calcNeighbors(-1, -2)).toThrow(OutOfBoundError)
})

test('_calcAliveness method: Dead rules', () => {
  let world = new World(20, 30)
  world.setAlive(5, 5)

  // Dead by no neighbors
  expect(world._calcAliveness(5, 5)).toBe(false)

  // Dead by one neighbors
  world.setAlive(5, 6)

  expect(world._calcAliveness(5, 5)).toBe(false)

  // Dead by four neighbors
  world.setAlive(5, 6)
  world.setAlive(5, 4)
  world.setAlive(6, 6)
  world.setAlive(4, 4)

  expect(world._calcAliveness(5, 5)).toBe(false)

  // Dead by five neighbors
  world.setAlive(5, 6)
  world.setAlive(5, 4)
  world.setAlive(6, 6)
  world.setAlive(4, 4)
  world.setAlive(4, 5)
})

test('_calcAliveness method: Survive rules', () => {
  let world = new World(20, 30)
  world.setAlive(5, 5)

  // Survived by two neighbors
  world.setAlive(5, 6)
  world.setAlive(6, 6)

  expect(world._calcAliveness(5, 5)).toBe(true)

  // Survived by three neighbors
  world.setAlive(5, 6)
  world.setAlive(6, 6)
  world.setAlive(5, 4)

  expect(world._calcAliveness(5, 5)).toBe(true)
})

test('_calcAliveness method: Populated', () => {
  let world = new World(20, 30)

  // Populated by exactly three neighbors
  world.setAlive(5, 4)
  world.setAlive(5, 6)
  world.setAlive(6, 5)

  expect(world._calcAliveness(5, 5)).toBe(true)
})

test('_calcAliveness method value out of bound', () => {
  let world = new World(20, 30)

  expect(() => world._calcAliveness(999, 999)).toThrow(OutOfBoundError)
  expect(() => world._calcAliveness(-1, -2)).toThrow(OutOfBoundError)
})

test('advance method', () => {
  let world = new World(10, 10)

  world.setAlive(9, 9)
  world.setAlive(8, 9)
  world.setAlive(9, 8)

  world.advance()

  expect(world.getAlives().sort()).toEqual(
         [[9, 9],
          [8, 9],
          [9, 8],
          [8, 8]].sort())
})
