import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controler'
import { FetchAccountController } from './controllers/fetch-account.controller'

@Module({
  imports: [],
  controllers: [CreateAccountController, FetchAccountController],
  providers: [PrismaService],
})
export class AppModule {}
