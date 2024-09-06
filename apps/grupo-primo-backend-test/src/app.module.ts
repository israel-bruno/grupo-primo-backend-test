import { Module } from '@nestjs/common'
import { AccountsModule } from 'apps/accounts/src/accounts.module'
import { AppService } from './app.service'

@Module({
  imports: [AccountsModule],
  providers: [AppService],
})
export class AppModule {}
