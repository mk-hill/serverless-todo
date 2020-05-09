import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';

import { updateTodo } from '../../services';
import { getUserId, addMiddleware } from '../utils';
import { createLogger } from '../../utils/logger';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';

const log = createLogger('http/updateTodo');

const updateTodoItem: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  log.info(`Received event`, { event });
  try {
    const { todoId } = event.pathParameters;
    const userId = getUserId(event);
    const request: UpdateTodoRequest = JSON.parse(event.body);
    const item = await updateTodo(todoId, userId, request);
    log.info(`Updated item, returning empty body`, { item });
    return {
      statusCode: 200,
      body: '',
    };
  } catch (error) {
    const message = 'Unable to update todo';
    log.error(message, { error });
    return {
      statusCode: 500,
      body: message,
    };
  }
};

export const handler = addMiddleware(updateTodoItem);
