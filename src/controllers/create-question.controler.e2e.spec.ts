import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

describe('Create question (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /questions', async () => {
    const titleText = faker.lorem.sentence(3)
    const contentText = faker.lorem.text()

    const user = await prisma.user.create({
      data: {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: titleText,
        content: contentText,
      })

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: titleText,
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.status).toBe(201)
    expect(questionOnDatabase).toMatchObject({
      title: titleText,
      content: contentText,
    })
  })
})
