import { faker } from '@faker-js/faker'

import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'test'
import { UniqueEntityID } from '@/core'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      title: 'new notification',
      content: faker.lorem.text(),
      recipientId: new UniqueEntityID().toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
