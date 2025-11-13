import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PremiumHero } from './PremiumHero'

describe('PremiumHero', () => {
  it('renders without crashing', () => {
    render(<PremiumHero />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
