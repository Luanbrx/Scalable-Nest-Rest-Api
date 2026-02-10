import { ExecutionContext, NestInterceptor, CallHandler, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express'; 

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>(); 
    const method = request.method;
    const url = request.url;
    const now = Date.now();
     
    console.log(request['user'])
    console.log(`[REQUEST] ${method} ${url} - início da req`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        console.log(`[RESPONSE] ${method} ${url} - ${duration}ms`);
      }),
    );
  }
}