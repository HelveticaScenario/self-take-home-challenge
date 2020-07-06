import { FC, useState } from 'react'
import { FaSearch, FaPlus, FaCheck } from 'react-icons/fa'
import {
  Button,
  InputGroup,
  FormControl,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap'
import debounce from 'lodash/debounce'

interface Item {
  location: string
  weather: string
  added: boolean
}

interface AutocompleteItemProps {
  item: Item
  onAdd: (item: Item) => void
}
const AutocompleteItem: FC<AutocompleteItemProps> = ({ item, onAdd }) => (
  <ListGroupItem>
    <div>
      <div className="blue bold">{item.location}</div>
      <div className="dark-gray">{item.weather}</div>
    </div>
    {item.added ? (
      <div className="blue">
        <FaCheck />
      </div>
    ) : (
      <button
        className="icon-button blue"
        onClick={() => {
          onAdd(item)
        }}
      >
        <FaPlus />
      </button>
    )}
  </ListGroupItem>
)

interface AutocompleteProps {}
const Autocomplete: FC<AutocompleteProps> = () => {
  const [searchTerm, updateSearchTerm] = useState('')
  const items: Item[] = [
    {
      location: 'Austin, US',
      weather: 'Scattered clouds, 98 deg F',
      added: true,
    },
    {
      location: 'Austin, CA',
      weather: 'Scattered clouds, 98 deg F',
      added: false,
    },
  ]

  return (
    <>
      <InputGroup className="">
        {/* <div className="autocomplete" style={{}}>
        <input type="text" name="location" />
      </div> */}
        <FormControl
          value={searchTerm}
          onChange={(e) => updateSearchTerm(e.target.value)}
        ></FormControl>
        <InputGroup.Append>
          <Button>
            <FaSearch />
          </Button>
        </InputGroup.Append>
        <ListGroup className="autocomplete-items">
          {items.map((e) => (
            <AutocompleteItem
              key={e.location}
              item={e}
              onAdd={(item) => {
                console.log('added', item)
              }}
            />
          ))}
        </ListGroup>
      </InputGroup>
      {/* <div style={{ position: 'absolute', background: 'blue' }}>
        <div>Hello</div>
        <div>goodbye</div>
      </div> */}
    </>
  )
}

export default Autocomplete
