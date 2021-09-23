import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodoDto } from '../dto/todo.dto';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../decorators/User.decorator';
import { CreateTodoDto } from '../dto/create-todo-dto';

@Controller('api/todo')
export class TodosController {
  constructor(private todoService: TodosService) {}
  @UseGuards(JwtAuthGuard)
  @Post('/')
  create(@Body() data: CreateTodoDto, @User() user: any) {
    let userId: number;
    if (data.user.id) {
      userId = data.user.id;
    } else {
      userId = user.id;
    }
    return this.todoService.create(data.todo, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/get')
  find(@User() user: any, @Query() query) {
    return this.todoService.findAll(user.id, query);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  patch(@Body() data: TodoDto, @Param() params) {
    return this.todoService.update(data, params.id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(@Param() params) {
    return this.todoService.delete(params.id);
  }
}
