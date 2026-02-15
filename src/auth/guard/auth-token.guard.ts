import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";
import { JwtService } from "@nestjs/jwt";
import { REQUEST_TOKEN_PLAYLOAD_NAME } from "../common/authconstants";
import { Request} from "express"
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class AuthTokenGuard implements CanActivate{

constructor(
  private readonly jwtService: JwtService,
  private readonly prisma: PrismaService,

  @Inject(jwtConfig.KEY)
  private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
) {}

async canActivate(context: ExecutionContext): Promise<boolean> {
  
  const request: Request = context.switchToHttp().getRequest();
  const token = this.extractTokenHeader(request)

if (!token){
  throw new UnauthorizedException("Token não encontrado")
}

try {
      
  const playload = await this.jwtService.verifyAsync(token, this.jwtConfiguration)

  request[REQUEST_TOKEN_PLAYLOAD_NAME] = playload 

  const user = await this.prisma.user.findFirst({
    where: {
      id: playload?.sub
    }
  })

  if (!user.active){
     throw new UnauthorizedException("Acesso não autorizado")
  }

} catch(err){
  console.log(err);
  throw new UnauthorizedException("Acesso não autorizado")
}
  
  return true;
}
   extractTokenHeader(request: Request){
     const authorization = request.headers?.authorization

     if (!authorization || typeof authorization !== "string") {
      return
     }

     return authorization.split(' ') [1];
   }

}