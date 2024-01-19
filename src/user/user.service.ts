import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { productsPutOnMarket } from './dto/productsPutOnMarketDto';
import { Request } from 'express';
import { SearchingProduct } from './dto/searchingProduct';
import { UpdatedProduct } from './dto/updatedProduct';
import * as bcrypt from 'bcrypt'
import { UpdateUser } from './dto/updateUser';


@Injectable()
export class UserService {
    constructor(private jwt:JwtService,private config:ConfigService,private prisma:PrismaClient){}
    panelOfUser(req:Request){
      return req.user
      
    }
    async productOfUser(userId:number){
     
        try{
          
          const productsOfUser=await this.prisma.product.findMany({
            where:{
              owner_id:userId
            }
          })
          if(!productsOfUser) throw {msg:'can-find-products-of-user',status:403}
          
          return productsOfUser
        }
                catch(e){
                  throw {msg:'error',status:403}
        }

    }

    async putProductsOnMarket(dto:productsPutOnMarket,res:Response,req:Request){
     
      const user_id=req.user['id']
    
     
     
      try{
        const putProduct=await this.prisma.product.create({
            data:{
                name_of_product:dto.name_of_product,
                price:dto.price,
                description:dto.description,
                quantity:dto.quantity,
                owner_id:user_id,
                categoryId:dto.category,
                
                
                
            }
        })
        if(!putProduct)throw new ForbiddenException('something went wrong')
     
        return {msg:'You update your item on server',status:200}
      }catch(e){

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

    async editProduct(dto:UpdatedProduct){
      console.log(dto,'What is dto!!!!!!!')
     
      try{
        const edit=await this.prisma.product.update({
          where:{
            id:dto.id
          },
          data:{
            name_of_product:dto.name_of_product,
            description:dto.description,
            price:dto.price,
            quantity:dto.quantity,
            categoryId:dto.category
            
          }
        })
        if(!edit)throw {msg:'Something went wrong!'}
        console.log(edit,'edit')
        return edit
      }catch(e){
        throw e
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
   async searchParticularProduct(dto:{id:number}){
    console.log(dto,'what it is?')
    try{
      const findProduct=await this.prisma.product.findUnique({
        where:{
          id:dto.id
        }
      })
      if(!findProduct)throw {msg:'Problem with searching particular product',status:403}
      console.log(findProduct,'what it is?')
      const findOwner=await this.prisma.user.findUnique({
        where:{
          id:findProduct.owner_id
        }
      })
      if(!findOwner) throw {msg:'Problem with finding owner of product',status:403}
      return {findProduct,findOwner}
    }catch(e){
      throw e
    }
        
    }

    async addCommentToProduct(){
      
    }
}
