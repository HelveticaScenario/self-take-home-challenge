// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import queryString from 'query-string'
import axios from 'axios'
import {
  MapboxGeocodingResponseSchema,
  ReverseSearchRequestSchema,
  IReverseSearchResponse,
} from '../../schemas/api'
import { makeEndpoint } from '../../lib/utils'

const makeReverseSearchEndpoint = (lon: number, lat: number) =>
  makeEndpoint(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json`,
    {
      access_token: process.env.MAPBOX_ACCESS_TOKEN,
      types: 'place',
    }
  )

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const { query } = queryString.parseUrl(req.url || '/', {
      parseNumbers: true,
    })
    if (ReverseSearchRequestSchema.check(query)) {
      const { lon, lat } = query
      const {
        features: [place],
      } = MapboxGeocodingResponseSchema.parse(
        (await axios.get(makeReverseSearchEndpoint(lon, lat))).data
      )

      const response: IReverseSearchResponse = {
        name: place ? place.place_name : undefined,
      }
      res.status(200).json(response)
    } else {
      res.status(400).end()
    }
  } catch (e) {
    res.status(500).end()
    console.error(e)
  }
}

export default handler
