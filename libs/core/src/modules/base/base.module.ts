import { TypeormConfig } from '@app/core/config/orm.config'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealthCheckModule } from '../health-check/health-check.module'

@Module({
  imports: [HealthCheckModule, TypeOrmModule.forRoot(TypeormConfig)],
})
export class BaseModule {}
