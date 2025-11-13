import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestCard } from './TestCard'

describe('TestCard', () => {
  it('renders without crashing', () => {
    render(<TestCard />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
