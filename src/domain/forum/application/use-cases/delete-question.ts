import { QuestionsRepository } from '@/domain/forum/application/repositories'
import {
  NotAllowedError,
  ResourceNotFoundError,
} from '../../../../core/errors/errors'
import { Either, left, right } from '@/core'

interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.questionRepository.delete(question)

    return right({})
  }
}
