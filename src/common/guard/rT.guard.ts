import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class rTGuard implements CanActivate{
    constructor(private jwt:JwtService,private config:ConfigService){}
    canActivate(context: ExecutionContext):any {
   
        try{
            const req=context.switchToHttp().getRequest()
        const rT=req.cookies.refresh_token
        const decoded=this.jwt.verify(rT,{secret:this.config.get("REFRESH")})
    
        return true
        }
        catch(e){
            return false
        }
      
        
    }
}