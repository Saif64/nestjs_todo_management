/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { CreateTaskDto } from './dto/cerateTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { FilteredTaskDto } from './dto/filterTask.dto';
import { FilterService } from './services/filter.service';
import { TaskEntity } from './entity/task.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { Readable } from 'stream';
import * as csvParser from 'csv-parser';

@Controller('tasks')
export class TasksController {
  constructor(
    private taskService: TasksService,
    private filterService: FilterService,
  ) {}

  @Get()
  getTasks(@Query() filteredTaskDto: FilteredTaskDto): Promise<TaskEntity[]> {
    return this.filterService.getTasks(filteredTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<TaskEntity> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string) {
    this.taskService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateTaskById(
    @Param('id') id: string,
    @Body() updatetaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return this.taskService.updateTaskStatus(updatetaskDto, id);
  }

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      console.error('No file uploaded');
      return { message: 'No file uploaded' };
    }

    console.log('File uploaded successfully:', file.originalname);

    const tasks: CreateTaskDto[] = [];

    const stream = Readable.from(file.buffer.toString());

    await new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', (data) => tasks.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    const createdTasks = await this.taskService.createTasksFromCsv(tasks);

    return { message: 'Tasks created successfully', tasks: createdTasks };
  }
}
