import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { aTGuard } from '../common/guard/aT.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(){}
    @UseGuards(aTGuard)
    @Get('panel')
    panelOfUser(@Req() req:Request){
        console.log(req.user,"user")
        return {xd:"xd",user:req.user}
        
    }
}
