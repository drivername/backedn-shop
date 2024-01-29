import { Body, Controller, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentProduct } from 'src/user/dto/CommentsAboutProduct';

@Controller('comments')
export class CommentsController {
    constructor(private service:CommentsService){}
    @Post('addCommentToProduct')
    addCommentToProduct(@Body() dto:CommentProduct){
        console.log(dto,'dto')
        return this.service.addCommentToProduct(dto)

    }
    @Post('deleteCommentFromProduct')
    deleteCommentFromProduct(@Body() dto:{commentId:number}){
       
        return this.service.deleteCommentFromProduct(dto)}

        @Post('updateComment')
        updateComment(@Body() dto:any){
            return this.service.updateComment(dto)
        }

}
