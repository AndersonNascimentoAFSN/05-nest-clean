import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt.auth.guard'
import { userPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipes'
import { PrismaService } from '@/prisma/prisma.service'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionDto = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionDto,
    @CurrentUser() user: userPayload,
  ) {
    const { content, title } = body
    const userId = user.sub

    const slug = this.convertToSlug(title)

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    })
  }

  private convertToSlug(Text: string) {
    return Text.toLowerCase()
      .normalize('NFD')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '-')
  }
}
