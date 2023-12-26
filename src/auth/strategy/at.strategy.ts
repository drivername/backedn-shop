import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Payload } from "@prisma/client/runtime/library";
import { validate } from "class-validator";
import { ExtractJwt, Strategy } from "passport-jwt";

type payloadFromJwt={
    sub:string,
    email:string
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy,"jwt"){
constructor(config:ConfigService){
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:config.get('SECRET_KEY')
    })

  
}
validate(payload:payloadFromJwt){
    //ten obiekt ktory zwróce z tej funkcji zostanie przymocowany do request object
    // czyli bd mial te dane w request object
    return payload
}
}