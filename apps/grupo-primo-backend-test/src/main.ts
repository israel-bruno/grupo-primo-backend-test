import { AppFactory } from '@app/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await AppFactory.create(AppModule)
  await app.listen(3000)
}
bootstrap()
