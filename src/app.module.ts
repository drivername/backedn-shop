import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), AuthModule, PrismaModule, UserModule,JwtModule],
  exports:[JwtModule]
})
export class AppModule {}
