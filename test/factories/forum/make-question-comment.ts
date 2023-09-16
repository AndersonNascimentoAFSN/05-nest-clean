import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities'

type MakeQuestionCommentParams = {
  override?: Partial<QuestionCommentProps>
  slugText?: string
  id?: UniqueEntityID
}

export function makeQuestionComment({
  override = {},
  id,
}: MakeQuestionCommentParams) {
  const questionComment = QuestionComment.create(
    {
      questionId: new UniqueEntityID(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return questionComment
}
