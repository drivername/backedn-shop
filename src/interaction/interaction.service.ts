import { GetObjectAclCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CircularJSON from 'circular-json';
@Injectable()
export class InteractionService {
    private readonly s3Client=new S3Client({
        region:this.config.getOrThrow('AWS_S3_REGION')
    })
    constructor(private config:ConfigService){}
    async upload(filename:any,file:any){
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket:'nestjs-sklep',
                Key:filename,
                Body:file
            })
        )
    }
    async donowald(){
        let dwa=await this.s3Client.send(
            new GetObjectCommand({
                Bucket:'nestjs-sklep',
                Key:'tir.png'
            })
        )
       console.log(dwa)
       return 'nic'
    }
}
