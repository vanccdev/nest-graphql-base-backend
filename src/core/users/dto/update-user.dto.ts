import { IsOptional, MaxLength, MinLength } from 'class-validator'

export class UpdateUserDTO {
  @IsOptional()
  @MinLength(8)
  @MaxLength(50)
  password?: string

  @IsOptional()
  email?: string

  @IsOptional()
  attempts?: number | null

  @IsOptional()
  status?: string | null
}
