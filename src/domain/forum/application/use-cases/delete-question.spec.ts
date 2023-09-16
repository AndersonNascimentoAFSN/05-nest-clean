import {
  InMemoryQuestionAttachmentsRepository,
  InMemoryQuestionsRepository,
} from 'test'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion, makeQuestionAttachment } from 'test/factories'
import { UniqueEntityID, NotAllowedError } from '@/core'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question By Id', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to delete a question by id', async () => {
    const newQuestion = makeQuestion({
      id: new UniqueEntityID('question-1'),
      override: { authorId: new UniqueEntityID('author-1') },
    })

    inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        override: {
          questionId: newQuestion.id,
          attachmentId: new UniqueEntityID('1'),
        },
      }),
      makeQuestionAttachment({
        override: {
          questionId: newQuestion.id,
          attachmentId: new UniqueEntityID('2'),
        },
      }),
    )

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-1',
    })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion({
      id: new UniqueEntityID('question-1'),
      override: { authorId: new UniqueEntityID('author-1') },
    })

    inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
