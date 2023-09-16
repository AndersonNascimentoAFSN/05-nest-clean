import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core'
import { Question, QuestionProps } from '@/domain/forum/enterprise/entities'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

type MakeQuestionParams = {
  override?: Partial<QuestionProps>
  slugText?: string
  id?: UniqueEntityID
}

export function makeQuestion({
  override = {},
  slugText = faker.lorem.sentence(),
  id,
}: MakeQuestionParams) {
  const questionTitle = faker.lorem.sentence()
  const questionContent = faker.lorem.text()

  const question = Question.create(
    {
      title: questionTitle,
      slug: Slug.create(slugText),
      content: questionContent,
      authorId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return question
}
