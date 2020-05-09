import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { getUserId, addMiddleware } from '../utils';
import { createLogger } from '../../utils/logger';
import { createTodo } from '../../services';

const log = createLogger('http/createTodo');

const createTodoItem: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  log.info(`Received event: ${JSON.stringify(event)}`, { event });
  try {
    const item = await createTodo(JSON.parse(event.body), getUserId(event));
    log.info('Returning created item', { item });
    return {
      statusCode: 201,
      body: JSON.stringify({ item }),
    };
  } catch (error) {
    const message = 'Unable to create todo';
    log.error(message, { error });
    return {
      statusCode: 500,
      body: message,
    };
  }
};

export const handler = addMiddleware(createTodoItem);
