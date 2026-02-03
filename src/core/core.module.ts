import { Module } from '@nestjs/common';
// import { AuthenticationModule } from './authentication/authentication.module'
// import { AuthorizationModule } from './authorization/authorization.module'
import { ConfigCoreModule } from './config/config.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigCoreModule, UsersModule],
  exports: [],
})
export class CoreModule {}
