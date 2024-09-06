import { IUseCase } from '@app/core/interfaces'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccountEntity } from '../../entities/account.entity'

export class ListAccountsUseCase implements IUseCase {
  constructor(@InjectRepository(AccountEntity) private readonly accountsRepository: Repository<AccountEntity>) {}

  async execute(): Promise<AccountEntity[]> {
    return await this.accountsRepository.find()
  }
}
