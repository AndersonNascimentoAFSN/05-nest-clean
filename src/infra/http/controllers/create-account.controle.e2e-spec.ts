import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/infra/prisma/prisma.service'

describe('Create Account (e2e)', () => {
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

  test('[POST] /accounts', async () => {
    const email = faker.internet.email()

    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: faker.internet.userName(),
      email,
      password: faker.internet.password(),
    })

    expect(response.statusCode).toBe(201)
    expect(response.status).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    expect(userOnDatabase?.email).toEqual(email)
  })
})
