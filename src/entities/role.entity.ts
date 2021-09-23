import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from './user.entity';
@Table({ tableName: 'Roles' })
export class Role extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  role: string;

  @HasMany(() => User, 'roleId')
  null;
}
