import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  IsEmail,
  Model,
  Table,
} from 'sequelize-typescript';
import { userTodosMap } from './userTodos.entity';
import { Role } from './role.entity';

@Table({ tableName: 'Users' })
export class User extends Model {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  nickname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @IsEmail
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  roleId: number;

  @HasMany(() => userTodosMap, 'userId')
  userLink: userTodosMap;
}
