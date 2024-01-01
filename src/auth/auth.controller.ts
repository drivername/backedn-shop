import { Controller, Req, Res, UseInterceptors } from '@nestjs/common';
import {
    Body,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
  } from '@nestjs/common';
  

  import { AuthService } from './auth.service';
import { AuthDtoCreateAccount, AuthDtoLogin } from './dto/auth.dto';
import { Tokens } from './types/token.types';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';


import { rTGuard } from 'src/common/guard/rT.guard';

  
@Controller('auth')
export class AuthController {
    constructor(private auth:AuthService){}

    @Post('signup')
   
    signupLocal(@Body() dto:AuthDtoCreateAccount,@Res({passthrough:true}) res:Response){
     return this.auth.signupLocal(dto,res)
    }
  
  
    @Post('signin')
    login(@Body() dto:AuthDtoLogin,@Res({passthrough:true}) res:Response,@Req() req:Request){
      return this.auth.login(dto,res,req)
      
    }
  
   
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() req:Request) {
      const user:any=req.user
      console.log(user)
  
     return this.auth.logout(user.id)
    }
  

    @UseGuards(rTGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req:Request) {
      const user=req.user
      return this.auth.refreshTokens(user)
    }
    
}
