import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPlayloadParam } from 'src/auth/param/token-playload.param';
import { PlayloadTokenDto } from './dto/playload-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';


    @Controller('users')
    export class UsersController {
      constructor(private readonly userService: UsersService) {}

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

      @UseGuards(AuthTokenGuard)
      @UseInterceptors(FileInterceptor('file'))
      @Post('upload')
       async uploadAvatar(
        @TokenPlayloadParam() tokenPlayload: PlayloadTokenDto,
        @UploadedFile(
          new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: '.(png|jpg|jpeg)',
          })
          .addMaxSizeValidator({
            
            maxSize: 10 * (1024 * 1024)
          })
          .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
          }),

        ) file: Express.Multer.File
       ) {

        return this.userService.uploadAvatarImage(tokenPlayload, file)
    }
  } 