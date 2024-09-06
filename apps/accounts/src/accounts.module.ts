import { BaseModule } from '@app/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountsController } from './accounts.controller'
import { AccountEntity } from './entities/account.entity'
import { AccountsRepository } from './repositories/accounts.repository'
import { CreateAccountUseCase } from './use-cases/create-account/create-account.use-case'
import { ListAccountsUseCase } from './use-cases/list-accounts/list-account.use-case'

export const AccountModuleEntities = [AccountEntity]
const AccountUseCases = [CreateAccountUseCase, ListAccountsUseCase]
const AccountRepositories = [AccountsRepository]

@Module({
  imports: [BaseModule, TypeOrmModule.forFeature(AccountModuleEntities)],
  controllers: [AccountsController],
  providers: [...AccountUseCases, ...AccountRepositories],
})
export class AccountsModule {}
