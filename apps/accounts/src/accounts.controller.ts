import { ResponseDTO } from '@app/core'
import { Body, Controller, Post } from '@nestjs/common'
import { CreateAccountDTO } from './use-cases/create-account/create-account.dto'
import { CreateAccountUseCase } from './use-cases/create-account/create-account.use-case'

@Controller()
export class AccountsController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

  @Post()
  async create(@Body() dto: CreateAccountDTO): Promise<ResponseDTO> {
    const account = await this.createAccountUseCase.execute(dto)
    return new ResponseDTO('Account created', account)
  }
}
