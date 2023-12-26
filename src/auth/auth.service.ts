import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { Tokens } from './types/token.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService,private jwt:JwtService,private config:ConfigService){}
   
async getTokens(userId:number,email:string){
    console.log("tutaj")
    const payload={sub:userId,email:email}
    const access_token=await this.jwt.signAsync(payload,{
        secret:this.config.get('SECRET_KEY'),
        expiresIn:'15min'
    })
    const refresh_token=await this.jwt.signAsync(payload,{
        secret:this.config.get("REFRESH"),
        expiresIn:'7d'})

  
   return {
    access_token,
    refresh_token
   }
}

hashData(data:string){
    return bcrypt.hash(data,10)
}
    async signupLocal(dto:AuthDto):Promise<Tokens>{
   try{
    const hash=await this.hashData(dto.password)
   
         const newUser=await this.prisma.user.create({
            data:{
                email:dto.email,
                hash:hash
            }
         })
         
         const tokens=await this.getTokens(newUser.id,newUser.email)
    
         await this.updateHash(newUser.id,tokens.refresh_token)
         return tokens
   }catch(e){
    console.log(e)
   }
    
    

    }
  
  
  

    async signinLocal(dto:AuthDto):Promise<Tokens>{
        const user= await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        })
        if(!user) throw new ForbiddenException("access denied")
        const passwordMatches=await bcrypt.compare(dto.password,user.hash)
   if(!passwordMatches) throw new ForbiddenException("password doesn't match!")
        const tokens=await this.getTokens(user.id,user.email)
    
        await this.updateHash(user.id,tokens.refresh_token)
        return tokens
    

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
        console.log(user.refreshToken)
        const tokenSendByUser=user.refreshToken
       
        

        const checkUser=await this.prisma.user.findUnique({
            where:{
                email:user.email
            }
        })
        if(!checkUser)throw new Error('Something wrong with finding user in our system')
        const rTokenMatches=await bcrypt.compare(tokenSendByUser,checkUser.hashedRt)
    console.log(rTokenMatches)
    if(!rTokenMatches)throw  new ForbiddenException("Access Denied!")
    const tokens=this.getTokens(checkUser.id,checkUser.email)
    return tokens

        


    }

    async updateHash(userId:number,rt:string){
        const hash=await this.hashData(rt)
        await this.prisma.user.update({where:{
            id:userId
        },
    data:{
        hashedRt:hash
    }})

    }
}
