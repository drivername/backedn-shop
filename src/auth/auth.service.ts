import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDtoCreateAccount, AuthDtoLogin } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { Tokens } from './types/token.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService,private jwt:JwtService,private config:ConfigService){}
   
async getTokens(userId:number,email:string){

    const payload={sub:userId,email:email}
    const access_token=await this.jwt.signAsync(payload,{
        secret:this.config.get('ACCESS_TOKEN'),
        expiresIn:'15m'
    })
    const refresh_token=await this.jwt.signAsync(payload,{
        secret:this.config.get("REFRESH"),
        expiresIn:'7d'})

        const decode=this.jwt.decode(access_token,{complete:true})
       
     
  
   return {
    access_token,
    refresh_token,
   
    
   }
}

hashData(data:string){
    return bcrypt.hash(data,10)
}
    async signupLocal(dto:AuthDtoCreateAccount,res:Response){
   try{
    const hash=await this.hashData(dto.password)
   
         const newUser=await this.prisma.user.create({
            data:{
                email:dto.email,
                hash:hash,
                firstName:dto.firstName,
                lastName:dto.lastName

            }
         })
         if(!newUser) throw new Error("Something wrong wit login")
        
         return {accountCreated:true}

   }catch(e){
   console.log(e.meta)
   if(e.meta.target='User_email_key'){
    res.status(409).json({error:'Account with given email exist!'})
   }
   }
    
    

    }
  
  
  

   async login(dto:AuthDtoLogin,res:Response,req:Request){
    try{
        
        const user=await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        })
     
        if(!user)throw new ForbiddenException("User like this not exist!")
        const passwordMatches=await bcrypt.compare(dto.password,user.hash)
        if(!passwordMatches)throw new ForbiddenException("Password doesn't match!")
            const tokens=await this.getTokens(user.id,user.email)
            await this.updateHash(user.id,tokens.refresh_token)
          
            res.cookie("access_token",tokens.access_token,{httpOnly:true})
            res.cookie("refresh_token",tokens.refresh_token,{httpOnly:true})
            delete user.hash
            delete user.hashedRt
            req.user=user
            
       
    return user
    }
    catch(e){
        console.log(e,'something went wrong')
        return e
    }
   
   }
  
   async logout(userId:number){
        await this.prisma.user.updateMany({
        where:{
            id:userId,
            hashedRt:{
                not:null,

            },
        },data:{
            hashedRt:null
        }

        })

    }
  
    async refreshTokens(user:any){
        

    }

    async updateHash(userId:number,rt:string){
                
    const hash=await this.hashData(rt)
      await this.prisma.user.update({
        where:{
            id:userId
        },
        data:{
            hashedRt:hash
        }
      })             


    
}}
