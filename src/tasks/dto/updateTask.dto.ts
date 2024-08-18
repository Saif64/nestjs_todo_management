import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../enums/tasks-status.enum';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
