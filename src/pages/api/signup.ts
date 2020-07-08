import { NextApiRequest, NextApiResponse } from 'next'
import { SignUpSchema } from '../../schemas/api'
import { createUser } from '../../lib/user'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const { method, body } = req
    const { email, password } = SignUpSchema.parse(body)
    switch (method) {
      case 'POST': {
        await createUser(email, password)
        res.status(200).end()
        break
      }
      default: {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
      }
    }
  } catch (e) {
    res.status(500).json({ error: e.message || 'something went wrong' })
  }
}

export default handler
