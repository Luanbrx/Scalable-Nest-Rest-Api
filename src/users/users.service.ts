import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { PlayloadTokenDto } from './dto/playload-token.dto';
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { ResponseCreateUserDto, ResponseFindOneUserDto, ResponseUpdateUserDto } from './dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor
  ( private prisma: PrismaService,
   private readonly hashingService: HashingServiceProtocol
  ) { }

  async findOne(id: number): Promise<ResponseFindOneUserDto>{
    const user = await this.prisma.user.findFirst ({
      where: {
        id: id, 
      }, 
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        Task: true
      }
  })

  if (user) return user;

  throw new HttpException('Usuário não encontrado!', HttpStatus.BAD_REQUEST)
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseCreateUserDto>{
    try{

      const passwordHash = await this.hashingService.hash(createUserDto.password)
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHast: passwordHash
        }, 
        select:{
          id: true,
          name: true,
          email: true,
        }
      })

      return user; 

    } catch(err){
      console.log(err);
      throw new HttpException('Falha ao cadastrar usuário', HttpStatus.BAD_REQUEST)
    }
  }

 async update(id: number, updateUserDto: UpdateUserDto, tokenPlayload: PlayloadTokenDto): Promise<ResponseCreateUserDto>{
    try{
      const user = await this.prisma.user.findFirst({
            where:{
            id: id,
      },
      })

      if (!user){
        throw new HttpException('Usuário não existe!', HttpStatus.BAD_REQUEST)
      }

      if (user.id !== tokenPlayload.sub){
        throw new HttpException('Acesso negado!', HttpStatus.BAD_REQUEST)
      }

      const dataUser: {name?: string, passwordHash?: string} = {
        name: updateUserDto.name ? updateUserDto.name : user.name,
      }
       
      if (updateUserDto?.password){
        const passwordHash = await this.hashingService.hash(updateUserDto?.password)
        dataUser['passworHash'] = passwordHash
      }

      const updateUser = await this.prisma.user.update({
         where:{
          id: user.id
         },
         data:{
          name: dataUser.name,
          passwordHast: dataUser.passwordHash ? dataUser?.passwordHash : user.passwordHast
         },
         select:{
          id: true,
          name: true,
          email: true,
         }
      })

      return updateUser;
     
    }catch(err){
      console.log(err);
      throw new HttpException('Falha ao atualizar usuário', HttpStatus.BAD_REQUEST)
  }
    }

   async delete (id : number, tokenPlayload: PlayloadTokenDto){
      try{
        const user = await this.prisma.user.findFirst({
            where:{
            id: id,
      },
      })

      if (!user){
        throw new HttpException('Usuário não existe!', HttpStatus.BAD_REQUEST) 
      }

      if (user.id !== tokenPlayload.sub){
        throw new HttpException('Acesso negado!', HttpStatus.BAD_REQUEST)
      }

      await this.prisma.user.delete({
        where:{
          id: user.id
        }
      })

      return{
        message: "Usuàrio deletado com sucesso!"
      }

   } catch(err){
    console.log(err);
    throw new HttpException('Falha ao deleta usuário!', HttpStatus.BAD_REQUEST)
   }   
}
  
async uploadAvatarImage(tokenPlayload: PlayloadTokenDto, file: Express.Multer.File): Promise<ResponseUpdateUserDto>{
  try{
    const mimeType = file.mimetype;
  const fileExtension = path.extname(file.originalname).toLowerCase().substring(1)
         
  const fileName = `${tokenPlayload.sub}.${fileExtension}`
  const fileLocale = path.resolve(process.cwd(), 'files', fileName)
  await fs.writeFile(fileLocale, file.buffer)

  await fs.writeFile(fileLocale, file.buffer)

  const user = await this.prisma.user.findFirst({
    where: {
      id: tokenPlayload.sub
    }
  })

  if(!user){
    throw new HttpException("Falha ao atualizar o avatar do usuário!", HttpStatus.BAD_REQUEST) 
  }

  const updateUser = await this.prisma.user.update({
    where:{
      id: user.id
    },
    data:{
      avatar: fileName
    },
    select:{
      id: true,
      name:true,
      email: true,
      avatar: true,
    }
  })
  return updateUser; 

  }catch(err){
    console.log(err);
    throw new HttpException("Falha ao atualizar o avatar do usuário!", HttpStatus.BAD_REQUEST)
  }
}
}