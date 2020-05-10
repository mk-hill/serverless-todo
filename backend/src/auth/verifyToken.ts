import { verify, decode } from 'jsonwebtoken';
import axios, { AxiosResponse } from 'axios';
import { createLogger } from '../utils/logger';

import { Jwt, JwtPayload, Jwks } from '.';

const log = createLogger('auth/verifyToken');

const jwksUrl = process.env.AUTH0_URL;
let auth0Cert;

export async function verifyToken(authHeader: string): Promise<JwtPayload> {
  try {
    const token = getToken(authHeader);
    const jwt: Jwt = decode(token, { complete: true }) as Jwt;
    if (!auth0Cert) {
      auth0Cert = await getAuth0Cert(jwt);
    }
    return verify(token, auth0Cert, { algorithms: ['RS256'] }) as JwtPayload;
  } catch (error) {
    log.error('Unable verify token', { error });
    throw error;
  }
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header');

  if (!authHeader.toLowerCase().startsWith('bearer ')) throw new Error('Invalid authentication header');

  const split = authHeader.split(' ');
  const token = split[1];

  return token;
}

async function getAuth0Cert(jwt: Jwt) {
  log.info('Requesting Auth0 certificate');
  try {
    const { kid } = jwt.header; // Unique identifier for the key

    // https://auth0.com/blog/navigating-rs256-and-jwks
    const isRsaSigningKeyWithMatchingKidAndCert = (key) =>
      key.use === 'sig' && key.kty === 'RSA' && key.kid === kid && key.x5c && key.x5c.length;
    log.debug('Requesting JWKS', { jwksUrl });

    const response: AxiosResponse<Jwks> = await axios.get(jwksUrl);
    log.debug('Received JWKS response', { response });

    const cert = response.data.keys.find(isRsaSigningKeyWithMatchingKidAndCert).x5c[0];
    log.debug('Found certificate matching kid', { cert, kid });

    return certToPem(cert);
  } catch (error) {
    log.error('Unable to retrieve Auth0 certificate', { error });
    throw error;
  }
}

const certToPem = (key) => `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----`;
