import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'name' })
  name: string

  @Column({ name: 'balance', type: 'numeric' })
  balance: number
}
