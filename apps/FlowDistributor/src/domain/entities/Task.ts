/**
 * Task Entity
 * Core business entity representing a task within a workflow
 */

export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'blocked'

export interface Task {
  id: string
  workflowId: string
  title: string
  description: string
  status: TaskStatus
  assignedTo: string[]
  dependencies: string[]
  estimatedHours: number
  actualHours?: number
  startDate?: Date
  dueDate?: Date
  completedAt?: Date
  priority: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskData {
  workflowId: string
  title: string
  description: string
  assignedTo?: string[]
  dependencies?: string[]
  estimatedHours?: number
  dueDate?: Date
  priority?: number
}

/**
 * Task factory
 */
export class TaskEntity {
  static create(data: CreateTaskData): Task {
    const now = new Date()

    return {
      id: crypto.randomUUID(),
      workflowId: data.workflowId,
      title: data.title,
      description: data.description,
      status: 'pending',
      assignedTo: data.assignedTo || [],
      dependencies: data.dependencies || [],
      estimatedHours: data.estimatedHours || 0,
      dueDate: data.dueDate,
      priority: data.priority || 0,
      createdAt: now,
      updatedAt: now,
    }
  }

  static validate(task: Partial<Task>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!task.title || task.title.trim().length === 0) {
      errors.push('Title is required')
    }

    if (task.title && task.title.length > 200) {
      errors.push('Title must be less than 200 characters')
    }

    if (!task.workflowId) {
      errors.push('Workflow ID is required')
    }

    if (task.estimatedHours !== undefined && task.estimatedHours < 0) {
      errors.push('Estimated hours must be positive')
    }

    if (task.priority !== undefined && (task.priority < 0 || task.priority > 10)) {
      errors.push('Priority must be between 0 and 10')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static canComplete(task: Task, allTasks: Task[]): boolean {
    // Check if all dependencies are completed
    const dependencies = allTasks.filter(t => task.dependencies.includes(t.id))
    return dependencies.every(dep => dep.status === 'completed')
  }
}
