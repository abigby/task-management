import { TaskStatus } from "../enums/task-status.enum";

export class UpdateTaskDTO {
    public title: string;
    public description: string;
    public status: TaskStatus;
}