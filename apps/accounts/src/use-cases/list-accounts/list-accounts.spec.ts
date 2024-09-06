import { DatabaseTestingModule } from '@app/core'
import { faker } from '@faker-js/faker'
import { Test, TestingModule } from '@nestjs/testing'
import { AccountModuleEntities } from '../../accounts.module'
import { AccountsRepository } from '../../repositories/accounts.repository'
import { ListAccountsUseCase } from './list-account.use-case'

describe('ListAccountsUseCase', () => {
  let accountsUseCase: ListAccountsUseCase
  let accountsRepository: AccountsRepository

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [...DatabaseTestingModule(AccountModuleEntities)],
      providers: [ListAccountsUseCase, AccountsRepository],
    }).compile()

    accountsUseCase = app.get<ListAccountsUseCase>(ListAccountsUseCase)

    accountsRepository = app.get<AccountsRepository>(AccountsRepository)
  })

  describe('root', () => {
    it('should list accounts', async () => {
      await accountsRepository.save({ name: faker.person.fullName(), balance: Number(faker.finance.amount()) })

      const accounts = await accountsUseCase.execute()

      expect(accounts.length).toBe(1)
    })
  })
})
