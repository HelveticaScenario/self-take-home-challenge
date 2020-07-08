import { removeTokenCookie } from '../../lib/authCookies'
import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse): void => {
  removeTokenCookie(res)
  res.writeHead(302, { Location: '/login' })
  res.end()
}
