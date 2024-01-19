import { Controller, Get, Header, Req, Res, UseInterceptors } from '@nestjs/common';
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
import { logoutGuard } from 'src/common/guard/logout.guard';
import { aTGuard } from 'src/common/guard/aT.guard';

  
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
  
   
    @Get('logout')
    @UseGuards(logoutGuard)
    logout(@Req() req:Request,@Res({passthrough:true}) res:Response) {
      const user:any=req.user
     return this.auth.logout(user.email,res)
    }
  

    @UseGuards(rTGuard)
    @Post('refresh')
    refreshTokens(@Req() req:Request,@Res({passthrough:true}) res:Response) {
      const rT=req.cookies.refresh_token
      const user=req.user
      return this.auth.refreshTokens(rT,user,res)
    }

    @Get('checkIFuserIsLoged')
    @UseGuards(aTGuard)
    checkIfUserIsloged(@Req() req:Request){
     
      return this.auth.checkIfUseIsLoged(req)
      
    }
    
}
