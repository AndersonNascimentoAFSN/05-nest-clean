import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt.auth.guard'
import { PrismaService } from '@/infra/prisma/prisma.service'
// import { ZodValidationPipe } from '@/pipes/zod-validation-pipes'
// import { z } from 'zod'

// const pageQueryParamSchema = z
//   .string()
//   .optional()
//   .default('1')
//   .transform(Number)
//   .pipe(z.number().int().positive())

// const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

// type pageQueryParam = z.infer<typeof pageQueryParamSchema>

// const perPageQueryParamSchema = z
//   .string()
//   .optional()
//   .default('10')
//   .transform(Number)
//   .pipe(z.number().int().positive())

// const queryPerPageValidationPipe = new ZodValidationPipe(
//   perPageQueryParamSchema,
// )

// type perPageQueryParam = z.infer<typeof perPageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handle(
    // @Query('page', queryValidationPipe) page: pageQueryParam,
    // @Query('per-page', queryPerPageValidationPipe) perPage: perPageQueryParam,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    const questions = await this.prisma.question.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { questions }
  }
}
