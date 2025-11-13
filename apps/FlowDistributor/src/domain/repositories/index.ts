/**
 * Repository Interfaces
 * Define contracts for data access layer
 */

import type { Task } from '../entities/Task'
import type { Workflow } from '../entities/Workflow'

export interface IWorkflowRepository {
  findById(id: string): Promise<Workflow | null>
  findAll(filters?: WorkflowFilters): Promise<Workflow[]>
  findByUser(userId: string): Promise<Workflow[]>
  save(workflow: Workflow): Promise<void>
  update(id: string, data: Partial<Workflow>): Promise<void>
  delete(id: string): Promise<void>
}

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>
  findByWorkflow(workflowId: string): Promise<Task[]>
  findByAssignee(userId: string): Promise<Task[]>
  save(task: Task): Promise<void>
  update(id: string, data: Partial<Task>): Promise<void>
  delete(id: string): Promise<void>
  bulkUpdate(tasks: Array<{ id: string; data: Partial<Task> }>): Promise<void>
}

export interface WorkflowFilters {
  status?: string
  priority?: string
  assignee?: string
  tags?: string[]
  createdAfter?: Date
  createdBefore?: Date
}
