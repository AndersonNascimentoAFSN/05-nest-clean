import { Question } from '@/domain/forum/enterprise/entities'
import {
  AnswersRepository,
  QuestionsRepository,
} from '@/domain/forum/application/repositories'
import { Either, left, right } from '@/core'
import {
  NotAllowedError,
  ResourceNotFoundError,
} from '../../../../core/errors/errors'

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError('Not allowed'))
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return right({ question })
  }
}
