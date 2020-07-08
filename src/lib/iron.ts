import Iron from '@hapi/iron'
import { getTokenCookie } from './authCookies'
import { NextApiRequest } from 'next'
import * as z from 'zod'

// Use an environment variable here instead of a hardcoded value for production
const TOKEN_SECRET = (() => {
  const secret = process.env.TOKEN_SECRET
  if (secret == null) {
    throw new Error('TOKEN_SECRET env variable must be defined')
  }
  return secret
})()

const SessionSchema = z.object({ userId: z.string() })
type ISession = z.infer<typeof SessionSchema>
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const encryptSession = (session: ISession) => {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults)
}

export const getSession = async (
  req: NextApiRequest
): Promise<ISession | undefined> => {
  const token = getTokenCookie(req)

  return z
    .union([z.undefined(), SessionSchema])
    .parse(token && (await Iron.unseal(token, TOKEN_SECRET, Iron.defaults)))
}
