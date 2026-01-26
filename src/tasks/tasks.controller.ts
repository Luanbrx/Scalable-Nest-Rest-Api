import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TasksService } from "./tasks.service";

@Controller('tasks')
export class TasksController{
  constructor(private readonly tasksService: TasksService){}

  @Get()
getTasks(){
  return this.tasksService.findAll()
}

@Get(":id")
findOneTask(@Param('id') id: string){
  return this.tasksService.findOn(id);
}

@Post()
createTasks(@Body()  body:any){
  console.log(body)

  return this.tasksService.create(body)
}
}

