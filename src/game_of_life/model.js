/* Customize exception
 * See https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
 */
class ValueError extends Error {}
class OutOfBoundError extends Error {}

class World {
  constructor (width, height) {
    if (width <= 0 || height <= 0) {
      throw new ValueError('width and height must all larger than 0')
    }

    this.width = width
    this.height = height
    this.alives = new Map()  // This Map is used as a Set in Python
  }

  _testBoundary (x, y) {
    if (x < 0 || x >= this.width) {
      throw new OutOfBoundError('x: ' + x.toString())
    }
    if (y < 0 || y >= this.height) {
      throw new OutOfBoundError('y: ' + y.toString())
    }
  }

  setAlive (x, y) {
    this._testBoundary(x, y)

    this.alives.set([x, y].toString(), [x, y])
  }

  isAlive (x, y) {
    this._testBoundary(x, y)

    return this.alives.has([x, y].toString())
  }

  getAlives () {
    return Array.from(this.alives.values())
  }

  setDead (x, y) {
    this._testBoundary(x, y)

    this.alives.delete([x, y].toString())
  }

  toggleAliveness (x, y) {
    this._testBoundary(x, y)

    if (this.alives.has([x, y].toString())) {
      this.setDead(x, y)
    } else {
      this.setAlive(x, y)
    }
  }

  _calcNeighbors (x, y) {
    this._testBoundary(x, y)

    let allNbrs = [[x - 1, y - 1],
                    [x - 1, y],
                    [x - 1, y + 1],
                    [x, y - 1],
                    [x, y + 1],
                    [x + 1, y - 1],
                    [x + 1, y],
                    [x + 1, y + 1]]

    let inboundNbrs = []
    for (let [x, y] of allNbrs) {
      if ((x >= 0 && x < this.width) &&
          (y >= 0 && y < this.height)) {
        inboundNbrs.push([x, y])
      }
    }

    return inboundNbrs
  }

  _calcAliveness (x, y) {
    this._testBoundary(x, y)

    let nbrs = this._calcNeighbors(x, y)
    let aliveNbrsCount = nbrs.filter((nbr) => this.isAlive(nbr[0], nbr[1])).length

    if (this.isAlive(x, y)) {
      if (aliveNbrsCount < 2) {
        return false
      } else if (aliveNbrsCount < 4) {
        return true
      } else {
        return false
      }
    } else {
      return aliveNbrsCount === 3
    }
  }

  advance () {
    let nextAlives = new Map()
    for (let [x, y] of this.alives.values()) {
      for (let [nbrX, nbrY] of this._calcNeighbors(x, y)) {
        if (this._calcAliveness(nbrX, nbrY)) {
          nextAlives.set([nbrX, nbrY].toString(), [nbrX, nbrY])
        }
      }
    }

    this.alives = nextAlives
  }
}

export { World, ValueError, OutOfBoundError }
