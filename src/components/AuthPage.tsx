import { FC, useState } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  FormControl,
  Alert,
  Form,
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
    <div className="auth-page">
      <Container>
        {error && (
          <Alert variant="danger" dismissible>
            <Alert.Heading>{error}</Alert.Heading>
          </Alert>
        )}

        <Row as="header">
          <Col>
            <h1>My Weather</h1>
            {copy[mode] != null && <h5>{copy[mode].subHeader}</h5>}
          </Col>
        </Row>
        <Form
          onSubmit={(e: { preventDefault: () => void }) => {
            e.preventDefault()
            onSubmit(email, password)
          }}
        >
          <Form.Group>
            <Form.Label>{copy[mode].emailLabel}</Form.Label>
            <Form.Control
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{copy[mode].passwordLabel}</Form.Label>
            <FormControl
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button size="lg" block variant="primary" type="submit">
            {copy[mode].primaryButton}
          </Button>
          <Form.Text>{copy[mode].modeChangeLabel}</Form.Text>
          <Button
            size="lg"
            block
            variant="outline-primary"
            onClick={onToggleMode}
          >
            {copy[mode].modeChange}
          </Button>
        </Form>
      </Container>
    </div>
  )
}

export default AuthPage
