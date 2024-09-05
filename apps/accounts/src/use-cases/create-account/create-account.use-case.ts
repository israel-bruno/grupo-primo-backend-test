import { IUseCase } from '@app/core/interfaces'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccountEntity } from '../../entities/account.entity'
import { CreateAccountDTO } from './create-account.dto'

export class CreateAccountUseCase implements IUseCase {
  constructor(@InjectRepository(AccountEntity) private readonly accountsRepository: Repository<AccountEntity>) {}

  async execute(dto: CreateAccountDTO): Promise<AccountEntity> {
    return await this.accountsRepository.save(dto)
  }
}
