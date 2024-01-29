import { Body, Controller, Get, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { aTGuard } from 'src/common/guard/aT.guard';

import { FileInterceptor } from '@nestjs/platform-express';
import { productsPutOnMarket } from 'src/product/dto/productsPutOnMarketDto';
import { EditProduct } from './dto/EditProductDto';

@Controller('product')
export class ProductController {
    userServices: any;
    constructor(private service:ProductService){}
    @UseGuards(aTGuard)
    @Get('myProducts')
    myProducts(@Req() req:Request,@Query() query:any){
       let id=req['user'].id
        return this.service.myProducts(id)
    }

    @UseGuards(aTGuard)
    @Get('myProductDetails')
    myProductDetails(@Query('id') query:any){
       
        return this.service.myProductDetails(query)
    }

    @Post('editProduct')
    @UseGuards(aTGuard)
    @UseInterceptors(FileInterceptor('file'))
    editProduct(@UploadedFile() file:Express.Multer.File|string,@Body() dto:EditProduct,@Req() req:Request){
        console.log(file,'what it is file')
        return this.service.editProduct(dto,file)
    }

    @Post('putProductsOnMarket')
    @UseGuards(aTGuard)
    @UseInterceptors(FileInterceptor('files'))
    putProductsOnMarket(@UploadedFile() file:Express.Multer.File,@Body() dto:productsPutOnMarket,@Req() req:Request,@Res({passthrough:true}) res:Response){
        console.log(file)
        console.log(dto)
        return this.service.putProductsOnMarket(dto,res,req,file)
    }
}
