/**
 * Workflow Entity
 * Core business entity representing a workflow
 */

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived'
export type WorkflowPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  createdBy: string
  createdAt: Date
  updatedAt: Date
  assignees: string[]
  priority: WorkflowPriority
  deadline?: Date
  tags: string[]
  metadata: Record<string, unknown>
}

export interface CreateWorkflowData {
  name: string
  description: string
  assignees?: string[]
  priority?: WorkflowPriority
  deadline?: Date
  tags?: string[]
}

/**
 * Workflow factory
 */
export class WorkflowEntity {
  static create(data: CreateWorkflowData, userId: string): Workflow {
    const now = new Date()

    return {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      status: 'draft',
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      assignees: data.assignees || [],
      priority: data.priority || 'medium',
      deadline: data.deadline,
      tags: data.tags || [],
      metadata: {},
    }
  }

  static validate(workflow: Partial<Workflow>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!workflow.name || workflow.name.trim().length === 0) {
      errors.push('Name is required')
    }

    if (workflow.name && workflow.name.length > 100) {
      errors.push('Name must be less than 100 characters')
    }

    if (!workflow.description || workflow.description.trim().length === 0) {
      errors.push('Description is required')
    }

    if (workflow.deadline && workflow.deadline < new Date()) {
      errors.push('Deadline must be in the future')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
