import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { v4 as uuid } from 'uuid';
import { TodoItem } from '../models/TodoItem';
import { Todo } from '../data';
import { createLogger } from '../utils/logger';

const log = createLogger('services/createTodo');

export const createTodo = (req: CreateTodoRequest, userId: string) => {
  const todoId = uuid();
  log.info(`Creating todo item ${todoId}`);

  const { name, dueDate } = req;
  const todo: TodoItem = {
    name,
    dueDate,
    todoId,
    userId,
    done: false,
    createdAt: new Date().toISOString(),
  };

  return Todo.create(todo);
};
