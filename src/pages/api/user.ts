import { getSession } from '../../lib/iron'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const session = await getSession(req)
    console.log(session)
    res.status(200).json({ exists: session != null })
  } catch (e) {
    res.statusMessage = e.message || e
    res.status(400).end(res.statusMessage)
  }
}
