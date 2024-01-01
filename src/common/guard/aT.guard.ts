import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class aTGuard implements CanActivate{
    constructor(private jwt:JwtService,private config:ConfigService){}
    canActivate(context: ExecutionContext):any {
   
        const req=context.switchToHttp().getRequest()
        const aT=req.cookies.access_token
        
        
        try{
            const decoded=this.jwt.verify(aT,{secret:this.config.get("ACCESS_TOKEN")})
            
            return true
        }catch(e){
            console.log(e,"cos nie tak")
           throw new ForbiddenException("Token Expired")
            
        }
        
    }
}