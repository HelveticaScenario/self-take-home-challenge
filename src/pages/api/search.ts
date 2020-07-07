// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import queryString from 'query-string'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import {
  SearchRequestSchema,
  MapboxGeocodingResponseSchema,
  OpenWeatherResponseSchema,
  ISearchResponse,
} from '../../schemas/api'
import { makeEndpoint } from '../../utils'

const makeWeatherEndpoint = (lon: number, lat: number) =>
  makeEndpoint(`https://api.openweathermap.org/data/2.5/onecall`, {
    lat,
    lon,
    appid: process.env.OPEN_WEATHER_APP_ID,
    exclude: 'minutely,hourly,daily',
  })

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
              current: {
                temp,
                weather: [currentWeather],
              },
            } = OpenWeatherResponseSchema.parse(
              (
                await axios.get(
                  makeWeatherEndpoint(...place.geometry.coordinates)
                )
              ).data
            )

            return {
              weather: {
                temp,
                main: currentWeather.main,
                description: currentWeather.description,
                icon: currentWeather.icon,
              },
              location: {
                name: place.place_name,
              },
            }
          })
        )

        res.statusCode = 200
        res.json(placesWithWeather)
      } else {
        res.statusCode = 200
        res.json([])
      }
    } else {
      res.statusCode = 400
    }
  } catch (e) {
    res.statusCode = 500
    console.error(e)
  }
}

export default handler
