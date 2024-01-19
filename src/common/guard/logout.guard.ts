import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { PrismaClient } from "@prisma/client";
import { decode } from "punycode";
import { Observable } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class logoutGuard implements CanActivate{
    constructor(private jwt:JwtService,private config:ConfigService,private prisma:PrismaService){}
    async canActivate(context: ExecutionContext):Promise<any> {
   
        const req=context.switchToHttp().getRequest()
        const aT=req.cookies.refresh_token
        
        
        try{
            const decoded:{sub:number,email:string,iat:number,exp:number}=this.jwt.verify(aT,{secret:this.config.get("REFRESH")})
            console.log('Logout guard')
         if(decoded){
            req.user=decoded
            return true
         }
          
        }catch(e){
           console.log('LOGOUT TOKEN ZOSTAL ODRZUCONY WIEC ZWRACA SIE ERROR Z STATUSEM')
           throw new ForbiddenException("Token Expired")
            
        }
        
    }
}