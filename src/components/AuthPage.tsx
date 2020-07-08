import { FC, useState } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  FormControl,
  Alert,
} from 'react-bootstrap'

export enum AuthPageMode {
  Login,
  SignUp,
}

type CopyObj = {
  [key in AuthPageMode]: {
    subHeader: string | undefined
    emailLabel: string
    passwordLabel: string
    primaryButton: string
    modeChange: string
    modeChangeLabel: string
  }
}

const copy: CopyObj = {
  [AuthPageMode.Login]: {
    subHeader: undefined,
    emailLabel: 'EMAIL',
    passwordLabel: 'PASSWORD',
    primaryButton: 'Log in',
    modeChange: 'Sign up',
    modeChangeLabel: 'Are you new here?',
  },
  [AuthPageMode.SignUp]: {
    subHeader: 'Sign up for My Weather',
    emailLabel: 'ENTER YOUR EMAIL',
    passwordLabel: 'CHOOSE A PASSWORD',
    primaryButton: 'Sign up',
    modeChange: 'Log in',
    modeChangeLabel: 'Already a member?',
  },
}

export interface AuthPageProps {
  mode: AuthPageMode
  onToggleMode: () => void
  onSubmit: (email: string, password: string) => void
  error?: string
}
const AuthPage: FC<AuthPageProps> = ({
  mode,
  onToggleMode,
  onSubmit,
  error,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Container>
      {error && (
        <Alert variant="danger" dismissible>
          <Alert.Heading>{error}</Alert.Heading>
        </Alert>
      )}

      <Row>
        <Col>
          <h1>My Weather</h1>
          {copy[mode] != null && <h5>{copy[mode].subHeader}</h5>}
        </Col>
      </Row>
      <Row>
        <Col>
          <div>{copy[mode].emailLabel}</div>
          <FormControl
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <div>{copy[mode].passwordLabel}</div>
          <FormControl
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            onClick={() => {
              onSubmit(email, password)
            }}
          >
            {copy[mode].primaryButton}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>{copy[mode].modeChangeLabel}</div>
          <Button onClick={onToggleMode}>{copy[mode].modeChange}</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default AuthPage
