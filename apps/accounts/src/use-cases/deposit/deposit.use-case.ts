import { IUseCase } from '@app/core/interfaces'
import { Injectable, NotFoundException } from '@nestjs/common'
import { AccountEntity } from '../../entities/account.entity'
import { TransactionEntity } from '../../entities/transaction.entity'
import { TransactionKindEnum } from '../../helpers/transaction-kind.enum'
import { AccountsRepository } from '../../repositories/accounts.repository'
import { DepositDTO } from './deposit.dto'

@Injectable()
export class DepositUseCase implements IUseCase {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(id: number, dto: DepositDTO): Promise<TransactionEntity> {
    return await this.accountsRepository.createQueryBuilder().connection.transaction(async (manager) => {
      const accountsRepository = manager.getRepository(AccountEntity)
      const transactionsRepository = manager.getRepository(TransactionEntity)

      const account = await accountsRepository.findOne({ where: { id }, lock: { mode: 'pessimistic_write' } })
      if (!account) throw new NotFoundException('Account not found', `Could not to find account with id ${id}`)

      const transaction = await transactionsRepository.save(transactionsRepository.create({ accountId: id, kind: TransactionKindEnum.DEPOSIT, value: dto.amount }))
      await accountsRepository.update({ id }, { balance: account.balance + dto.amount })

      account.balance = account.balance + dto.amount
      transaction.account = account

      return transaction
    })
  }
}
