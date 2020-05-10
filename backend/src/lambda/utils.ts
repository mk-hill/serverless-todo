import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { parseUserId } from '../auth/utils';

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  return parseUserId(jwtToken);
}

export const addMiddleware = (handler: APIGatewayProxyHandler) =>
  middy(handler).use(cors({ origin: '*', credentials: true }));
