import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class rTGuard implements CanActivate{
    constructor(private jwt:JwtService,private config:ConfigService){}
    canActivate(context: ExecutionContext):any {
        const req=context.switchToHttp().getRequest()
        const res=context.switchToHttp().getResponse()
        try{
            
        const rT=req.cookies.refresh_token
        const decoded=this.jwt.verify(rT,{secret:this.config.get("REFRESH")})
        req.user=decoded
        
        
        return true
        }
        catch(e){
            res.clearCookie('access_token')
            res.clearCookie('refresh_token')
            res.status(403).json({msg:'refresh token expired',status:403})
        }
      
        
    }
}