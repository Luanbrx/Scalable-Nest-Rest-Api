import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateTaskDto{

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

}