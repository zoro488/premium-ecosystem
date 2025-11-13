import React from 'react'
import { GlassCard } from './GlassCard'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof GlassCard> = {
  title: 'Components/GlassCard',
  component: GlassCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof GlassCard>

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
