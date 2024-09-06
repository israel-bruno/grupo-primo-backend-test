import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccountEntity } from '../entities/account.entity'

@Injectable()
export class AccountsRepository extends Repository<AccountEntity> {
  constructor(@InjectRepository(AccountEntity) typeormRepository: Repository<AccountEntity>) {
    super(typeormRepository.target, typeormRepository.manager, typeormRepository.queryRunner)
  }
}
