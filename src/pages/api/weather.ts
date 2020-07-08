import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB, User } from '../../lib/database'
import { getSession } from '../../lib/iron'
import { getWeather } from '../../lib/getWeather'

export default nextConnect<NextApiRequest, NextApiResponse>().get(
  async (req, res) => {
    try {
      await connectDB()
      const session = await getSession(req)
      if (!session) {
        res.status(401).end()
        return
      }
      const { userId } = session
      const user = await User.findById(userId)
      if (!user) {
        throw new Error('user not found')
      }
      res.status(200).json({
        cities: await Promise.all(user.cities.map((city) => getWeather(city))),
      })
    } catch (e) {
      res.status(400).end(e.message || e)
    }
  }
)
