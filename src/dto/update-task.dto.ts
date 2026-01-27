import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTaskDto } from '../dto/create-task.dto'
import { PartialType } from "@nestjs/mapped-types";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

  @IsBoolean()
  @IsOptional()
  readonly completed?: boolean;
}