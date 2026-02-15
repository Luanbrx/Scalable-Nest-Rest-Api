import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "src/tasks/dto/create-task.dto";
import { UpdateTaskDto } from "src/tasks/dto/update-task.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { AuthoAdminGuard } from "src/common/guards/admin.guard";
import { TokenPlayloadParam } from "src/auth/param/token-playload.param";
import { PlayloadTokenDto } from "src/users/dto/playload-token.dto";

@Controller('tasks')
@UseGuards(AuthoAdminGuard)
export class TasksController{
  constructor(private readonly tasksService: TasksService){}

  @Get()
findAllTask(@Query() paginationDto: PaginationDto){
  return this.tasksService.findAll(paginationDto)
}

@Get(":id")
findOneTask(@Param('id', ParseIntPipe) id: number){
  return this.tasksService.findOn(id);
}

@UseGuards(AuthoAdminGuard)
@Post()
createTasks(
  @Body() createTaskDto: CreateTaskDto,
  @TokenPlayloadParam() tokenplayload : PlayloadTokenDto
){
  return this.tasksService.create(createTaskDto, tokenplayload)
}

@UseGuards(AuthoAdminGuard)
@Patch(":id")
updateTask(
  @Param("id", ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto,
  @TokenPlayloadParam() tokenplayload : PlayloadTokenDto
){
  return this.tasksService.update(id, updateTaskDto, tokenplayload)
}

@UseGuards(AuthoAdminGuard)
@Delete(":id")
deleteTask(
  @Param("id", ParseIntPipe) id: number,
  @TokenPlayloadParam() tokenplayload : PlayloadTokenDto
){
  return this.tasksService.delete(id, tokenplayload)
}
}

