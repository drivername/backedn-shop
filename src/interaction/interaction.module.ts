import { Module } from '@nestjs/common';
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  controllers: [InteractionController],
  providers: [InteractionService,ConfigModule,S3Client]
})
export class InteractionModule {}
