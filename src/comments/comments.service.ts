import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommentProduct } from 'src/user/dto/CommentsAboutProduct';

@Injectable()
export class CommentsService {
    constructor(private prisma:PrismaClient){}
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
