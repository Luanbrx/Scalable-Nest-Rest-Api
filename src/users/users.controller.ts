import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPlayloadParam } from 'src/auth/param/token-playload.param';
import { PlayloadTokenDto } from './dto/playload-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';


    @Controller('users')
    export class UsersController {
      constructor(private readonly userService: UsersService) {}

      @Get(':id')
      @ApiOperation({summary: 'Buscar detalhes de um Usuário'})
      findOneUser(@Param('id', ParseIntPipe) id: number) {

        console.log('Token teste:', process.env.TOKEN_KEY)
        return this.userService.findOne(id)
      }
      
      @Post()
      @ApiOperation({summary: 'Cadastrar um novo Usuàrio'})
      createUser(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto)
      }

      @UseGuards(AuthTokenGuard)
      @ApiBearerAuth()
      @ApiOperation({summary: 'Atualizar um Usuário'})
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
      @ApiBearerAuth()
      @ApiOperation({summary: 'Deletar um Usuário'})
      @Delete(':id')
      deleteUser(
        @Param('id', ParseIntPipe ) id: number,
        @TokenPlayloadParam() tokenPlayload: PlayloadTokenDto
      ){
        return this.userService.delete(id, tokenPlayload)
      }

      @UseGuards(AuthTokenGuard)
      @ApiBearerAuth()
      @ApiOperation({summary: 'Atualizar foto do Usuário'})
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary'
            }
          }
        }
      })
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