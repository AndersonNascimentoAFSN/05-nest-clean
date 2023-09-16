import { Controller, Get, HttpCode } from '@nestjs/common'

import { PrismaService } from '@/infra/prisma/prisma.service'

@Controller('/accounts')
export class FetchAccountController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const users = await this.prisma.user.findMany()

    return { users }
  }
}
