import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities'

type MakeAnswerCommentParams = {
  override?: Partial<AnswerCommentProps>
  slugText?: string
  id?: UniqueEntityID
}

export function makeAnswerComment({
  override = {},
  id,
}: MakeAnswerCommentParams) {
  const answerComment = AnswerComment.create(
    {
      answerId: new UniqueEntityID(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return answerComment
}
