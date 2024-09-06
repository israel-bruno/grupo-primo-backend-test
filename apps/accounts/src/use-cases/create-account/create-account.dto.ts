import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, Length, Min } from 'class-validator'

export class CreateAccountDTO {
  @ApiProperty({
    description: 'The account balance',
    example: 100.45,
    required: true,
  })
  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 })
  balance: number

  @ApiProperty({
    description: 'The person name',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  @Length(3)
  name: string
}
