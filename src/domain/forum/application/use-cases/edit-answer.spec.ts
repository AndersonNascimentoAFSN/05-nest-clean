import {
  InMemoryAnswerAttachmentsRepository,
  InMemoryAnswersRepository,
} from 'test'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer, makeAnswerAttachment } from 'test/factories'
import { UniqueEntityID } from '@/core'
import { NotAllowedError } from '../../../../core/errors/errors'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer By Id', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should be able to edit a answer by id', async () => {
    const newAnswer = makeAnswer({
      id: new UniqueEntityID('answer-1'),
      override: { authorId: new UniqueEntityID('author-1') },
    })

    inMemoryAnswersRepository.create(newAnswer)

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
      content: 'new answer content',
      attachmentIds: ['1', '3'],
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'new answer content',
    })

    expect(
      inMemoryAnswersRepository.items[0].attachments.getItems(),
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a answer from another user', async () => {
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

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-2',
      content: 'new answer content',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
