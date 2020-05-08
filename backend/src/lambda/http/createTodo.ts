import 'source-map-support/register';
import { v4 as uuid } from 'uuid';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { TodoItem } from '../../models/TodoItem';
import { getUserId } from '..//utils';
import { createTodo } from '../../aws';
import { createLogger } from '../../utils/logger';

const log = createLogger('createTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const item = await createItemInTable(event);
  return {
    statusCode: 201,
    body: JSON.stringify({ item }),
  };
};

const createItemInTable = (e: APIGatewayProxyEvent) => {
  // const time = process.hrtime();
  const { name, dueDate }: CreateTodoRequest = JSON.parse(e.body);

  const todo: TodoItem = {
    name,
    dueDate,
    todoId: uuid(),
    userId: getUserId(e),
    done: false,
    createdAt: new Date().toISOString(),
  };

  return createTodo(todo);
};
