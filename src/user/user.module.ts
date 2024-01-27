import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { aTGuard } from '../common/guard/aT.guard';
import { PrismaClient } from '@prisma/client';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports:[JwtModule,HttpModule],
  providers: [UserService,ConfigService,JwtService,aTGuard,PrismaClient],
  controllers: [UserController]
})
export class UserModule {}
