import { ResponseDTO } from '@app/core'
import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AccountEntity } from './entities/account.entity'
import { CreateAccountDTO } from './use-cases/create-account/create-account.dto'
import { CreateAccountUseCase } from './use-cases/create-account/create-account.use-case'
import { ListAccountsUseCase } from './use-cases/list-accounts/list-account.use-case'
import { WithdrawDTO } from './use-cases/withdraw/withdraw.dto'
import { WithdrawUseCase } from './use-cases/withdraw/withdraw.use-case'

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase, private readonly listAccountUseCase: ListAccountsUseCase, private readonly withdrawUseCase: WithdrawUseCase) {}

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
  @ApiResponse({ example: new ResponseDTO('Successfully withdrawn', AccountEntity.example()) })
  async withdraw(@Param('id', ParseIntPipe) id: number, @Body() dto: WithdrawDTO): Promise<ResponseDTO> {
    const account = await this.withdrawUseCase.execute(id, dto)
    return new ResponseDTO('Account created', account)
  }
}
