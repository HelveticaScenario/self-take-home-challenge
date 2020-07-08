import { FC, useState, useCallback, useRef, useEffect } from 'react'
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
import {
  IPlaceWithWeather,
  ISearchResponse,
  SearchResponseSchema,
  ReverseSearchResponseSchema,
  IReverseSearchRequest,
  ISearchRequest,
} from '../schemas/api'
import { Immutable, kelvinToFahrenheit, makeEndpoint } from '../lib/utils'
import { IconContext } from 'react-icons/lib'

interface AutocompleteItemProps {
  item: IPlaceWithWeather
  onAdd: (item: IPlaceWithWeather) => void
}

const formatWeather = (weather: IPlaceWithWeather['weather']) =>
  `${weather.description}, ${Math.round(kelvinToFahrenheit(weather.temp))}° F`

const AutocompleteItem: FC<AutocompleteItemProps> = ({ item, onAdd }) => (
  <ListGroupItem
    as="button"
    onClick={() => {
      onAdd(item)
    }}
  >
    <div className="name-and-weather">
      <div className="blue bold">{item.location.name}</div>
      <div className="dark-gray">{formatWeather(item.weather)}</div>
    </div>
    <FaPlus />
  </ListGroupItem>
)

const ADD_LOCATION_ID = 'add-location'

interface AddLocationProps {
  onAdd: (place: IPlaceWithWeather) => void
}
export const AddLocation: FC<AddLocationProps> = ({ onAdd }) => {
  const [autocompleteResults, setAutocompleteResults] = useState<
    Immutable<ISearchResponse>
  >([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false)
  const searchTimestampRef = useRef<number>(0)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    window.addEventListener('click', ({ target }) => {
      if (
        !(target instanceof Element) ||
        target.id === ADD_LOCATION_ID ||
        document.getElementById(ADD_LOCATION_ID)?.contains(target)
      ) {
        return
      }

      setAutocompleteResults([])
    })
  })

  const search = useCallback(
    debounce(
      async (newSearchText: string) => {
        setLoadingResults(true)
        const timestamp = performance.now()
        searchTimestampRef.current = timestamp
        const response = SearchResponseSchema.parse(
          await fetch(
            makeEndpoint<ISearchRequest>(`/api/search`, {
              search_text: newSearchText,
            })
          ).then((res) => res.json())
        )
        if (searchTimestampRef.current === timestamp) {
          setAutocompleteResults(response)
          setLoadingResults(false)
        }
      },
      300,
      { leading: false, trailing: true }
    ),
    [setAutocompleteResults, setLoadingResults]
  )

  const onChange = (newSearchText: string) => {
    setSearchText(newSearchText)
    search(newSearchText)
  }

  const getCurrentPosition = () => {
    if (loadingCurrentLocation) {
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLoadingCurrentLocation(true)
        const { name } = ReverseSearchResponseSchema.parse(
          await await fetch(
            makeEndpoint<IReverseSearchRequest>(`/api/reverseSearch`, {
              lon: position.coords.longitude,
              lat: position.coords.latitude,
            })
          ).then((res) => res.json())
        )
        if (name) {
          onChange(name)
        }
        setLoadingCurrentLocation(false)
      },
      (error) => {
        console.error(error)
      }
    )
  }

  return (
    <Card bg="dark" text="light" id={ADD_LOCATION_ID}>
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
            <Button
              disabled={loadingResults || loadingCurrentLocation}
              onClick={() => search(searchText)}
            >
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
