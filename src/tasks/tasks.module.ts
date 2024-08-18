import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { TaskRepository } from './repository/task.respository';
import { FilterService } from './services/filter.service';
import { TasksService } from './services/tasks.service';
import { TasksController } from './tasks.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([TaskRepository])],
  controllers: [TasksController],
  providers: [TasksService, FilterService],
})
export class TasksModule {}
