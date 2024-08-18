import { Repository } from 'typeorm';
import { TaskEntity } from '../entity/task.entity';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { CreateTaskDto } from '../dto/cerateTask.dto';
import { TaskStatus } from '../enums/tasks-status.enum';
import { FilteredTaskDto } from '../dto/filterTask.dto';
import { createReadStream } from 'fs';
import csvParser from 'csv-parser';

@CustomRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getTask(filteredTaskDto: FilteredTaskDto): Promise<TaskEntity[]> {
    const query = this.createQueryBuilder('task_entity');
    const { status, search } = filteredTaskDto;

    if (status) {
      query.andWhere('task_entity.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task_entity.name) LIKE LOWER(:search) OR LOWER(task_entity.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { name, description } = createTaskDto;

    const task = this.create({
      name: name,
      description: description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }
}
