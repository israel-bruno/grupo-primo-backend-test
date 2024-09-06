import { faker } from '@faker-js/faker'
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
      id: faker.number.int({ min: 1, max: 1000000 }),
      name: faker.person.fullName(),
      balance: Number(faker.finance.amount()),
    }
  }
}
