import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';

import { getTodos } from '../../services';
import { getUserId, addMiddleware } from '../utils';
import { createLogger } from '../../utils/logger';

const log = createLogger('http/getTodos');

const getUserTodos: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  log.info(`Received event`, { event });
  try {
    const items = (await getTodos(getUserId(event))) ?? [];
    log.info(`Returning retrieved items`, { items });
    return {
      statusCode: 200,
      body: JSON.stringify({ items }),
    };
  } catch (error) {
    const message = 'Unable to retrieve todos';
    log.error(message, { error });
    return {
      statusCode: 500,
      body: message,
    };
  }
};

export const handler = addMiddleware(getUserTodos);
