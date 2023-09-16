import { hash } from 'bcryptjs'
import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/prisma/prisma.service'

describe('Authenticate (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST] /sessions', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    await prisma.user.create({
      data: {
        name: faker.internet.userName(),
        email,
        password: await hash(password, 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email,
      password,
    })

    expect(response.statusCode).toBe(201)
    expect(response.status).toBe(201)

    expect(response.body).toHaveProperty('access_token')
    expect(response.body.access_token).toBeTruthy()
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
