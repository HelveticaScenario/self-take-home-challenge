import passport from 'passport'
import nextConnect from 'next-connect'
import { localStrategy } from '../../lib/passwordLocal'
import { encryptSession } from '../../lib/iron'
import { setTokenCookie } from '../../lib/authCookies'
import { NextApiRequest, NextApiResponse } from 'next'

const authenticate = (
  method: string,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Record<string, unknown>> =>
  new Promise((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, token) => {
      console.log('mnbcnmxbcmbnv', error, token)
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })(req, res)
  })

passport.use(localStrategy)

export default nextConnect<NextApiRequest, NextApiResponse>()
  .use(passport.initialize())
  .post(async (req, res) => {
    try {
      const user = await authenticate('local', req, res)
      if (!user) {
        throw new Error()
      }
      // session is the payload to save in the token, it may contain basic info about the user
      const session = { ...user }
      // The token is a string with the encrypted session
      const token = await encryptSession(session)

      setTokenCookie(res, token)
      res.status(200).send({ done: true })
    } catch (error) {
      console.error(error)
      res.status(401).send(error.message)
    }
  })
