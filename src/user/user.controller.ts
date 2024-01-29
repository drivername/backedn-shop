import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { aTGuard } from '../common/guard/aT.guard';
import { Request } from 'express';
import { UserService } from './user.service';
import { productsPutOnMarket } from '../product/dto/productsPutOnMarketDto';
import { SearchingProduct } from '../product/dto/searchingProduct';

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



    @Get('search')
    showAllProductsFromShop(){

      return this.userServices.showAllProductsFromShop()

    }

    @Post('search')
    searchItems(@Body() dto:SearchingProduct){
        return this.userServices.searchItems(dto)       
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

 
   

    

   


}
