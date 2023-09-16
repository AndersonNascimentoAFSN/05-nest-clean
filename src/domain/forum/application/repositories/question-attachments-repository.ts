import { QuestionAttachment } from '@/domain/forum/enterprise/entities'

export interface QuestionAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<Array<QuestionAttachment>>
  deleteManyByQuestionId(questionId: string): Promise<void>
}
