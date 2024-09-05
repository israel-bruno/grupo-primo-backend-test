import { ValidationPipe as NestPipe } from '@nestjs/common'

export const ValidationPipe = new NestPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
})
