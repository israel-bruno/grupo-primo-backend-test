import { NestApplication, NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import * as morgan from 'morgan'
import { DocsConfig } from '../config/docs.config'
import { ValidationPipe } from '../pipes/validation.pipe'

export class AppFactory {
  static async create(module: any): Promise<NestApplication> {
    const app = await NestFactory.create<NestApplication>(module)

    const document = SwaggerModule.createDocument(app, DocsConfig, { include: [module], deepScanRoutes: true })

    SwaggerModule.setup('/api/docs', app, document)

    app.use(morgan('short'))

    app.useGlobalPipes(ValidationPipe)

    return app
  }
}
