import { IUseCase } from '@app/core/interfaces'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { In } from 'typeorm'
import { AccountEntity } from '../../entities/account.entity'
import { TransactionEntity } from '../../entities/transaction.entity'
import { TransactionKindEnum } from '../../helpers/transaction-kind.enum'
import { AccountsRepository } from '../../repositories/accounts.repository'
import { TransferDTO } from './transfer.dto'

@Injectable()
export class TransferUseCase implements IUseCase {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(id: number, dto: TransferDTO): Promise<TransactionEntity> {
    return await this.accountsRepository.createQueryBuilder().connection.transaction(async (manager) => {
      const accountsRepository = manager.getRepository(AccountEntity)
      const transactionsRepository = manager.getRepository(TransactionEntity)

      if (id === dto.targetAccountId) throw new BadRequestException('Bad request', 'Cannot transfer founds to same account')

      const accounts = await accountsRepository.find({ where: { id: In([id, dto.targetAccountId]) }, lock: { mode: 'pessimistic_write' } })

      const account = accounts.find((account) => account.id == id)
      const targetAccount = accounts.find((account) => account.id == dto.targetAccountId)

      if (!account) throw new NotFoundException('Account not found', `Could not to find account with id ${id}`)
      if (!targetAccount) throw new NotFoundException('Account not found', `Could not to find account with id ${dto.targetAccountId}`)

      if (dto.amount > account.balance) throw new BadRequestException('Insuficient funds', `Insufficient funds to complete withdraw`)

      const transaction = await transactionsRepository.save(
        transactionsRepository.create({ accountId: id, kind: TransactionKindEnum.TRANSFER, value: dto.amount, targetAccountId: dto.targetAccountId }),
      )

      await Promise.all([
        accountsRepository.update({ id }, { balance: account.balance - dto.amount }),
        accountsRepository.update({ id: dto.targetAccountId }, { balance: targetAccount.balance + dto.amount }),
      ])

      account.balance = account.balance - dto.amount
      targetAccount.balance = targetAccount.balance + dto.amount

      transaction.account = account
      transaction.targetAccount = targetAccount

      return transaction
    })
  }
}
