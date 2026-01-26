import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {

  findAll(){
    return [
      {id: 1, tasks: "Comprar pão"}
    ]
  }

  findOn(id: string){
    return "Buscar tarefa com id" + id
  }

  create(body: any){
    return body
  }
}
