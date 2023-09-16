import { UniqueEntityID } from '@/core'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities'

type MakeQuestionAttachmentParams = {
  override?: Partial<QuestionAttachmentProps>
  slugText?: string
  id?: UniqueEntityID
}

export function makeQuestionAttachment({
  override = {},
  id,
}: MakeQuestionAttachmentParams) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return questionAttachment
}
