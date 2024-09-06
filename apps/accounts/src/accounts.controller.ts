import { ResponseDTO } from '@app/core'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AccountEntity } from './entities/account.entity'
import { CreateAccountDTO } from './use-cases/create-account/create-account.dto'
import { CreateAccountUseCase } from './use-cases/create-account/create-account.use-case'

@Controller()
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a account' })
  @ApiResponse({ example: new ResponseDTO('Account created successfully', AccountEntity.example()) })
  async create(@Body() dto: CreateAccountDTO): Promise<ResponseDTO> {
    const account = await this.createAccountUseCase.execute(dto)
    return new ResponseDTO('Account created', account)
  }
}
