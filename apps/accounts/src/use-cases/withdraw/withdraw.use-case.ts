import { IUseCase } from '@app/core/interfaces'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { AccountEntity } from '../../entities/account.entity'
import { TransactionEntity } from '../../entities/transaction.entity'
import { TransactionKindEnum } from '../../helpers/transaction-kind.enum'
import { AccountsRepository } from '../../repositories/accounts.repository'
import { WithdrawDTO } from './withdraw.dto'

@Injectable()
export class WithdrawUseCase implements IUseCase {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(id: number, dto: WithdrawDTO): Promise<TransactionEntity> {
    return await this.accountsRepository.createQueryBuilder().connection.transaction(async (manager) => {
      const accountsRepository = manager.getRepository(AccountEntity)
      const transactionsRepository = manager.getRepository(TransactionEntity)

      const account = await accountsRepository.findOne({ where: { id }, lock: { mode: 'pessimistic_write' } })
      if (!account) throw new NotFoundException('Account not found', `Could not to find account with id ${id}`)

      if (dto.amount > account.balance) throw new BadRequestException('Insuficient funds', `Insufficient funds to complete withdraw`)

      const transaction = await transactionsRepository.save({ accountId: id, kind: TransactionKindEnum.WITHDRAW, value: dto.amount })
      await accountsRepository.update({ id }, { balance: account.balance - dto.amount })

      return transaction
    })
  }
}
