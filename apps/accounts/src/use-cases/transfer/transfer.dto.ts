import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNumber, Min } from 'class-validator'

export class TransferDTO {
  @ApiProperty({
    description: 'The amount to be withdrawn',
    example: 100.0,
    required: true,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number

  @ApiProperty({
    description: 'The target account',
    example: 1,
    required: true,
  })
  @IsInt()
  @Min(1)
  targetAccountId: number
}
