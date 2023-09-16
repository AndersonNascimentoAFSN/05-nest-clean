import {
  Either,
  left,
  right,
  ResourceNotFoundError,
  NotAllowedError,
} from '@/core'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { NotificationsRepository } from '../repositories'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) return left(new ResourceNotFoundError())

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationRepository.create(notification)

    return right({
      notification,
    })
  }
}
