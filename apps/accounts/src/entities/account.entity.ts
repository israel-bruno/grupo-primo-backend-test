import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  balance: number

  static example(): AccountEntity {
    return {
      id: 1,
      name: 'John Doe',
      balance: 300.0,
    }
  }
}
