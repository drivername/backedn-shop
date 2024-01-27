import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class UploadInterceptor implements NestInterceptor{
    intercept(context:ExecutionContext,next:CallHandler):Observable<any>{
        console.log('Before',Date.now())
       
        return next
        .handle()
        .pipe(
            tap(()=>console.log(`After...${Date.now()}---now|ms`))
        )

    }
}