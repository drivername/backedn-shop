import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CommentAboutProduct, PrismaClient } from '@prisma/client';
import { productsPutOnMarket } from '../product/dto/productsPutOnMarketDto';
import { Request } from 'express';
import { SearchingProduct } from '../product/dto/searchingProduct';

import * as bcrypt from 'bcrypt'
import { UpdateUser } from './dto/updateUser';
import { CommentProduct } from './dto/CommentsAboutProduct';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class UserService {

    constructor(private jwt:JwtService,private config:ConfigService,private prisma:PrismaClient,private readonly httpService: HttpService){}
    panelOfUser(req:Request){
      return req.user
      
    }
    

    async findParticularUser(paramId:any){
        try{
          const findUser=await this.prisma.user.findUnique({
            where:{
              id:Number(paramId)
            }
          })
          if(!findUser) throw {msg:'Cant find user',status:403}
          console.log(findUser)
          return findUser
        }
       
        catch(e){
          throw e
        }
    }
    

    async showAllProductsFromShop(){
        try{

          const products=await this.prisma.product.findMany({
            where:{
              id:{
                gt:0
              }
            }
          })
          if(!products)throw {msg:'something-went-wrong',status:403}
          console.log(products)
          return products

        }catch(e){
         
          throw {msg:'error',status:403}
        }

    }

    async searchItems(dto:SearchingProduct){
     console.log(dto,'co to dto')
      if(dto.categoryId===0){
        try{
          const all=await this.prisma.product.findMany({
            where:{
              name_of_product:{
                startsWith:dto.searchValue
              }
            }
          })
          console.log(all)
          return all
        }
        
        catch(e){
          throw {msg:'Error',status:403}
        }
      }
      try{
        const product=await this.prisma.product.findMany({
          where:{
            name_of_product:{
              startsWith:dto.searchValue
            },
            categoryId:dto.categoryId
           
          }
        }
  )
  if(!product) throw {msg:'Cant find Item',status:400}
 
  return product
      }
      catch(e){
        console.log(e)
      }
    }

   
    async settings(dto:UpdateUser,user_id:any){

      if(dto.action==='not_password_change'){
        try{
          const update=await this.prisma.user.update({
            where:{
              id:user_id
            },
            data:{
              firstName:dto.firstName,
              lastName:dto.lastName,
              email:dto.email
            }
          })
          if(!update)throw {msg:'something-wrong-with-updating'}
          return {msg:`${dto.whatIsChange} changed!`,status:201}
        }catch(e){
          throw e
        }
      }
      if(dto.action==='password_change'){
        console.log(dto)
        try{
          let password=await bcrypt.hash(dto.password,10)
          const update=await this.prisma.user.update({
            where:{
              id:user_id
            },
            data:{
              hash:password
            }
          })
          if(!update) throw {msg:'Something went wrong with updating password',status:403}
          return {msg:'password-changed',status:201}
        }catch(e){
          throw e
        }
      }

    }
   async searchParticularProduct(dto:{productId:number}){
    console.log(dto,'what it is?')
    try{
      const findProduct=await this.prisma.product.findUnique({
        where:{
          id:dto.productId
        },
        include:{
          user:{
            select:{
              firstName:true,
              lastName:true,
              id:true,
            }
          }
        }
      })
      if(!findProduct)throw {msg:'Problem with searching particular product',status:403}
      
   
      const findComment=await this.prisma.commentAboutProduct.findMany({
        where:{
          productId:dto.productId
        },
        include:{
          author:{
            select:{
              firstName:true,
              id:true
            }
          }
        }
      })
      if(!findComment)throw {msg:'Something wrong witch searching product',status:403}

      return {findProduct,findComment}
    }catch(e){
      throw e
    }
        
    }

    async addCommentToProduct(dto:CommentProduct){
     console.log(dto.content,'dto')
    try{
      const add=await this.prisma.commentAboutProduct.create({
        data:{
          updatedAt:dto.updatedAt,
          content:dto.content,
          productId:dto.productId,
          authorId:dto.authorId,
          dislike:dto.dislike,
          like:dto.like
        }
      })
      if(!add)throw {msg:'Something wrong with add comment',status:403}
      return {msg:'Comment added',status:201}
    }catch(e){
      throw e
    }
    }

    async deleteCommentFromProduct(dto:{commentId:number}){
      console.log(dto,dto)
      try{
        const removeComment=await this.prisma.commentAboutProduct.delete({
          where:{
            id:dto.commentId
          }
        })
        if(!removeComment) throw {msg:'Something wrong during removing comment',status:403}
        return {msg:'Comment Sucessfully deleted',status:200}
      }catch(e){
        throw e
      }
    }
    async updateComment(dto:any){
      console.log(dto.commentId,'id komentarza')
      try{
        const update=await this.prisma.commentAboutProduct.update({
          where:{
            id:dto.commentId
          },
          data:{
            content:dto.content
          }
        })
        if(!update)throw {msg:'Something wrong with updating comment',status:403}
        return {msg:'Comment updated sucessfully',status:200}
      }
      catch(e){
        throw e
      }

    }
}
