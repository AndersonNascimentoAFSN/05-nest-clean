import { faker } from '@faker-js/faker'

import {
  InMemoryAnswerAttachmentsRepository,
  InMemoryAnswerCommentsRepository,
  InMemoryAnswersRepository,
} from 'test'
import { makeAnswer } from 'test/factories'
import { UniqueEntityID } from '@/core'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { ResourceNotFoundError } from '../../../../core/errors/errors'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const commentContent = faker.lorem.text()

    const answer = makeAnswer({})

    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
      content: commentContent,
    })

    if (result.isRight()) {
      expect(inMemoryAnswerCommentsRepository.items[0]).toEqual(
        result.value?.answerComment,
      )
    }
  })

  it('should not be able to comment if answer not exists', async () => {
    const answer = makeAnswer({
      id: new UniqueEntityID('answer-1'),
      override: { authorId: new UniqueEntityID('author-1') },
    })

    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: 'answer-2',
      content: 'comment content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
