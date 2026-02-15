import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import { SingInDto } from './dto/signin.dto';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService
  ) { }

  async authenticate(singInDto: SingInDto) {

    const user = await this.prisma.user.findFirst({
       where: {
      email: singInDto.email,
      active: true
    }
    })

    if (!user){
      throw new HttpException("Falha ao fazer login", HttpStatus.UNAUTHORIZED)
    }

    const passwordIsValid = await this.hashingService.compare(singInDto.password, user.passwordHast)

    if (!passwordIsValid) {
      throw new HttpException("Senha/Usuário incorretos", HttpStatus.UNAUTHORIZED)
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    },
      {
       secret: this.jwtConfiguration.secret,
       expiresIn: this.jwtConfiguration.jwtTtl as unknown as number,
       audience: this.jwtConfiguration.audience,
       issuer: this.jwtConfiguration.issuer
      }
  )

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token
    }
  }
}
