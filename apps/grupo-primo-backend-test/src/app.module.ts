import { Module } from '@nestjs/common'
import { AccountsModule } from 'apps/accounts/src/accounts.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
