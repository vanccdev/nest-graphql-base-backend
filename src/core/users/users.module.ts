import { Module } from '@nestjs/common'
import { UserRepository } from './repository/user.repository'
import { UsersResolver } from './resolver/users.resolver'
import { UsersService } from './service/users.service'

@Module({
  providers: [UsersResolver, UsersService, UserRepository],
})
export class UsersModule {}
