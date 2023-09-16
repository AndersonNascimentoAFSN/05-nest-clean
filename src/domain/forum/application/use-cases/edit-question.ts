import { QuestionAttachment } from './../../enterprise/entities/question-attachment'
import { Either, UniqueEntityID, left, right } from '@/core'
import { QuestionsRepository } from '@/domain/forum/application/repositories'
import {
  Question,
  QuestionAttachmentList,
} from '@/domain/forum/enterprise/entities'
import {
  NotAllowedError,
  ResourceNotFoundError,
} from '../../../../core/errors/errors'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  attachmentIds: string[]
  title: string
  content: string
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    attachmentIds,
    title,
    content,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachment =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachment,
    )

    const questionAttachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    questionAttachmentList.update(questionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
