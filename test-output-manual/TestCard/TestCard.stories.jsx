import React from 'react'
import { TestCard } from './TestCard'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof TestCard> = {
  title: 'Components/TestCard',
  component: TestCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TestCard>

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
