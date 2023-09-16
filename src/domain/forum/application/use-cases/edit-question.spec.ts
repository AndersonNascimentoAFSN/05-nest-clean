import {
  InMemoryQuestionsRepository,
  InMemoryQuestionAttachmentsRepository,
} from 'test'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion, makeQuestionAttachment } from 'test/factories'
import { UniqueEntityID, NotAllowedError } from '@/core'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question By Id', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    )
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentRepository,
    )
  })

  it('should be able to edit a question by id', async () => {
    const questionId = 'question-1'
    const authorId = 'author-1'

    const newQuestion = makeQuestion({
      id: new UniqueEntityID(questionId),
      override: { authorId: new UniqueEntityID(authorId) },
    })

    inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentRepository.items.push(
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
      authorId,
      questionId: newQuestion.id.toString(),
      content: 'New question content',
      title: 'New question title',
      attachmentIds: ['1', '3'],
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'New question title',
      content: 'New question content',
    })

    expect(
      inMemoryQuestionsRepository.items[0].attachments.getItems(),
    ).toHaveLength(2)
    expect(inMemoryQuestionsRepository.items[0].attachments.getItems()).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
      ],
    )
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion({
      id: new UniqueEntityID('question-1'),
      override: { authorId: new UniqueEntityID('author-1') },
    })

    inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: newQuestion.id.toString(),
      content: 'New question content',
      title: 'New question title',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
