import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}