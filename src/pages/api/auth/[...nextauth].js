// this should be converted to typescript when next-auth has official typescript definitions
// https://github.com/iaincollins/next-auth/pull/220
import bcrypt from 'bcrypt'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { UserModel } from '../../../database'

const options = {
  site: process.env.site,
  providers: [
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async ({ email, password }) => {
        // Add logic here to look up the user from the credentials supplied
        const user = await UserModel.findOne({ email })

        if (user && bcrypt.compareSync(password, user.password)) {
          // Any object returned will be saved in `user` property of the JWT
          return Promise.resolve(user)
        } else {
          // If you return null or false then the credentials will be rejected
          return Promise.resolve(null)
        }
      },
    }),
  ],
  // The 'database' option should be a connection string or TypeORM
  // configuration object https://typeorm.io/#/connection-options
  //
  // Notes:
  // * You need to install an appropriate node_module for your database!
  // * The email sign in provider requires a database but OAuth providers do not
  // database: process.env.DATABASE_URL,

  // session: {
  // Use JSON Web Tokens for session instead of database sessions.
  // This option can be used with or without a database for users/accounts.
  // Note: `jwt` is automatically set to `true` if no database is specified.
  // jwt: false,
  // Seconds - How long until an idle session expires and is no longer valid.
  // maxAge: 30 * 24 * 60 * 60, // 30 days
  // Seconds - Throttle how frequently to write to database to extend a session.
  // Use it to limit write operations. Set to 0 to always update the database.
  // Note: This option is ignored if using JSON Web Tokens
  // updateAge: 24 * 60 * 60, // 24 hours
  // Easily add custom properties to response from `/api/auth/session`.
  // Note: This should not return any sensitive information.
  /*
    get: async (session) => {
      session.customSessionProperty = "ABC123"
      return session
    }
    */
  // },

  // JSON Web Token options
  // jwt: {
  // secret: 'my-secret-123', // Recommended (but auto-generated if not specified)
  // Custom encode/decode functions for signing + encryption can be specified.
  // if you want to override what is in the JWT or how it is signed.
  // encode: async ({ secret, key, token, maxAge }) => {},
  // decode: async ({ secret, key, token, maxAge }) => {},
  // Easily add custom to the JWT. It is updated every time it is accessed.
  // This is encrypted and signed by default and may contain sensitive information
  // as long as a reasonable secret is defined.
  /*
    set: async (token) => {
      token.customJwtProperty = "ABC123"
      return token
    }
    */
  // },

  // Control which users / accounts can sign in
  // You can use this option in conjuction with OAuth and JWT to control which
  // accounts can sign in without having to use a database.
  // allowSignin: async (user, account) => {
  // Return true if user / account is allowed to sign in.
  // Return false to display an access denied message.
  // return true
  // },

  // You can define custom pages to override the built-in pages
  // The routes shown here are the default URLs that will be used.
  pages: {
    signin: '/login', // Displays signin buttons
    // signout: '/api/auth/signout', // Displays form with sign out button
    // error: '/api/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/api/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Additional options
  // secret: 'abcdef123456789' // Recommended (but auto-generated if not specified)
  // debug: true, // Use this option to enable debug messages in the console
}

const Auth = (req, res) => NextAuth(req, res, options)

export default Auth
