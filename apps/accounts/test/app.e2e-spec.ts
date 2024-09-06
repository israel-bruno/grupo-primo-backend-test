import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AccountsRepository } from '../src/repositories/accounts.repository'
import { TransferDTO } from '../src/use-cases/transfer/transfer.dto'
import { AccountsModule } from './../src/accounts.module'

describe('AccountsController (e2e)', () => {
  let app: INestApplication
  let accountsRepository: AccountsRepository

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountsModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    accountsRepository = app.get<AccountsRepository>(AccountsRepository)

    await app.init()
  })

  describe('/accounts/:id/withdraw (POST)', () => {
    it('should withdraw balance', async () => {
      const initialBalance = 100
      const withdrawAmount = 49.13

      const account = await accountsRepository.save({ name: faker.person.fullName(), balance: initialBalance })

      await request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }).expect(201)

      const accountAfterWithdraw = await accountsRepository.findOneByOrFail({ id: account.id })

      expect(accountAfterWithdraw.balance).toBe(initialBalance - withdrawAmount)
    })

    it('should not withdraw with insuficient balance', async () => {
      const initialBalance = 100
      const withdrawAmount = 100.01

      const account = await accountsRepository.save({ name: faker.person.fullName(), balance: initialBalance })

      await request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }).expect(400)
    })

    it('should support concurrent transactions', async () => {
      const initialBalance = 100
      const withdrawAmount = 50

      const account = await accountsRepository.save({ name: faker.person.fullName(), balance: initialBalance })

      const promises = []

      for (let i = 0; i < 10; i++) {
        promises.push(request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }))
      }

      const responses = await Promise.all(promises)

      const withdraws = responses.filter((response: request.Response) => response.statusCode == 201).length
      expect(withdraws).toBe(2)
    })
  })

  describe('/accounts/:id/deposit (POST)', () => {
    it('should deposit funds', async () => {
      const initialBalance = 0
      const depositAmount = 100

      const account = await accountsRepository.save({ name: faker.person.fullName(), balance: initialBalance })

      await request(app.getHttpServer()).post(`/accounts/${account.id}/deposit`).send({ amount: depositAmount }).expect(201)

      const accountAfterDeposit = await accountsRepository.findOneByOrFail({ id: account.id })

      expect(accountAfterDeposit.balance).toBe(initialBalance + depositAmount)
    })
  })

  describe('/accounts/:id/transfer (POST)', () => {
    it('should transfer funds', async () => {
      const account = await accountsRepository.save({ name: faker.person.fullName(), balance: 50 })
      const targetAccount = await accountsRepository.save({ name: faker.person.fullName(), balance: 0 })

      await request(app.getHttpServer())
        .post(`/accounts/${account.id}/transfer`)
        .send({ amount: 30, targetAccountId: targetAccount.id } as TransferDTO)
        .expect(201)

      const account1AfterTransfer = await accountsRepository.findOneByOrFail({ id: account.id })
      const account2AfterTransfer = await accountsRepository.findOneByOrFail({ id: targetAccount.id })

      expect(account1AfterTransfer.balance).toBe(20)
      expect(account2AfterTransfer.balance).toBe(30)
    })

    it('should not transfer funds when the balance is insufficient', async () => {
      const account = await accountsRepository.save({ name: faker.person.fullName(), balance: 50 })
      const targetAccount = await accountsRepository.save({ name: faker.person.fullName(), balance: 0 })

      await request(app.getHttpServer())
        .post(`/accounts/${account.id}/transfer`)
        .send({ amount: 60, targetAccountId: targetAccount.id } as TransferDTO)
        .expect(400)

      const account1AfterTransfer = await accountsRepository.findOneByOrFail({ id: account.id })
      const account2AfterTransfer = await accountsRepository.findOneByOrFail({ id: targetAccount.id })

      expect(account1AfterTransfer.balance).toBe(50)
      expect(account2AfterTransfer.balance).toBe(0)
    })
  })
})
