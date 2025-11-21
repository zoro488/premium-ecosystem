/**
 * Create Workflow Use Case
 * Business logic for creating a new workflow
 */

import { WorkflowEntity, type CreateWorkflowData } from '../entities/Workflow'
import type { IWorkflowRepository } from '../repositories'

export interface IAuthService {
  getCurrentUserId(): Promise<string | null>
}

export class CreateWorkflowUseCase {
  constructor(
    private workflowRepository: IWorkflowRepository,
    private authService: IAuthService
  ) {}

  async execute(data: CreateWorkflowData): Promise<Result<string>> {
    try {
      // Get current user
      const userId = await this.authService.getCurrentUserId()
      if (!userId) {
        return Result.fail('User not authenticated')
      }

      // Create workflow entity
      const workflow = WorkflowEntity.create(data, userId)

      // Validate
      const validation = WorkflowEntity.validate(workflow)
      if (!validation.isValid) {
        return Result.fail(validation.errors.join(', '))
      }

      // Save to repository
      await this.workflowRepository.save(workflow)

      return Result.ok(workflow.id)
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Unknown error')
    }
  }
}

/**
 * Result type for use case responses
 */
export class Result<T> {
  public isSuccess: boolean
  public isFailure: boolean
  public error?: string
  private _value?: T

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this.error = error
    this._value = value
  }

  public get value(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value from failed result')
    }
    return this._value as T
  }

  public static ok<U>(value: U): Result<U> {
    return new Result<U>(true, undefined, value)
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error)
  }
}
