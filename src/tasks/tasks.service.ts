import { Injectable } from '@nestjs/common';
import { Task } from './entities/tasks.entities';

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

  findOn(id: string){
    return this.tasks.find( task => task.id === Number(id))
  }

  create(body: any){
    const newId = this.tasks.length + 1;

    const newTask = {
      id: newId,
      ...body,
    }
    
    this.tasks.push(newTask)
    return newTask
  }

  update(id: string, body: any){
    const tasksIndex = this.tasks.findIndex(task => task.id === Number(id))

    if(tasksIndex >= 0){
      const taskItem = this.tasks[tasksIndex]

      this.tasks[tasksIndex]= {
        ...taskItem,
        ...body,
      }
    }
    return "Tarefa atualizada"
  }
}
