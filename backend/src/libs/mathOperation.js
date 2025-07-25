import { round, add, subtract, multiply, divide } from 'mathjs';

export class MathPrecision {
  // Default precision, can be adjusted
  static #precision = 2

  // Helper method to round to the set precision
  static round(number) {
    return number ? round(number, this.#precision) : 0
  }

  // Addition with rounding
  static plus(...args) {
    return this.round(add(...args))
  }

  // Subtraction with rounding
  static minus(...args) {
    return this.round(subtract(...args))
  }

  // Multiplication with rounding
  static times(...args) {
    return this.round(multiply(...args))
  }

  // Division with rounding
  static divide(...args) {
    return this.round(divide(...args))
  }
}
