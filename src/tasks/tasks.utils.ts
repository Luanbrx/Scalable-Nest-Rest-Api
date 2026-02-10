import { Injectable } from "@nestjs/common";

@Injectable()
export class TasksUtils{
  splitString(text: string){
    return text.split(" ")
  }
}