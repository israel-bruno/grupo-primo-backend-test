import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateAccountDTO {
  @ApiProperty({
    description: 'The account balance',
    example: 100.45,
    required: true,
  })
  @IsNumber()
  balance: number

  @ApiProperty({
    description: 'The person name',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string
}
