import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, Min } from 'class-validator'

export class WithdrawDTO {
  @ApiProperty({
    description: 'The amount to be withdrawn',
    example: 100.0,
    required: true,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number
}
