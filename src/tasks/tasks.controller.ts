import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
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

@Patch(":id")
updateTask(@Param("id") id: string, @Body() body: any){
  console.log("ID: ", id)
  console.log("body: ", body)

  return "Atualizando tarefa"
}

@Delete(":id")
deleteTask(@Param("id") id: string){
  console.log ("ID ENVIADO")

  return "Deletar tarefa com id" + id
}
}

