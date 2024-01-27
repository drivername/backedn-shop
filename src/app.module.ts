import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { noCacheMiddleware } from './common/middleware/noCache.middleware';
import { InteractionModule } from './interaction/interaction.module';
import { HttpModule } from '@nestjs/axios';
import { ProductModule } from './product/product.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
     AuthModule, 
     PrismaModule,
      UserModule,JwtModule,
       InteractionModule,
       HttpModule,
       ProductModule],
  exports:[JwtModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(noCacheMiddleware)
    .forRoutes('*')
  }
}
