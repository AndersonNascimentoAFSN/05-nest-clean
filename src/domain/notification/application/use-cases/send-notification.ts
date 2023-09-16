import { Either, UniqueEntityID, right } from '@/core'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { NotificationsRepository } from '../repositories'

export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      title,
      content,
      recipientId: new UniqueEntityID(recipientId),
    })

    await this.notificationRepository.create(notification)

    return right({
      notification,
    })
  }
}
