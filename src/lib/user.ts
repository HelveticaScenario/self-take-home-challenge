// import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { User, connectDB, IUser } from './database'

/**
 * User methods. The example doesn't contain a DB, but for real applications you must use a
 * db here, such as MongoDB, Fauna, SQL, etc.
 */

export const createUser = async (
  email: string,
  password: string
): Promise<IUser> => {
  await connectDB()
  return User.create({
    email,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
  })
}

export const findUser = async (
  email: string,
  password: string
): Promise<IUser | null> => {
  // Here you should lookup for the user in your DB and compare the password:
  //
  // const user = await DB.findUser(...)
  // const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex')
  // const passwordsMatch = user.hash === hash

  await connectDB()
  const user = await User.findOne({ email })

  if (user && bcrypt.compareSync(password, user.password)) {
    // Any object returned will be saved in `user` property of the JWT
    return Promise.resolve(user)
  } else {
    // If you return null or false then the credentials will be rejected
    return Promise.resolve(null)
  }
}
