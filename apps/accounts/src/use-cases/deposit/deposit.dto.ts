import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, Min } from 'class-validator'

export class DepositDTO {
  @ApiProperty({
    description: 'The amount to be deposited',
    example: 100.0,
    required: true,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number
}
