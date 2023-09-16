import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return questionAttachment
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = questionAttachment
  }
}
