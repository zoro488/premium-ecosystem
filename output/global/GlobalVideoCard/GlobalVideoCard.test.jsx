import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlobalVideoCard } from './GlobalVideoCard'

describe('GlobalVideoCard', () => {
  it('renders without crashing', () => {
    render(<GlobalVideoCard />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
