import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { aTGuard } from '../common/guard/aT.guard';


@Module({
  imports:[JwtModule],
  providers: [UserService,ConfigService,JwtService,aTGuard],
  controllers: [UserController]
})
export class UserModule {}
