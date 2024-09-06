import { BaseModule } from '@app/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountsController } from './accounts.controller'
import { AccountEntity } from './entities/account.entity'
import { TransactionEntity } from './entities/transaction.entity'
import { AccountsRepository } from './repositories/accounts.repository'
import { CreateAccountUseCase } from './use-cases/create-account/create-account.use-case'
import { DepositUseCase } from './use-cases/deposit/deposit.use-case'
import { ListAccountsUseCase } from './use-cases/list-accounts/list-account.use-case'
import { TransferUseCase } from './use-cases/transfer/transfer.use-case'
import { WithdrawUseCase } from './use-cases/withdraw/withdraw.use-case'

export const AccountModuleEntities = [AccountEntity, TransactionEntity]
const AccountUseCases = [CreateAccountUseCase, ListAccountsUseCase, WithdrawUseCase, DepositUseCase, TransferUseCase]
const AccountRepositories = [AccountsRepository]

@Module({
  imports: [BaseModule, TypeOrmModule.forFeature(AccountModuleEntities)],
  controllers: [AccountsController],
  providers: [...AccountUseCases, ...AccountRepositories],
})
export class AccountsModule {}
