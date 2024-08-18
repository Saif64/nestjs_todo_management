import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';

import { Module } from '@nestjs/common';
import { TaskEntity } from './tasks/entity/task.entity';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'task-management',
      autoLoadEntities: true,
      entities: [TaskEntity],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
