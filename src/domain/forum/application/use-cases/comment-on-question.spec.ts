import { faker } from '@faker-js/faker'

import {
  InMemoryQuestionAttachmentsRepository,
  InMemoryQuestionCommentsRepository,
  InMemoryQuestionsRepository,
} from 'test'
import { makeQuestion } from 'test/factories'
import { UniqueEntityID } from '@/core'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { ResourceNotFoundError } from '../../../../core/errors/errors'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const commentContent = faker.lorem.text()

    const question = makeQuestion({})

    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: commentContent,
    })

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      commentContent,
    )
  })

  it('should not be able to comment if question not exists', async () => {
    const question = makeQuestion({
      id: new UniqueEntityID('question-1'),
      override: { authorId: new UniqueEntityID('author-1') },
    })

    await inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({
      authorId: question.authorId.toString(),
      questionId: 'question-2',
      content: 'comment content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
