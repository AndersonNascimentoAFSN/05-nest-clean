import { UseCaseError } from '@/core/errors/use-case-error'

export class NotAllowedError extends Error implements UseCaseError {
  public message: string

  constructor(message?: string) {
    super('Not allowed')
    this.message = message || 'Not allowed'
  }
}
