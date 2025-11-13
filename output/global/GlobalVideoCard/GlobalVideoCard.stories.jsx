import React from 'react'
import { GlobalVideoCard } from './GlobalVideoCard'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof GlobalVideoCard> = {
  title: 'Components/GlobalVideoCard',
  component: GlobalVideoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof GlobalVideoCard>

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
