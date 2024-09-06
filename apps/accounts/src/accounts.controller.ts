import { ResponseDTO } from '@app/core'
import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AccountEntity } from './entities/account.entity'
import { TransactionEntity } from './entities/transaction.entity'
import { CreateAccountDTO } from './use-cases/create-account/create-account.dto'
import { CreateAccountUseCase } from './use-cases/create-account/create-account.use-case'
import { DepositDTO } from './use-cases/deposit/deposit.dto'
import { DepositUseCase } from './use-cases/deposit/deposit.use-case'
import { ListAccountsUseCase } from './use-cases/list-accounts/list-account.use-case'
import { TransferDTO } from './use-cases/transfer/transfer.dto'
import { TransferUseCase } from './use-cases/transfer/transfer.use-case'
import { WithdrawDTO } from './use-cases/withdraw/withdraw.dto'
import { WithdrawUseCase } from './use-cases/withdraw/withdraw.use-case'

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly listAccountUseCase: ListAccountsUseCase,
    private readonly withdrawUseCase: WithdrawUseCase,
    private readonly depositUseCase: DepositUseCase,
    private readonly transferUseCase: TransferUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List accounts' })
  @ApiResponse({ example: new ResponseDTO('Accounts retrieved', [AccountEntity.example(), AccountEntity.example(), AccountEntity.example()]) })
  async findAll(): Promise<ResponseDTO> {
    const account = await this.listAccountUseCase.execute()
    return new ResponseDTO('Account retrieved', account)
  }

  @Post()
  @ApiOperation({ summary: 'Create a account' })
  @ApiResponse({ example: new ResponseDTO('Account created successfully', AccountEntity.example()) })
  async create(@Body() dto: CreateAccountDTO): Promise<ResponseDTO> {
    const account = await this.createAccountUseCase.execute(dto)
    return new ResponseDTO('Account created', account)
  }

  @Post(':id/withdraw')
  @ApiOperation({ summary: 'Withdraw balance' })
  @ApiResponse({ example: new ResponseDTO('Successfully withdrawn', TransactionEntity.withdrawExample()) })
  async withdraw(@Param('id', ParseIntPipe) id: number, @Body() dto: WithdrawDTO): Promise<ResponseDTO> {
    const account = await this.withdrawUseCase.execute(id, dto)
    return new ResponseDTO('Successfully withdrawn', account)
  }

  @Post(':id/deposit')
  @ApiOperation({ summary: 'Deposit funds' })
  @ApiResponse({ example: new ResponseDTO('Successfully deposited', TransactionEntity.depositExample()) })
  async deposit(@Param('id', ParseIntPipe) id: number, @Body() dto: DepositDTO): Promise<ResponseDTO> {
    const account = await this.depositUseCase.execute(id, dto)
    return new ResponseDTO('Successfully deposited', account)
  }

  @Post(':id/transfer')
  @ApiOperation({ summary: 'Transfer funds' })
  @ApiResponse({ example: new ResponseDTO('Successfully transfered', TransactionEntity.transferExample()) })
  async transfer(@Param('id', ParseIntPipe) id: number, @Body() dto: TransferDTO): Promise<ResponseDTO> {
    const account = await this.transferUseCase.execute(id, dto)
    return new ResponseDTO('Successfully transfered', account)
  }
}
