import { Todo } from '../data';
import { createLogger } from '../utils/logger';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const log = createLogger('services/updateTodo');

export const updateTodo = (todoId: string, userId: string, request: UpdateTodoRequest) => {
  log.debug('Updating item', { item: { todoId, userId, ...request } });
  return Todo.update(todoId, userId, request);
};
