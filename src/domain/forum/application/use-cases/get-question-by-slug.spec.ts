import { faker } from '@faker-js/faker'

import {
  InMemoryQuestionAttachmentsRepository,
  InMemoryQuestionsRepository,
} from 'test'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const slugText = faker.lorem.text()
    const questionTitle = faker.lorem.sentence()
    const questionContent = faker.lorem.text()

    const newQuestion = makeQuestion({
      override: {
        slug: Slug.create(slugText),
        content: questionContent,
        title: questionTitle,
      },
      slugText,
    })

    inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      slug: slugText,
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        id: newQuestion.id,
        title: newQuestion.title,
        content: newQuestion.content,
      }),
    })

    // if (result.isRight()) {
    //   expect(result.value?.question.id).toBeTruthy()
    //   expect(result.value.question.title).toEqual(newQuestion.title)
    //   expect(result.value?.question.content).toEqual(newQuestion.content)
    // }
  })
})
