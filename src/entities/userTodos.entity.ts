import {
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  Table,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Todo } from './todo.entity';
@Table({ tableName: 'userTodosMaps' })
export class userTodosMap extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ForeignKey(() => Todo)
  @Column({ type: DataType.INTEGER, allowNull: false })
  todoId: number;

  @BelongsTo(() => User, { foreignKey: 'userId', targetKey: 'id' })
  userLink: User;
}
