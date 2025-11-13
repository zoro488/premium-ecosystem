import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlassCard } from './GlassCard'

describe('GlassCard', () => {
  it('renders without crashing', () => {
    render(<GlassCard />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
