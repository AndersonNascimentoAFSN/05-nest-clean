import { AnswersRepository } from '@/domain/forum/application/repositories'
import {
  NotAllowedError,
  ResourceNotFoundError,
} from '../../../../core/errors/errors'
import { Either, left, right } from '@/core'

interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answerRepository.delete(answer)

    return right({})
  }
}
