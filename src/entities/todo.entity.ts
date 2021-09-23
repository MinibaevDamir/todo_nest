import {
  Column,
  Model,
  BelongsTo,
  Scopes,
  Sequelize,
  AfterCreate,
  DataType,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { userTodosMap } from './userTodos.entity';
import { User } from './user.entity';
@Scopes(() => ({
  withUser: function (userId: number) {
    return {
      include: [
        {
          association: 'links',
          where: { userId },
          attributes: [],
        },
      ],
    };
  },
  withOwner: function () {
    return {
      include: [
        {
          model: Todo,
          as: 'having_access',
          required: true,
          attributes: [
            [
              Sequelize.fn(
                'GROUP_CONCAT',
                Sequelize.col('`having_access->links->userLink`.`nickname`'),
              ),
              'nickname',
            ],
          ],
          include: [
            {
              association: 'links',
              required: true,
              attributes: [],
              include: [
                {
                  required: true,
                  association: 'userLink',
                  attributes: [],
                },
              ],
            },
          ],
        },
      ],
      group: ['`having_access`.`id`'],
    };
  },
}))
@Table({ tableName: 'Todos' })
export class Todo extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.BOOLEAN })
  status: boolean;
  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;
  defaultValue: '';

  @AfterCreate
  static async afterCreateHook(instance, options) {
    const userTodos = [];
    const users = await User.findAll({ where: { roleId: 2 } });
    users.map(async (u) => {
      userTodos.push({ userId: u.id, todoId: instance.id });
    }),
      userTodos.push({ userId: options.userId, todoId: instance.id });
    await userTodosMap.bulkCreate(userTodos, {
      updateOnDuplicate: ['userId', 'todoId'],
    });
  }

  @BelongsTo(() => userTodosMap, { foreignKey: 'id', targetKey: 'todoId' })
  links: userTodosMap[];
  @BelongsTo(() => Todo, { foreignKey: 'id', targetKey: 'id' })
  having_access: Todo[];
}
