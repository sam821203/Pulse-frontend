import { describe, expect, it } from 'vitest'
import { EMPTY } from '../../constants/stockFields'
import { formatInteger, formatPrice, parseNumeric } from '../stockFormatters'

describe('stockFormatters utils', () => {
  it('parseNumeric strips commas and parses numbers', () => {
    expect(parseNumeric('1,234.5')).toBe(1234.5)
  })

  it('parseNumeric returns null for EMPTY placeholder', () => {
    expect(parseNumeric(EMPTY)).toBeNull()
  })

  it('formatPrice formats with locale digits', () => {
    expect(formatPrice('1234.5', 1)).toMatch(/1,234/)
  })

  it('formatInteger rounds to whole numbers', () => {
    expect(formatInteger('1234.6')).toBe('1,235')
  })
})
