import Iron from '@hapi/iron'
import { getTokenCookie } from './authCookies'
import { NextApiRequest } from 'next'

// Use an environment variable here instead of a hardcoded value for production
const TOKEN_SECRET = (() => {
  const secret = process.env.TOKEN_SECRET
  if (secret == null) {
    throw new Error('TOKEN_SECRET env variable must be defined')
  }
  return secret
})()
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const encryptSession = (session: any) => {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults)
}

export const getSession = async (req: NextApiRequest): Promise<any> => {
  const token = getTokenCookie(req)
  return token && Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
}
