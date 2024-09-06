import { DatabaseTestingModule } from '@app/core'
import { Test, TestingModule } from '@nestjs/testing'
import { AccountModuleEntities } from '../../accounts.module'
import { AccountsRepository } from '../../repositories/accounts.repository'
import { CreateAccountUseCase } from './create-account.use-case'

describe('CreateAccountUseCase', () => {
  let accountsUseCase: CreateAccountUseCase

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [...DatabaseTestingModule(AccountModuleEntities)],
      providers: [AccountsRepository, CreateAccountUseCase],
    }).compile()

    accountsUseCase = app.get<CreateAccountUseCase>(CreateAccountUseCase)
  })

  describe('root', () => {
    it('should create account', async () => {
      const account = await accountsUseCase.execute({ balance: 30, name: 'Israel' })
      expect(account).toHaveProperty('id')
    })
  })
})
