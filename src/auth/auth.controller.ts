import { Controller, Req } from '@nestjs/common';
import {
    Body,
 
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
  } from '@nestjs/common';
  

  import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/token.types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

  
@Controller('auth')
export class AuthController {
    constructor(private auth:AuthService){}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto:AuthDto):Promise<Tokens>{
     return this.auth.signupLocal(dto)
    }
  
  
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto:AuthDto):Promise<Tokens> {
      return this.auth.signinLocal(dto)
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() req:Request) {
      const user:any=req.user
      console.log(user)
  
     return this.auth.logout(user.id)
    }
  

    @UseGuards(AuthGuard('refresh-jwt'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req:Request) {
      const user=req.user
      return this.auth.refreshTokens(user)
    }
    
}
