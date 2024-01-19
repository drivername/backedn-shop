import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDtoCreateAccount, AuthDtoLogin } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { Tokens } from './types/token.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { User } from './types/userWhoWantRefreshToken';
@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService,private jwt:JwtService,private config:ConfigService){}
   
async getTokens(userId:number,email:string){

    const payload={sub:userId,email:email}
    const access_token=await this.jwt.signAsync(payload,{
        secret:this.config.get('ACCESS_TOKEN'),
        expiresIn:60*15
    })
    const refresh_token=await this.jwt.signAsync(payload,{
        secret:this.config.get("REFRESH"),
        expiresIn:60*60})

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
    console.log(dto,"what it is dto")
  
    try{
        
        const user=await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        })
     
        if(!user)throw new ForbiddenException("User like this not exist!")
      
        const passwordMatches=await bcrypt.compare(dto.password,user.hash)
        if(!passwordMatches)throw new ForbiddenException("wrong-password")
       
            const tokens=await this.getTokens(user.id,user.email)
            await this.updateHash(user.id,tokens.refresh_token)
          
            res.cookie("access_token",tokens.access_token,{httpOnly:true})
            res.cookie("refresh_token",tokens.refresh_token,{httpOnly:true})
           
            
       
    res.status(200)
    }
    catch(e){
        console.log(e,'what is error?')
        if(e.response.statusCode===403){
            
            res.status(403).json({msg:'User like this doesnt exist'})
        }
     
        if(e.response.message==='wrong-password'){
            res.status(401).json({msg:''})

        }
        return
        
       
    }
   
   }
  
   async logout(userEmail:string,res:Response){
   
       try{
        await this.prisma.user.updateMany({
            where:{
                email:userEmail,
                hashedRt:{
                    not:null,
                },
            },data:{
                hashedRt:null
            }
    
            })

            res.status(200)
            res.clearCookie('access_token')
            res.clearCookie('refresh_token')
            return {msg:'refresh-toke-delete',status:200}
       }
       catch(e){
        res.status(403)
        console.log(e)
       }

    }
  
    async refreshTokens(rT:string,user:any,res:Response){
        
       try{
        const findUser=await this.prisma.user.findUnique({where:{
            email:user.email
        }})
        if(!findUser)throw new ForbiddenException('User doesnt exist!')
        const refrreshTokenMatches=await bcrypt.compare(rT,findUser.hashedRt)
       
        if(!refrreshTokenMatches)throw new ForbiddenException('Refresh token invalid!')
        const tokens=await this.getTokens(findUser.id,findUser.email)
        await this.updateHash(findUser.id,tokens.refresh_token)
        res.cookie("access_token",tokens.access_token,{httpOnly:true})
        res.cookie("refresh_token",tokens.refresh_token,{httpOnly:true})
        res.status(200).json({msg:'refresh token successful',status:200})
        

       }
       catch(e){
        res.status(403).json({msg:'Refresh token is valid but something went wrong during process',status:403})
       }


        

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


    
}

    async checkIfUseIsLoged(req:Request){
      
        return req.user

    }

}
