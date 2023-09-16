import { Either, UniqueEntityID, left, right } from '@/core'
import {
  AnswerAttachmentsRepository,
  AnswersRepository,
} from '@/domain/forum/application/repositories'
import { Answer, AnswerAttachment } from '@/domain/forum/enterprise/entities'
import {
  NotAllowedError,
  ResourceNotFoundError,
} from '../../../../core/errors/errors'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  attachmentIds: Array<string>
  content: string
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    attachmentIds,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachment =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachment,
    )

    const answerAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachments)

    answer.attachments = answerAttachmentList

    answer.content = content

    await this.answerRepository.save(answer)

    return right({ answer })
  }
}
