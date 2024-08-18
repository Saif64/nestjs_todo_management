/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from '../repository/task.respository';
import { FilteredTaskDto } from '../dto/filterTask.dto';
import { TaskEntity } from '../entity/task.entity';

@Injectable()
export class FilterService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getTasks(filteredTaskDto: FilteredTaskDto): Promise<TaskEntity[]> {
    return this.taskRepository.getTask(filteredTaskDto);
  }
}
