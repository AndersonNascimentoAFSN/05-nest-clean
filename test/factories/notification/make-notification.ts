import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities'

type MakeNotificationParams = {
  override?: Partial<NotificationProps>
  id?: UniqueEntityID
}

export function makeNotification({
  override = {},
  id,
}: MakeNotificationParams) {
  const notification = Notification.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      recipientId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return notification
}
