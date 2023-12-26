import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { validate } from "class-validator";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy,"refresh-jwt"){
constructor(config:ConfigService){
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:config.get('REFRESH'),
      passReqToCallback:true
    })

  
}
validate(req:Request,payload:any){
    //ten obiekt ktory zwróce z tej funkcji zostanie przymocowany do request object
    // czyli bd mial te dane w request object
    const refreshToken=req.get('authorization').replace("Bearer",'').trim()
    return {
        ...payload,
        refreshToken
    }
}
}