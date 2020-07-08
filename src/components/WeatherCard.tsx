import { FC } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import moment from 'moment'
import startCase from 'lodash/startCase'
import { ICity } from '../schemas/api'
import { kelvinToFahrenheit } from '../lib/utils'

interface WeatherCardProps {
  city: ICity
  onClose: (city: ICity) => void
}
const WeatherCard: FC<WeatherCardProps> = ({ city, onClose }) => (
  <Card className="weather-card">
    <Card.Body>
      <Card.Title className="blue">{city.name}</Card.Title>
      <Card.Text>{moment().format('LL')}</Card.Text>
      <Card.Text>{startCase(city.weather.description)}</Card.Text>
      <Row>
        <Col>
          <img
            src={`http://openweathermap.org/img/wn/${city.weather.icon}@2x.png`}
            alt=""
          />
        </Col>
        <Col>{Math.round(kelvinToFahrenheit(city.weather.temp))}°F</Col>
      </Row>

      <Row>
        <Col>
          <Card.Text>Pressure</Card.Text>
        </Col>
        <Col>
          <Card.Text>{city.weather.pressure} hpa</Card.Text>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card.Text>Humidity</Card.Text>
        </Col>
        <Col>
          <Card.Text>{city.weather.humidity}%</Card.Text>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card.Text>Sunrise</Card.Text>
        </Col>
        <Col>
          <Card.Text>{moment.unix(city.sunrise).format('LT')}</Card.Text>
        </Col>
      </Row>

      <Row>
        <Col>
          {' '}
          <Card.Text>Sunset</Card.Text>
        </Col>
        <Col>
          {' '}
          <Card.Text>{moment.unix(city.sunset).format('LT')}</Card.Text>
        </Col>
      </Row>
    </Card.Body>
    <button className="close blue" onClick={() => onClose(city)}>
      CLOSE
    </button>
  </Card>
)

export default WeatherCard
