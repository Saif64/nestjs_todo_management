/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskDto } from '../dto/cerateTask.dto';
import { UpdateTaskDto } from '../dto/updateTask.dto';
import { FilteredTaskDto } from '../dto/filterTask.dto';
import { TaskRepository } from '../repository/task.respository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entity/task.entity';
import { TaskStatus } from '../enums/tasks-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: string): Promise<TaskEntity> {
    const found = this.taskRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskById(id: string): Promise<void> {
    const found = this.getTaskById(id);

    this.taskRepository.delete({ id: (await found).id });
  }

  async updateTaskStatus(
    updateTaskDto: UpdateTaskDto,
    id: string,
  ): Promise<TaskEntity> {
    const { status } = updateTaskDto;
    const task = await this.getTaskById(id);

    if (task) {
      task.status = status;
    }

    this.taskRepository.save(task);
    return task;
  }

  async createTasksFromCsv(tasksDto: CreateTaskDto[]): Promise<TaskEntity[]> {
    const tasks = tasksDto.map(({ name, description }) =>
      this.taskRepository.create({
        name,
        description,
        status: TaskStatus.OPEN,
      }),
    );

    return this.taskRepository.save(tasks);
  }
}
