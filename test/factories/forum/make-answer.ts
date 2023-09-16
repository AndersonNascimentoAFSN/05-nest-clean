import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities'

type MakeAnswerParams = {
  override?: Partial<AnswerProps>
  slugText?: string
  id?: UniqueEntityID
}

export function makeAnswer({ override = {}, id }: MakeAnswerParams) {
  const answer = Answer.create(
    {
      content: faker.lorem.text(),
      questionId: new UniqueEntityID(),
      authorId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return answer
}
