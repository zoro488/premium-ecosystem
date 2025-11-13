import React from 'react'
import { PremiumVideoCard } from './PremiumVideoCard'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof PremiumVideoCard> = {
  title: 'Components/PremiumVideoCard',
  component: PremiumVideoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PremiumVideoCard>

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
