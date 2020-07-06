import { FC } from 'react'
import { Card } from 'react-bootstrap'

import { FaLocationArrow } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import Autocomplete from './Autocomplete'

interface AddLocationProps {}
export const AddLocation: FC<AddLocationProps> = () => {
  return (
    <Card bg="dark" text="light">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between blue">
          <span>ADD A LOCATION</span>
          <IconContext.Provider value={{ size: '1.3em' }}>
            <FaLocationArrow
              onClick={() => {
                console.log('location')
              }}
            />
          </IconContext.Provider>
        </Card.Title>
        <Autocomplete />
      </Card.Body>
    </Card>
  )
}
