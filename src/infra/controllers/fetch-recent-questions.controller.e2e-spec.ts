import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'

describe('Fetch recent questions (e2e)', () => {
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

  afterEach(async () => {
    await prisma.question.deleteMany({})
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: faker.lorem.sentence(3),
          content: faker.lorem.text(),
          slug: faker.lorem.slug(),
          authorId: user.id,
        },
        {
          title: faker.lorem.sentence(3),
          content: faker.lorem.text(),
          slug: faker.lorem.slug(),
          authorId: user.id,
        },
        {
          title: faker.lorem.sentence(3),
          content: faker.lorem.text(),
          slug: faker.lorem.slug(),
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.status).toBe(200)
    expect(response.body.questions).toHaveLength(3)
  })

  test('[GET] /questions with paginate', async () => {
    const user = await prisma.user.create({
      data: {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: faker.lorem.sentence(3),
          content: faker.lorem.text(),
          slug: faker.lorem.slug(),
          authorId: user.id,
        },
        {
          title: faker.lorem.sentence(3),
          content: faker.lorem.text(),
          slug: faker.lorem.slug(),
          authorId: user.id,
        },
        {
          title: faker.lorem.sentence(3),
          content: faker.lorem.text(),
          slug: faker.lorem.slug(),
          authorId: user.id,
        },
        {
          title: faker.lorem.sentence(3),
          content: faker.lorem.text(),
          slug: faker.lorem.slug(),
          authorId: user.id,
        },
        {
          title: faker.lorem.sentence(3),
          content: faker.lorem.text(),
          slug: faker.lorem.slug(),
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 2,
        perPage: 3,
      })
      .send()

    expect(response.body.questions).toHaveLength(2)
  })
})
