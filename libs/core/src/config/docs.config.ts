import { DocumentBuilder } from '@nestjs/swagger'

export const DocsConfig = new DocumentBuilder().setTitle('Banking transactions api').setDescription('API for banking transactions managment').setVersion('1.0').build()
