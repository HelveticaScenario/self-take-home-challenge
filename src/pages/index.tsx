import Head from 'next/head'
import { NextPage } from 'next'
import { Container, Navbar, Nav } from 'react-bootstrap'
import queryString from 'query-string'
import { AddLocation } from '../components/AddLocation'
import { useUser } from '../lib/hooks'
import {
  ICity,
  WeatherResponseSchema,
  PostCityResponseSchema,
  IPostCityRequest,
  IDeleteCityRequest,
} from '../schemas/api'
import { useState, useEffect } from 'react'
import { Immutable } from '../lib/utils'
import WeatherCard from '../components/WeatherCard'

const Home: NextPage = () => {
  useUser({ redirectTo: '/login' })
  const [errorMsg, setErrorMsg] = useState('')
  const [cities, setCities] = useState<Immutable<ICity[]>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let canceled = false
    const fetchWeather = async () => {
      setLoading(true)
      try {
        const { cities } = WeatherResponseSchema.parse(
          await fetch('/api/weather').then((res) => res.json())
        )
        if (!canceled) {
          setCities(cities)
        }
      } catch (error) {
        console.error('An unexpected error happened occurred:', error)
      } finally {
        if (!canceled) {
          setLoading(false)
        }
      }
    }
    fetchWeather()
    return () => {
      canceled = true
    }
  }, [])

  const addCity = async (location: IPostCityRequest) => {
    if (errorMsg) setErrorMsg('')

    try {
      const city = PostCityResponseSchema.parse(
        await fetch('/api/city', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(location),
        }).then((res) => res.json())
      )
      setCities((oldCities) => [...oldCities, city])
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setErrorMsg(error.message)
    }
  }

  const removeCity = async ({ id }: ICity): Promise<void> => {
    try {
      setCities((oldCities) => oldCities.filter((city) => city.id !== id))
      const query: IDeleteCityRequest = { cityId: id || '' }
      await fetch(`/api/city?${queryString.stringify(query)}`, {
        method: 'DELETE',
      }).then((res) => res.json())
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setErrorMsg(error.message)
    }
  }

  return (
    <>
      <Head>
        <title>My Weather</title>
      </Head>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>My Weather</Navbar.Brand>
        <Navbar.Collapse>
          <Nav className="mr-auto" />
          <Nav>
            <Nav.Link href="/api/logout">LOG OUT</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <AddLocation
          onAdd={({ location }) => {
            addCity(location)
          }}
        />
        {cities.map((city) => (
          <WeatherCard
            key={city.id}
            city={city}
            onClose={(city) => {
              removeCity(city)
            }}
          />
        ))}
      </Container>
    </>
  )
}

export default Home
