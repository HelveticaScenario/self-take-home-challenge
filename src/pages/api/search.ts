// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import queryString from 'query-string'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import {
  SearchRequestSchema,
  MapboxGeocodingResponseSchema,
  ISearchResponse,
} from '../../schemas/api'
import { makeEndpoint } from '../../lib/utils'
import { getWeather } from '../../lib/getWeather'

const makeSearchEndpoint = (searchTerm: string) =>
  makeEndpoint(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      searchTerm
    )}.json`,
    {
      access_token: process.env.MAPBOX_ACCESS_TOKEN,
      autocomplete: true,
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
    if (SearchRequestSchema.check(query)) {
      const { search_text: searchText } = query
      if (searchText) {
        const aaa = (await axios.get(makeSearchEndpoint(searchText))).data
        const { features: places } = MapboxGeocodingResponseSchema.parse(aaa)
        const placesWithWeather: ISearchResponse = await Promise.all(
          places.map(async (place) => {
            const {
              weather: { temp, main, description, icon },
            } = await getWeather({
              name: place.place_name,
              coordinates: {
                lon: place.geometry.coordinates[0],
                lat: place.geometry.coordinates[1],
              },
            })

            return {
              weather: {
                temp,
                main,
                description,
                icon,
              },
              location: {
                name: place.place_name,
                coordinates: {
                  lon: place.geometry.coordinates[0],
                  lat: place.geometry.coordinates[1],
                },
              },
            }
          })
        )

        res.status(200).json(placesWithWeather)
      } else {
        res.status(200).json([])
      }
    } else {
      res.status(400).end()
    }
  } catch (e) {
    res.status(500).end()
    console.error(e)
  }
}

export default handler
