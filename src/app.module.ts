import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Todo } from './entities/todo.entity';
import { userTodosMap } from './entities/userTodos.entity';
import { Role } from './entities/role.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '#Asad2001g_',
      database: 'tododb',
      define: {
        timestamps: false,
      },
      models: [User, Todo, userTodosMap, Role],
    }),
    UsersModule,
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
