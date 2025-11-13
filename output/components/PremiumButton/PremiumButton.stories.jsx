import React from 'react'
import { PremiumButton } from './PremiumButton'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof PremiumButton> = {
  title: 'Components/PremiumButton',
  component: PremiumButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PremiumButton>

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
