import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatSimulationFailure } from '../src/format-simulation-failure.ts'

describe('format-simulation-failure', () => {
  describe('expected behavior', () => {
    it('should format an error instance with logs', () => {
      // ARRANGE
      expect.assertions(1)
      const error = new Error('Simulation failed')
      const logs = ['Program log: transfer', 'Program failed']

      // ACT
      const result = formatSimulationFailure(error, logs)

      // ASSERT
      expect(result).toBe('Simulation failed\nProgram log: transfer\nProgram failed')
    })

    it('should format bigint object errors', () => {
      // ARRANGE
      expect.assertions(1)
      const error = {
        InstructionError: [0, { Custom: 1n }],
      }

      // ACT
      const result = formatSimulationFailure(error)

      // ASSERT
      expect(result).toBe(`{
  "InstructionError": [
    0,
    {
      "Custom": "1"
    }
  ]
}`)
    })

    it('should format string errors', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const result = formatSimulationFailure('rpc failed')

      // ASSERT
      expect(result).toBe('rpc failed')
    })

    it('should preserve empty simulation log lines', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const result = formatSimulationFailure('', ['Program log: before', '', 'Program log: after'])

      // ASSERT
      expect(result).toBe('Program log: before\n\nProgram log: after')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should fall back when an error object cannot be stringified', () => {
      // ARRANGE
      expect.assertions(1)
      const error: Record<string, unknown> = {}
      error['self'] = error

      // ACT
      const result = formatSimulationFailure(error)

      // ASSERT
      expect(result).toBe('[object Object]')
    })
  })
})
