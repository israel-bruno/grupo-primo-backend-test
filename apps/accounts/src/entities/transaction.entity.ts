import { ColumnNumericTransformer } from '@app/core/helpers'
import { faker } from '@faker-js/faker'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { TransactionKindEnum } from '../helpers/transaction-kind.enum'
import { AccountEntity } from './account.entity'

@Entity('account_transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'account_id' })
  accountId: number

  @Column()
  kind: `${TransactionKindEnum}`

  @Column({ transformer: new ColumnNumericTransformer(), type: 'numeric' })
  value: number

  @Column({ name: 'target_account_id' })
  targetAccountId?: number | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'target_account_id' })
  targetAccount?: AccountEntity

  static withdrawExample(): TransactionEntity {
    const account = AccountEntity.example()

    return {
      id: faker.number.int({ min: 1, max: 1000000 }),
      accountId: account.id,
      kind: 'withdraw',
      value: Number(faker.finance.amount()),
      createdAt: faker.date.anytime(),
      account,
    }
  }

  static depositExample(): TransactionEntity {
    const account = AccountEntity.example()

    return {
      id: faker.number.int({ min: 1, max: 1000000 }),
      accountId: account.id,
      kind: 'deposit',
      value: Number(faker.finance.amount()),
      createdAt: faker.date.anytime(),
      account,
    }
  }

  static transferExample(): TransactionEntity {
    const account = AccountEntity.example()
    const targetAccount = AccountEntity.example()

    return {
      id: faker.number.int({ min: 1, max: 1000000 }),
      accountId: account.id,
      kind: 'deposit',
      value: Number(faker.finance.amount()),
      createdAt: faker.date.anytime(),
      targetAccountId: targetAccount.id,
      account,
      targetAccount,
    }
  }
}
