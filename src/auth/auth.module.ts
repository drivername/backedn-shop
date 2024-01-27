import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { rTGuard } from 'src/common/guard/rT.guard';
import { PrismaClient } from '@prisma/client';



@Module({
  imports:[],
  controllers: [AuthController],
  providers: [AuthService,rTGuard]
})
export class AuthModule {}
