import { BaseModule } from '@app/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountsController } from './accounts.controller'
import { AccountEntity } from './entities/account.entity'
import { CreateAccountUseCase } from './use-cases/create-account/create-account.use-case'

export const AccountModuleEntities = [AccountEntity]
const AccountUseCases = [CreateAccountUseCase]

@Module({
  imports: [BaseModule, TypeOrmModule.forFeature(AccountModuleEntities)],
  controllers: [AccountsController],
  providers: [...AccountUseCases],
})
export class AccountsModule {}
