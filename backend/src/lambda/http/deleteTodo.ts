import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { deleteTodo } from '../../services';
import { getUserId, addMiddleware } from '../utils';
import { createLogger } from '../../utils/logger';

const log = createLogger('http/deleteTodo');

const deleteTodoItem: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  log.info(`Received event`, { event });
  try {
    const { todoId } = event.pathParameters;
    const userId = getUserId(event);
    log.info(`Deleting item`, { todoId, userId });
    const item = await deleteTodo(todoId, userId);
    log.info(`Deleted item, returning empty body`, { item });
    return {
      statusCode: 200,
      body: '',
    };
  } catch (error) {
    const message = 'Unable to delete todo';
    log.error(message, { error });
    return {
      statusCode: 500,
      body: message,
    };
  }
};

export const handler = addMiddleware(deleteTodoItem);
