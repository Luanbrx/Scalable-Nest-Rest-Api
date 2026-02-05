import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "src/tasks/dto/create-task.dto";
import { UpdateTaskDto } from "src/tasks/dto/update-task.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller('tasks')
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

@Post()
createTasks(@Body() createTaskDto: CreateTaskDto ){
  return this.tasksService.create(createTaskDto)
}

@Patch(":id")
updateTask(@Param("id", ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto){
  return this.tasksService.update(id, updateTaskDto)
}

@Delete(":id")
deleteTask(@Param("id", ParseIntPipe) id: number){
  return this.tasksService.delete(id)
}
}

