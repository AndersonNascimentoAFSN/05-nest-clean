import { ReadNotificationUseCase } from './read-notification'
import { InMemoryNotificationsRepository } from 'test'
import { NotAllowedError, ResourceNotFoundError, UniqueEntityID } from '@/core'
import { makeNotification } from 'test/factories'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should be able to read a notification', async () => {
    const notification = makeNotification({})

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(inMemoryNotificationsRepository.items[0]).toMatchObject({
      readAt: expect.any(Date),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      notification: expect.objectContaining({
        readAt: expect.any(Date),
      }),
    })
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      id: new UniqueEntityID('question-1'),
      override: { recipientId: new UniqueEntityID('recipientId-1') },
    })

    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'recipientId-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to read a notification if it not exist', async () => {
    const notification = makeNotification({
      id: new UniqueEntityID('notificationId-1'),
    })

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: 'notificationId-2',
      recipientId: notification.recipientId.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
