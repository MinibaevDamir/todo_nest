import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [JwtModule],
})
export class UsersModule {}
