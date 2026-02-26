
export class ResposeTaskDto {
    id: number;
    name: string;
    description: string;
    completed: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    userId: number;
}