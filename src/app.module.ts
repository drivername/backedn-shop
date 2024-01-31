import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { noCacheMiddleware } from './common/middleware/noCache.middleware';

import { HttpModule } from '@nestjs/axios';
import { ProductModule } from './product/product.module';
import { CommentsModule } from './comments/comments.module';
import { ChatGateway1 } from './chat/chat.gateway';





@Global()
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
     AuthModule, 
     PrismaModule,
      UserModule,JwtModule,
     
       HttpModule,
       ProductModule,
       CommentsModule,
     
       ],
  exports:[JwtModule],
  providers: [ChatGateway1]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(noCacheMiddleware)
    .forRoutes('*')
  }
}
