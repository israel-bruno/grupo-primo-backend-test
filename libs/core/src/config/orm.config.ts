import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as migrations from '../infra/migrations'

export const TypeormConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  migrations: [...Object.values(migrations)],
  migrationsRun: true,
} as TypeOrmModuleOptions
