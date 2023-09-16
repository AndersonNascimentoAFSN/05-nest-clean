import { UniqueEntityID } from '@/core'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities'

type MakeAnswerAttachmentParams = {
  override?: Partial<AnswerAttachmentProps>
  slugText?: string
  id?: UniqueEntityID
}

export function makeAnswerAttachment({
  override = {},
  id,
}: MakeAnswerAttachmentParams) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return answerAttachment
}
