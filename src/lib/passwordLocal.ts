import Local from 'passport-local'
import { findUser } from './user'

export const localStrategy = new Local.Strategy(
  {
    usernameField: 'email',
    session: false,
  },
  (email, password, done) => {
    findUser(email, password)
      .then((user) => {
        done(null, user?.id)
      })
      .catch((error) => {
        done(error)
      })
  }
)
