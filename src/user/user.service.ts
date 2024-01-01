import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(private jwt:JwtService,private config:ConfigService){}
    checkAccessToken(token:any){
        const decoded=this.jwt.verify(token,{secret:this.config.get('ACCESS_TOKEN')})
        console.log(decoded)
        return decoded

    }

}
