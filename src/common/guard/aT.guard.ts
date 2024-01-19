import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { PrismaClient } from "@prisma/client";
import { decode } from "punycode";
import { Observable } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class aTGuard implements CanActivate{
    constructor(private jwt:JwtService,private config:ConfigService,private prisma:PrismaService){}
    async canActivate(context: ExecutionContext):Promise<any> {
   
        const req=context.switchToHttp().getRequest()
        const res=context.switchToHttp().getResponse()
        const aT=req.cookies.access_token
        
        try{
            const decoded:{sub:number,email:string,iat:number,exp:number}=this.jwt.verify(aT,{secret:this.config.get("ACCESS_TOKEN")})
         
            if(decoded){
                try{
                    const user=await this.prisma.user.findUnique({where:{
                        email:decoded.email
                    }})
                    if(!user)throw new ForbiddenException('User dont exist')
                    
                    delete user.hashedRt
                    delete user.hash
                    req.user=user
                   
                    return true
                }catch(e){
                  
                    res.status(403).json({msg:'Something went wrong with search user',status:403})
                    return false
                }
            }
           
           
        }catch(e){
            console.log('JWT TOKEN ODRZUCONY!')
            res.status(401).json({msg:'Unauthorized',status:401})
            return false
          
            
        }
        
    }
}