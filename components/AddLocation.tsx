import { FC, useState, useCallback, useRef } from 'react'
import { FaSearch, FaPlus, FaLocationArrow } from 'react-icons/fa'
import {
  Button,
  InputGroup,
  FormControl,
  ListGroup,
  ListGroupItem,
  Card,
  Spinner,
} from 'react-bootstrap'
import debounce from 'lodash/debounce'
import axios from 'axios'
import {
  IPlaceWithWeather,
  ISearchResponse,
  SearchResponseSchema,
  ReverseSearchResponseSchema,
  IReverseSearchRequest,
  ISearchRequest,
} from '../src/schemas/api'
import { Immutable, kelvinToFahrenheit, makeEndpoint } from '../src/lib/utils'
import { IconContext } from 'react-icons/lib'

interface AutocompleteItemProps {
  item: IPlaceWithWeather
  onAdd: (item: IPlaceWithWeather) => void
}

const formatWeather = (weather: IPlaceWithWeather['weather']) =>
  `${weather.description}, ${Math.round(kelvinToFahrenheit(weather.temp))}° F`

const AutocompleteItem: FC<AutocompleteItemProps> = ({ item, onAdd }) => (
  <ListGroupItem>
    <div>
      <div className="blue bold">{item.location.name}</div>
      <div className="dark-gray">{formatWeather(item.weather)}</div>
    </div>
    <button
      className="icon-button blue"
      onClick={() => {
        onAdd(item)
      }}
    >
      <FaPlus />
    </button>
  </ListGroupItem>
)

interface AddLocationProps {
  onAdd: (place: IPlaceWithWeather) => void
}
export const AddLocation: FC<AddLocationProps> = ({ onAdd }) => {
  const [autocompleteResults, updateAutocompleteResults] = useState<
    Immutable<ISearchResponse>
  >([])
  const [loadingResults, updateLoadingResults] = useState(false)
  const [loadingCurrentLocation, updateLoadingCurrentLocation] = useState(false)
  const searchTimestampRef = useRef<number>(0)
  const [searchText, updateSearchText] = useState('')
  const search = useCallback(
    debounce(
      async (newSearchText: string) => {
        updateLoadingResults(true)
        const timestamp = performance.now()
        searchTimestampRef.current = timestamp
        const response = SearchResponseSchema.parse(
          (
            await axios.get(
              makeEndpoint<ISearchRequest>(`/api/search`, {
                search_text: newSearchText,
              })
            )
          ).data
        )
        if (searchTimestampRef.current === timestamp) {
          updateAutocompleteResults(response)
          updateLoadingResults(false)
        }
      },
      300,
      { leading: false, trailing: true }
    ),
    [updateAutocompleteResults, updateLoadingResults]
  )

  const onChange = (newSearchText: string) => {
    updateSearchText(newSearchText)
    search(newSearchText)
  }

  const getCurrentPosition = () => {
    if (loadingCurrentLocation) {
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        updateLoadingCurrentLocation(true)
        const { name } = ReverseSearchResponseSchema.parse(
          await (
            await axios.get(
              makeEndpoint<IReverseSearchRequest>(`/api/reverse-search`, {
                lon: position.coords.longitude,
                lat: position.coords.latitude,
              })
            )
          ).data
        )
        if (name) {
          onChange(name)
        }
        updateLoadingCurrentLocation(false)
      },
      (error) => {
        console.error(error)
      }
    )
  }

  return (
    <Card bg="dark" text="light">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between blue">
          <span>ADD A LOCATION</span>
          <IconContext.Provider value={{ size: '1.3em' }}>
            <FaLocationArrow onClick={getCurrentPosition} />
          </IconContext.Provider>
        </Card.Title>
        <InputGroup className="">
          <FormControl
            value={searchText}
            onChange={(e) => onChange(e.target.value)}
          ></FormControl>
          <InputGroup.Append>
            <Button disabled={loadingResults || loadingCurrentLocation}>
              {loadingResults || loadingCurrentLocation ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <FaSearch />
              )}
            </Button>
          </InputGroup.Append>
          <ListGroup className="autocomplete-items">
            {autocompleteResults.map((e) => (
              <AutocompleteItem key={e.location.name} item={e} onAdd={onAdd} />
            ))}
          </ListGroup>
        </InputGroup>
      </Card.Body>
    </Card>
  )
}
