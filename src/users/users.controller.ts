    import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
    import { UsersService } from './users.service';
    import { CreateUserDto } from './dto/create-user.dto';
    import { UpdateUserDto } from './dto/update-user.dto';
    import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
    import { TokenPlayloadParam } from 'src/auth/param/token-playload.param';
    import { PlayloadTokenDto } from './dto/playload-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'node:path'
import * as fs from 'node:fs/promises'

    @Controller('users')
    export class UsersController {
      constructor(private readonly userService: UsersService) {}

   @UseGuards(AuthTokenGuard)
      @UseInterceptors(FileInterceptor('file'))
      @Post('upload')
       async uploadAvatar(
        @TokenPlayloadParam() tokenPlayload: PlayloadTokenDto,
        @UploadedFile() file: Express.Multer.File
       ) {
        
        //const mimeType = file.mimetype;
        const fileExtension = path.extname(file.originalname).toLowerCase().substring(1)
        const fileName = `${tokenPlayload.sub}.${fileExtension}`
        const fileLocale = path.resolve(process.cwd(), 'files', fileName)

        await fs.writeFile(fileLocale, file.buffer)
        return {message: 'Upload realizado com sucesso', fileName}
       }

      @Get(':id')
      findOneUser(@Param('id', ParseIntPipe) id: number) {

        console.log('Token teste:', process.env.TOKEN_KEY)
        return this.userService.findOne(id)
      }
      
      @Post()
      createUser(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto)
      }

      @UseGuards(AuthTokenGuard)
      @Patch(':id')
      updatUser(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateUserDto: UpdateUserDto,
        @TokenPlayloadParam() tokenPlayload: PlayloadTokenDto
      ) {
        console.log('Playload recebendo:',  tokenPlayload)

        return this.userService.update(id, updateUserDto, tokenPlayload)
      }

      @UseGuards(AuthTokenGuard)
      @Delete(':id')
      deleteUser(
        @Param('id', ParseIntPipe ) id: number,
        @TokenPlayloadParam() tokenPlayload: PlayloadTokenDto
      ){
        return this.userService.delete(id, tokenPlayload)
      }
       
    }
