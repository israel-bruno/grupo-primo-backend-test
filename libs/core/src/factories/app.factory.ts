import { NestApplication, NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { DocsConfig } from '../config/docs.config'
import { ValidationPipe } from '../pipes/validation.pipe'

export class AppFactory {
  static async create(module: any): Promise<NestApplication> {
    const app = await NestFactory.create<NestApplication>(module)

    const document = SwaggerModule.createDocument(app, DocsConfig, { include: [module] })
    SwaggerModule.setup('/api/docs', app, document)

    app.useGlobalPipes(ValidationPipe)

    return app
  }
}
