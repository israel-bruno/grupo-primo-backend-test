import { ColumnNumericTransformer } from '@app/core/helpers'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { TransactionKindEnum } from '../helpers/transaction-kind.enum'

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
  targetAccountId: number | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
