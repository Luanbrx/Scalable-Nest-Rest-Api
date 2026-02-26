class ITask {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        completed: boolean;
        userId: number;
        description: string;
}

export class ResponseFindOneUserDto {
    id: number;
    name: string;
    email: string;
    avatar: string;
    Task: ITask[];
}

export class ResponseCreateUserDto {
  id: number;
  name: string;
  email: string;
}

export class ResponseUpdateUserDto {
  id: number;
  name: string;
  email: string;
  avatar: string;
}