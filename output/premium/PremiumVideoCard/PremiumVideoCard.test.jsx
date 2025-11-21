import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PremiumVideoCard } from './PremiumVideoCard'

describe('PremiumVideoCard', () => {
  it('renders without crashing', () => {
    render(<PremiumVideoCard />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
