import React from 'react'
import { PremiumHero } from './PremiumHero'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof PremiumHero> = {
  title: 'Components/PremiumHero',
  component: PremiumHero,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PremiumHero>

export const Default: Story = {
  args: {
    // Default props
  },
}

export const WithCustomProps: Story = {
  args: {
    // Custom props
  },
}

export const Interactive: Story = {
  args: {
    // Interactive props
  },
  play: async ({ canvasElement }) => {
    // Interaction tests
  },
}
