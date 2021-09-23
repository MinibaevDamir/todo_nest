import { Injectable } from '@nestjs/common';
import { TodoDto } from '../dto/todo.dto';
import { Todo } from '../entities/todo.entity';
import { Op } from 'sequelize';


@Injectable()
export class TodosService {
  async create(data: TodoDto, userId: number) {
    // @ts-ignore
    const todo = await Todo.create({ ...data, userId: userId }, { userId: userId },);
    return todo;
  }
  async findAll(userId, query) {
    const where = {};
    let username = '';

    if (query.username) {
      username = query.username;
    }
    if (query.title) {
      // @ts-ignore
      where.title = { [Op.substring]: query.title };
    }
    if (query.status) {
      // @ts-ignore
      where.status = JSON.parse(query.status);
    }
    return await Todo.scope([
      { method: ['withUser', userId] },
      { method: ['withOwner'] },
    ]).findAll({
      where,
      having: {
        'having_access.nickname': {
          [Op.substring]: username,
        },
      },
    });
  }
  async delete(id) {
    return await Todo.destroy({
      where: { id: id },
    });
  }
  async update(body, id) {
    return await Todo.update(body, {
      where: { id: id },
    });
  }
}
