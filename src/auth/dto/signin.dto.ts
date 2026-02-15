import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SingInDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}