import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PremiumButton } from './PremiumButton'

describe('PremiumButton', () => {
  it('renders without crashing', () => {
    render(<PremiumButton />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
