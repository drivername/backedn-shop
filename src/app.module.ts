import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { noCacheMiddleware } from './common/middleware/noCache.middleware';

@Global()
@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), AuthModule, PrismaModule, UserModule,JwtModule],
  exports:[JwtModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(noCacheMiddleware)
    .forRoutes('*')
  }
}
