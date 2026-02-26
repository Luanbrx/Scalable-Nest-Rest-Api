import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "src/tasks/dto/create-task.dto";
import { UpdateTaskDto } from "src/tasks/dto/update-task.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { AuthoAdminGuard } from "src/common/guards/admin.guard";
import { TokenPlayloadParam } from "src/auth/param/token-playload.param";
import { PlayloadTokenDto } from "src/users/dto/playload-token.dto";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";

@Controller('tasks')
export class TasksController{
  constructor(private readonly tasksService: TasksService){}

  @Get()
  @ApiOperation({summary: 'Buscar todas as tarefas'})
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'LImite de tarefas a ser buscadas'
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 0,
    description: 'Itens que deseja pular'
  }) 
findAllTask(@Query() paginationDto: PaginationDto){
  return this.tasksService.findAll(paginationDto)
}

@Get(":id")
@ApiOperation({ summary: 'Buscar detalhes de uma tarefa'})
@ApiParam({
  name: 'id',
  description: 'ID da tarefa',
  example: 1,
})
findOneTask(@Param('id', ParseIntPipe) id: number){
  return this.tasksService.findOn(id);
}

@UseGuards(AuthoAdminGuard)
@ApiBearerAuth()
@ApiOperation({summary: 'Criar uma tarefa'})
@Post()
createTasks(
  @Body() createTaskDto: CreateTaskDto,
  @TokenPlayloadParam() tokenplayload : PlayloadTokenDto
){
  return this.tasksService.create(createTaskDto, tokenplayload)
}

@UseGuards(AuthoAdminGuard)
@ApiBearerAuth()
@ApiOperation({summary: 'Atualizar uma tarefa'})
@ApiParam({
  name: 'id',
  description: 'ID da tarefa',
})
@Patch(":id")
updateTask(
  @Param("id", ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto,
  @TokenPlayloadParam() tokenplayload : PlayloadTokenDto
){
  return this.tasksService.update(id, updateTaskDto, tokenplayload)
}

@UseGuards(AuthoAdminGuard)
@ApiBearerAuth()
@ApiOperation({summary: 'Excluir uma tarefa'})
@Delete(":id")
deleteTask(
  @Param("id", ParseIntPipe) id: number,
  @TokenPlayloadParam() tokenplayload : PlayloadTokenDto
){
  return this.tasksService.delete(id, tokenplayload)
}
}

