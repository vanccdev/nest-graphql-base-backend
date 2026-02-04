import { IsEmail, MaxLength, MinLength } from 'class-validator'

export class CreateUserDTO {
  @MinLength(3)
  @MaxLength(50)
  userName: string

  @MinLength(8)
  @MaxLength(50)
  password: string

  @IsEmail()
  email: string

  status?: string
}
