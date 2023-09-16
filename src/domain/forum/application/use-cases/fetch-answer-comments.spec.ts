import { InMemoryAnswerCommentsRepository } from 'test'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories'
import { UniqueEntityID } from '@/core'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch  answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        override: {
          answerId: new UniqueEntityID('answer-1'),
        },
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        override: {
          answerId: new UniqueEntityID('answer-1'),
        },
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        override: {
          answerId: new UniqueEntityID('answer-1'),
        },
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i = i + 1) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          override: {
            answerId: new UniqueEntityID('answer-1'),
          },
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
