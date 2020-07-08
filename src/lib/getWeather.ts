import { makeEndpoint } from './utils'
import { OpenWeatherResponseSchema, ICity } from '../schemas/api'

const makeWeatherEndpoint = (lon: number, lat: number) =>
  makeEndpoint(`https://api.openweathermap.org/data/2.5/onecall`, {
    lat,
    lon,
    appid: process.env.OPEN_WEATHER_APP_ID,
    exclude: 'minutely,hourly,daily',
  })

export const getWeather = async (city: {
  id?: string
  name: string
  coordinates: { lon: number; lat: number }
}): Promise<ICity> => {
  const weather = OpenWeatherResponseSchema.parse(
    await fetch(
      makeWeatherEndpoint(city.coordinates.lon, city.coordinates.lat)
    ).then((res) => res.json())
  )
  const currentWeatherCondition = weather.current.weather[0]
  if (!currentWeatherCondition) {
    throw new Error('city does not currently have weather available')
  }
  return {
    id: city.id,
    name: city.name,
    sunrise: weather.current.sunrise,
    sunset: weather.current.sunset,
    weather: {
      id: currentWeatherCondition.id,
      main: currentWeatherCondition.main,
      description: currentWeatherCondition.description,
      icon: currentWeatherCondition.icon,

      pressure: weather.current.pressure,
      humidity: weather.current.humidity,
      temp: weather.current.temp,
    },
  }
}
