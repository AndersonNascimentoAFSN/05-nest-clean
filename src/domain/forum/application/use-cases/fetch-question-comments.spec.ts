import { InMemoryQuestionCommentsRepository } from 'test'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories'
import { UniqueEntityID } from '@/core'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch  question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        override: {
          questionId: new UniqueEntityID('question-1'),
        },
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        override: {
          questionId: new UniqueEntityID('question-1'),
        },
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        override: {
          questionId: new UniqueEntityID('question-1'),
        },
      }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i = i + 1) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          override: {
            questionId: new UniqueEntityID('question-1'),
          },
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
