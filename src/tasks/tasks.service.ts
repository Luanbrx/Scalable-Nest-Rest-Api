import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {

  listAllTasks(){
    return [
      {id: 1, tasks: "Comprar pão"}
    ]
  }

  findOneTask(){
    return "Tarefa luan teste"
  }
}
