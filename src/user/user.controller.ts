import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { aTGuard } from '../common/guard/aT.guard';
import { Request } from 'express';
import { UserService } from './user.service';
import { productsPutOnMarket } from './dto/productsPutOnMarketDto';
import { SearchingProduct } from './dto/searchingProduct';
import { UpdatedProduct } from './dto/updatedProduct';



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
    productsOfUser(@Req() req:Request){
        let user_id_who_make_request=req.user['id']
       
        return this.userServices.productOfUser(user_id_who_make_request)
    }
    @Post('putProductsOnMarket')
    @UseGuards(aTGuard)
    putProductsOnMarket(@Body() dto:productsPutOnMarket,@Req() req:Request,@Res({passthrough:true}) res:Response){
        return this.userServices.putProductsOnMarket(dto,res,req)
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
    searchParticularProduct(@Body() dto:{id:number}){
        return this.userServices.searchParticularProduct(dto)
    }

    @Post()
    addCommentToProduct(){
        
    }
   


}
