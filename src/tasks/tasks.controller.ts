import { Controller, Get, Post, Body, Param, Delete, Patch, Query, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './models/task.model';
import { TaskStatus } from './enums/task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    public async getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Array<Task>> {

       if(Object.keys(filterDto).length) {
            return await this.tasksService.getTasksWithFilters(filterDto);
       } else {
           return await this.tasksService.getTasks();
       }
    }

    @Post()
    @UsePipes(ValidationPipe)
    public async createTask(
            @Body() createTaskDTO: CreateTaskDTO,
        ): Promise<Task> {
        return  this.tasksService.createTask(createTaskDTO);
    }

    @Get(':id')
    public async getTaskById(@Param('id') taskId:string): Promise<Task> {
        return await this.tasksService.getTaskById(taskId);
    }

    @Delete(':id')
    public async deleteTaskById(@Param('id') taskId:string): Promise<void> {
        await this.tasksService.deleteTaskById(taskId);
    }

    @Patch(':id/status')
    public async updateTask(@Param('id') taskId:string, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
        return await this.tasksService.updateTaskStatusById(taskId, status);
    }
}
