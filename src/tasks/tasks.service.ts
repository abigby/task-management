import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Task } from './models/task.model';
import { TaskStatus } from './enums/task-status.enum';
import {v1 as uuid} from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';


@Injectable()
export class TasksService {
    private tasks: Array<Task> = new Array<Task>();

    public getTasks(): Array<Task> {
        return this.tasks; 
    }

    public async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Array<Task>> {

        const { status, search } = filterDto;
        let tasks = await this.getTasks();

        if(status) {
            tasks = await tasks.filter(
                (task) => {
                   return task.status === status;
                }
            )
        }

        if(search) {
            tasks = await tasks.filter(
                (task) => {
                    return task.title.includes(search) || task.description.includes(search);
                }
            )
        }
        return tasks;
    }

    public async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
        const { title, description } = createTaskDTO;
        const task: Task = {
            id: uuid(),
            title,
            description, 
            status: TaskStatus.OPEN
        }
        
        this.tasks.push(task);
        return await task;
    }

    public async getTaskById(taskId: string): Promise<Task> {
        const found = await this.tasks.find(
            (task) => {
                return task.id === taskId;
            }
        );
        if(!found) {
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }

        return found;
    }

    public async deleteTaskById(taskId: string): Promise<void> {
        const [_, index] = await this.findTask(taskId);
        this.tasks.splice(index as number, 1);
    }

    public async updateTaskById(taskId:string, updateTaskDTO:UpdateTaskDTO): Promise<Task> {
        const [task, index] = await this.findTask(taskId);
        const { title, description } = updateTaskDTO;

        const updatedTask:Task = {
            id: taskId,
            title,
            description,
            status: TaskStatus.IN_PROGRESS
        }

        this.tasks[index as number] = updatedTask;
        return  updatedTask;
    }

    public async updateTaskStatusById(taskId:string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(taskId);
        task.status = status;

        return  task;
    }

    private async findTask(taskId:string): Promise<Array<Task | number>> {
        const index: number = await this.tasks.findIndex(
            (task) => task.id === taskId
        );

        const task:Task = await this.tasks[index];
        if(!task) {
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }
        
        return await [task, index];
    }
}
