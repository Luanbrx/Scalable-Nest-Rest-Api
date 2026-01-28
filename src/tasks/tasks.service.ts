import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from './entities/tasks.entities';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';

@Injectable()
export class TasksService {

  private tasks: Task[] =[
    {
      id: 1,
      name: "Teste",
      description: "Estudando",
      completed: false,
    }
  ]

  findAll(){
    return this.tasks;
  }

  findOn(id: number){
    const task = this.tasks.find( task => task.id === id)

    if (task) return task;

    throw new HttpException ("Essa tarefa não existe", HttpStatus.NOT_FOUND)
  }

  create(createTaskDto: any){
    const newId = this.tasks.length + 1;

    const newTask = {
      id: newId,
      ...createTaskDto,
      completed: false,
    }
    
    this.tasks.push(newTask)
    return newTask
  }

  update(id: number, updateTaskDto: UpdateTaskDto){
    const tasksIndex = this.tasks.findIndex(task => task.id === id)

    if(tasksIndex >= 0){
      throw new HttpException ("Essa tarefa não existe", HttpStatus.NOT_FOUND)
    }
      const taskItem = this.tasks[tasksIndex]

      this.tasks[tasksIndex]= {
        ...taskItem,
        ...updateTaskDto,
      }
      return "Tarefa atualizada"
    }

    delete (id: number){
      const tasksIndex = this.tasks.findIndex(task => task.id === id)
    
      if(tasksIndex >= 0){
      throw new HttpException ("Essa tarefa não existe", HttpStatus.NOT_FOUND)
      }

      this.tasks.splice(tasksIndex, 1)
   return {
     message:  "Tarefa Excluida" }  
}   
} 