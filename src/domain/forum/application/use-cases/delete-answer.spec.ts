import {
  InMemoryAnswerAttachmentsRepository,
  InMemoryAnswersRepository,
} from 'test'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer, makeAnswerAttachment } from 'test/factories'
import { UniqueEntityID } from '@/core'
import { NotAllowedError } from '../../../../core/errors/errors'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer By Id', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete a answer by id', async () => {
    const newAnswer = makeAnswer({
      id: new UniqueEntityID('answer-1'),
      override: { authorId: new UniqueEntityID('author-1') },
    })

    inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        override: {
          answerId: newAnswer.id,
          attachmentId: new UniqueEntityID('1'),
        },
      }),
      makeAnswerAttachment({
        override: {
          answerId: newAnswer.id,
          attachmentId: new UniqueEntityID('2'),
        },
      }),
    )

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-1',
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer({
      id: new UniqueEntityID('answer-1'),
      override: { authorId: new UniqueEntityID('author-1') },
    })

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
