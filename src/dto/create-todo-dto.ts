export class CreateTodoDto {
  todo: {
    title: string;
    status: boolean;
  };
  user: {
    id: number;
  };
}
