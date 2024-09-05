import { DocumentBuilder } from '@nestjs/swagger'

export const DocsConfig = new DocumentBuilder().setTitle('Urls Shortener Api').setDescription('API for URL shortening and traffic analysis').setVersion('1.0').addBearerAuth().build()
