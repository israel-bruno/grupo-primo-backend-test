import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AccountsRepository } from '../src/repositories/accounts.repository'
import { TransferDTO } from '../src/use-cases/transfer/transfer.dto'
import { WithdrawDTO } from '../src/use-cases/withdraw/withdraw.dto'
import { AccountsModule } from './../src/accounts.module'

describe('AccountsController (e2e)', () => {
  let app: INestApplication
  let accountsRepository: AccountsRepository

  beforeEach(async function () {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountsModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    accountsRepository = app.get<AccountsRepository>(AccountsRepository)

    await app.init()
  })

  describe('/accounts/:id/withdraw (POST)', () => {
    it('should withdraw balance', async function () {
      const initialBalance = 100
      const withdrawAmount = 49.13

      const account = await accountsRepository.save({ name: faker.person.fullName(), balance: initialBalance })

      await request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }).expect(201)

      const accountAfterWithdraw = await accountsRepository.findOneByOrFail({ id: account.id })

      expect(accountAfterWithdraw.balance).toBe(initialBalance - withdrawAmount)
    })

    it('should not withdraw with insuficient balance', async function () {
      const initialBalance = 100
      const withdrawAmount = 100.01

      const account = await accountsRepository.save({ name: faker.person.fullName(), balance: initialBalance })

      await request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }).expect(400)
    })

    it('should support concurrent transactions', async function () {
      const initialBalance = 100
      const withdrawAmount = 50

      const account = await accountsRepository.save({ name: faker.person.fullName(), balance: initialBalance })

      const responses = await Promise.all([
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
      ])

      const withdraws = responses.filter((response: request.Response) => response.statusCode == 201).length
      expect(withdraws).toBe(2)
    })
  })

  describe('/accounts/:id/deposit (POST)', () => {
    it('should deposit funds', async function () {
      const initialBalance = 0
      const depositAmount = 100

      const account = await accountsRepository.save({ name: faker.person.fullName(), balance: initialBalance })

      await request(app.getHttpServer()).post(`/accounts/${account.id}/deposit`).send({ amount: depositAmount }).expect(201)

      const accountAfterDeposit = await accountsRepository.findOneByOrFail({ id: account.id })

      expect(accountAfterDeposit.balance).toBe(initialBalance + depositAmount)
    })
  })

  describe('/accounts/:id/transfer (POST)', () => {
    it('should transfer funds', async function () {
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

    it('should not transfer funds when the balance is insufficient', async function () {
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

  describe('transactions concurrency', () => {
    it('should suport concurrent withdraws', async function () {
      const initialBalance = 100
      const withdrawAmount = 50

      const account = await accountsRepository.save({ name: faker.person.fullName(), balance: initialBalance })

      const responses = await Promise.all([
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
        request(app.getHttpServer()).post(`/accounts/${account.id}/withdraw`).send({ amount: withdrawAmount }),
      ])

      const withdraws = responses.filter((response: request.Response) => response.statusCode == 201).length
      expect(withdraws).toBe(2)
    })

    it('should suport concurrent transfers', async function () {
      const account1 = await accountsRepository.save({ name: faker.person.fullName(), balance: 100.87 })
      const account2 = await accountsRepository.save({ name: faker.person.fullName(), balance: 289.13 })
      const account3 = await accountsRepository.save({ name: faker.person.fullName(), balance: 500 })

      await Promise.all([
        request(app.getHttpServer())
          .post(`/accounts/${account1.id}/transfer`)
          .send({ amount: 0.87, targetAccountId: account2.id } as TransferDTO)
          .expect(201),

        request(app.getHttpServer())
          .post(`/accounts/${account2.id}/transfer`)
          .send({ amount: 20, targetAccountId: account1.id } as TransferDTO)
          .expect(201),

        request(app.getHttpServer())
          .post(`/accounts/${account3.id}/transfer`)
          .send({ amount: 110, targetAccountId: account2.id } as TransferDTO)
          .expect(201),
      ])

      const account1AfterTransfer = await accountsRepository.findOneByOrFail({ id: account1.id })
      const account2AfterTransfer = await accountsRepository.findOneByOrFail({ id: account2.id })
      const account3AfterTransfer = await accountsRepository.findOneByOrFail({ id: account3.id })

      expect(account1AfterTransfer.balance).toBe(120)
      expect(account2AfterTransfer.balance).toBe(380)
      expect(account3AfterTransfer.balance).toBe(390)
    })

    it('should support multiple concurrent transactions types', async function () {
      const account1 = await accountsRepository.save({ name: faker.person.fullName(), balance: 100.87 })
      const account2 = await accountsRepository.save({ name: faker.person.fullName(), balance: 289.13 })
      const account3 = await accountsRepository.save({ name: faker.person.fullName(), balance: 500 })

      const responses = await Promise.all([
        request(app.getHttpServer())
          .post(`/accounts/${account1.id}/transfer`)
          .send({ amount: 0.87, targetAccountId: account2.id } as TransferDTO),

        request(app.getHttpServer())
          .post(`/accounts/${account2.id}/transfer`)
          .send({ amount: 20, targetAccountId: account3.id } as TransferDTO),

        request(app.getHttpServer())
          .post(`/accounts/${account1.id}/withdraw`)
          .send({ amount: 100.87 } as WithdrawDTO),
      ])

      const account3AfterTransfer = await accountsRepository.findOneByOrFail({ id: account3.id })

      const successfullTransactions = responses.filter((response) => response.status === 201).length

      expect(successfullTransactions).toBe(2)
      expect(account3AfterTransfer.balance).toBe(520)
    })
  })
})
