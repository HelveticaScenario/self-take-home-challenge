import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import queryString from 'query-string'
import { connectDB, User } from '../../lib/database'
import { getSession } from '../../lib/iron'
import {
  PostCityRequestSchema,
  DeleteCityRequestSchema,
  IPostCityResponse,
} from '../../schemas/api'
import { getWeather } from '../../lib/getWeather'

export default nextConnect<NextApiRequest, NextApiResponse>()
  .post(async (req, res) => {
    try {
      const { body } = req
      const { coordinates, name } = PostCityRequestSchema.parse(body)
      await connectDB()
      const session = await getSession(req)
      if (!session) {
        res.status(401).end()
        return
      }
      const { userId } = session
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $push: { cities: { name, coordinates } },
        },
        { new: true }
      )
      if (!user) {
        throw new Error('user not found')
      }
      const response: IPostCityResponse = await getWeather(
        user.cities[user.cities.length - 1]
      )
      res.status(200).json(response)
    } catch (e) {
      res.status(400).end(e.message || e)
    }
  })
  .delete(async (req, res) => {
    try {
      const { url } = req

      const { cityId } = DeleteCityRequestSchema.parse(
        queryString.parseUrl(url || '').query
      )
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
      await user.cities.id(cityId).remove()
      await user.save()
      res.status(200).end()
    } catch (e) {
      res.status(400).end(e.message || e)
    }
  })
