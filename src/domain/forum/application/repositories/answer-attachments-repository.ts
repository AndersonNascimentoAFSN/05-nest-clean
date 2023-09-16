import { AnswerAttachment } from '@/domain/forum/enterprise/entities'

export interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<Array<AnswerAttachment>>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
