import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import { UserModel as User, connectDB } from '../../database'
import { SignUpSchema } from '../../schemas/api'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const connection = await connectDB()
  console.log('xcmnbcmnvb')
  console.log(await User.findOne({username: 'akjshdahsk'}))
  // try {
  //   const { method, body } = req
  //   const { email, password } = SignUpSchema.parse(body)
  //   switch (method) {
  //     case 'POST': {
  //       console.log('about to create')
  //       const user = new User({
  //         email,
  //         password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
  //       })

  //       console.log(await user.save())
  //       console.log('created')
  //       res.status(200).json(user)
  //       break
  //     }
  //     default: {
  //       res.setHeader('Allow', ['POST'])
  //       res.status(405).end(`Method ${method} Not Allowed`)
  //     }
  //   }
  // } catch (e) {
  //   res.status(500).json({ error: e.message || 'something went wrong' })
  // } finally {
  //   // connection.close()
  // }
}

export default handler
