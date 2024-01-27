import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { aTGuard } from '../common/guard/aT.guard';
import { Request } from 'express';
import { UserService } from './user.service';
import { productsPutOnMarket } from './dto/productsPutOnMarketDto';
import { SearchingProduct } from './dto/searchingProduct';
import { UpdatedProduct } from './dto/updatedProduct';
import { CommentProduct } from './dto/CommentsAboutProduct';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'



@Controller('user')
export class UserController {
    constructor(private userServices:UserService){}
    @UseGuards(aTGuard)
    @Get('panel')
    panelOfUser(@Req() req:Request){
        
        return this.userServices.panelOfUser(req)
        
    }


    @UseGuards(aTGuard)
    @Get('myProducts')
    myProducts(@Req() req:Request,@Query() query:any){
        let user_id_who_make_request=req.user['id']
        console.log(query,'what it is query')
       
        return this.userServices.myProducts(user_id_who_make_request)
    }



    @Get('myProductDetails')
    myProductDetails(@Query('id') query:any){
        return this.userServices.myProductDetails(query)
    }



    @Post('putProductsOnMarket')
    @UseGuards(aTGuard)
    @UseInterceptors(FileInterceptor('files'))
    putProductsOnMarket(@UploadedFile() file:Express.Multer.File,@Body() dto:productsPutOnMarket,@Req() req:Request,@Res({passthrough:true}) res:Response){
        console.log(file)
        console.log(dto)
        return this.userServices.putProductsOnMarket(dto,res,req,file)
    }
    @Get('search')
    showAllProductsFromShop(){

      return this.userServices.showAllProductsFromShop()

    }

    @Post('search')
    searchItems(@Body() dto:SearchingProduct){
        return this.userServices.searchItems(dto)       
    }
    @Post('editProduct')
    @UseGuards(aTGuard)
    editProduct(@Body() dto:UpdatedProduct,@Req() req:Request){
        return this.userServices.editProduct(dto)
    }

    @Post('settings')
    @UseGuards(aTGuard)
    settings(@Body() dto:any,@Req() req:Request){
        const user_id=req.user['id']
        return this.userServices.settings(dto,user_id)
    }
  
    @Post('searchParticularProduct')
    searchParticularProduct(@Body() dto:{productId:number}){
 
        return this.userServices.searchParticularProduct(dto)
    }

    @Post('addCommentToProduct')
    addCommentToProduct(@Body() dto:CommentProduct){
        console.log(dto,'dto')
        return this.userServices.addCommentToProduct(dto)

    }
    @Post('deleteCommentFromProduct')
    deleteCommentFromProduct(@Body() dto:{commentId:number}){
       
        return this.userServices.deleteCommentFromProduct(dto)

    }
    @Post('updateComment')
    updateComment(@Body() dto:any){
        return this.userServices.updateComment(dto)
    }
   


}
