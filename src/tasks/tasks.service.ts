import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from './entities/tasks.entities';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service'
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PlayloadTokenDto } from 'src/users/dto/playload-token.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private tasks: Task[] =[
    {
      id: 1,
      name: "Teste",
      description: "Estudando",
      completed: false,
    }
  ]

  async findAll(paginationDto?: PaginationDto){
    const {limit = 10, offset = 0} = paginationDto;

    const allTasks = await this.prisma.task.findMany({
      take: limit,
      skip: offset,
      orderBy:{
        createdAt: "desc"
      }
    });
    return allTasks;
  }

  async findOn(id: number){
    const task = await this.prisma.task.findFirst({
      where: {
        id: id
      }
    })

    if (task?.name) return task;

    throw new HttpException ("Essa tarefa não existe", HttpStatus.NOT_FOUND)
  }

  async create(createTaskDto: CreateTaskDto, tokenPlayload: PlayloadTokenDto){
    try{
      const newTask = await this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        completed: false,
        userId: tokenPlayload.sub
      } 
    })
    return newTask;
    }catch(err){
      console.log(err);
      throw new HttpException("Falha ao cadastrar tarefa", HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, tokenPlayload: PlayloadTokenDto){
    try{
      const findTask = await this.prisma.task.findFirst({
    where: {
      id: id
    }
    })

    if (!findTask){
      throw new HttpException ("Essa tarefa não existe!", HttpStatus.NOT_FOUND)
    }

    if (findTask.userId !== tokenPlayload.sub){
      throw new HttpException ("Essa tarefa não existe!", HttpStatus.NOT_FOUND)
    }

    const task = await this.prisma.task.update({
      where: {
        id: findTask.id
      },
      data:{
        name: updateTaskDto?.name ? updateTaskDto?.name : findTask.name,
        description: updateTaskDto?.description ? updateTaskDto?.description : findTask.description,
        completed: updateTaskDto?.completed ? updateTaskDto?.completed : findTask.completed,
      }
    })
    return task;
    } catch(err){
      console.log(err)
      throw new HttpException("Falha ao atualizar a tarefa", HttpStatus.NOT_FOUND)
    }
    }

    async delete (id: number, tokenPlayload: PlayloadTokenDto){
    try{
         const findTask = await this.prisma.task.findFirst({
    where: {
      id: id
    }
    })

    if (!findTask){
      throw new HttpException ("Essa tarefa não existe!", HttpStatus.NOT_FOUND)
    }

    if (findTask.userId !== tokenPlayload.sub){
      throw new HttpException ("Falha ao deletar essa tarefa!", HttpStatus.BAD_REQUEST)
    }

    await this.prisma.task.delete({
      where: {
        id: findTask.id
      }
    })
    return {
      message: "Tarefa deletada com sucesso!"
    }

    }catch(err){
      console.log(err)
      throw new HttpException("Falha ao deletar a tarefa", HttpStatus.NOT_FOUND)
    }
}   
} 