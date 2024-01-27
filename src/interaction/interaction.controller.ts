import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaClient } from '@prisma/client';
import { UploadInterceptor } from 'src/common/interceptor/Upload.interceptor';
import { InteractionService } from './interaction.service';

@Controller('interaction')
export class InteractionController {
    constructor(private service:InteractionService){}
    @Post('upload')
    @UseInterceptors(FileInterceptor('files'))
   async  upload(@UploadedFile() file: Express.Multer.File){
        return this.service.upload(file.originalname,file.buffer)
        
        
    }
    @Get('upload')
    donowald(){
        console.log('dzieje się coś?')
        return this.service.donowald()
    }
}
