import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { productsPutOnMarket } from 'src/product/dto/productsPutOnMarketDto';
import { EditProduct } from './dto/EditProductDto';


@Injectable()
export class ProductService {
    private readonly s3Client=new S3Client({
        region:this.config.getOrThrow('AWS_S3_REGION')
    })
    constructor(private prisma:PrismaClient,private config:ConfigService){}
    async myProducts(userId:number){
     
        try{
          
          const productsOfUser=await this.prisma.product.findMany({
            where:{
              owner_id:userId
            },include:{
              category:{
                select:{
                  id:true,
                  name_of_category:true
                }
              },
              commentaboutproduct:{
                select:{
                  content:true
                }
              }
            }
          })
          if(!productsOfUser) throw {msg:'can-find-products-of-user',status:403}
          
          return productsOfUser
        }
                catch(e){
                  throw {msg:'error',status:403}
        }

    }

    async myProductDetails(query:any){
        console.log(query)
        try{
          const particularProduct=await this.prisma.product.findFirst({
            where:{
              id:Number(query)
            },include:{
              category:{
                select:{
                  id:true,
                  name_of_category:true
                }
              }
            }
          })
          if(!particularProduct) throw {msg:'Something wrong with findig particular product',status:403}
          console.log(particularProduct)
          return particularProduct
        }catch(e){
          throw e
        }
      }
      async editProduct(dto:EditProduct,file:any){
        console.log('wykonuje sie to?')
        let img_url=null
        if(file===undefined){
          img_url=dto.actualImg
        }
        else{
         
          img_url=`https://nestjs-sklep-1.s3.eu-west-2.amazonaws.com/${file.originalname}`
          await this.s3Client.send(new PutObjectCommand({
              Bucket:'nestjs-sklep-1',
              Key:file.originalname,
              ACL:'public-read',
              Body:file.buffer
          }))
        }
    
       
        try{
          const edit=await this.prisma.product.update({
            where:{
              id:Number(dto.id)
            },
            data:{
              name_of_product:dto.name_of_product,
              description:dto.description,
              price:Number(dto.price),
              quantity:Number(dto.quantity),
              categoryId:Number(dto.category),
              img_url:img_url
              
            }
          })
          if(!edit)throw {msg:'Something went wrong!'}
       
          return edit
        }catch(e){
          throw e
        }
      }

      async putProductsOnMarket(dto:productsPutOnMarket,res:Response,req:Request,file:any){
        console.log(file)
         const user_id=req['user'].id
        const img_url=`https://nestjs-sklep-1.s3.eu-west-2.amazonaws.com/${file.originalname}`
        await this.s3Client.send(new PutObjectCommand(
            {
                Bucket:'nestjs-sklep-1',
                Key:file.originalname,
                Body:file.buffer,
                ACL:'public-read'
            }
        ))
        
         try{
           const putProduct=await this.prisma.product.create({
               data:{
                   name_of_product:dto.name_of_product,
                   price:Number(dto.price),
                   description:dto.description,
                   quantity:Number(dto.quantity),
                   owner_id:user_id,
                   categoryId:Number(dto.category),
                   img_url:img_url
                   
                   
                   
               }
           })
           if(!putProduct)throw new ForbiddenException('something went wrong')
         
            
           return {msg:'You update your item on server',status:200}
         }catch(e){
           console.log(e)
           throw e
         }
       }
      



saveFileOnDysk(){

}

}
