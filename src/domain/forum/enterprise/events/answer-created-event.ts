import { UniqueEntityID } from '@/core'
import { DomainEvent } from '@/core/events/domain-event'
import { Answer } from '../entities'

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.answer = answer
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}
