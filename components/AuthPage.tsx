import { FC } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

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
  onSubmit: () => void
}
const AuthPage: FC<AuthPageProps> = ({ mode, onToggleMode, onSubmit }) => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>My Weather</h1>
          {copy[mode] != null && <h5>{copy[mode].subHeader}</h5>}
        </Col>
      </Row>
      <Row>
        <Col>
          <div>{copy[mode].emailLabel}</div>
          <input type="text" />
        </Col>
      </Row>
      <Row>
        <Col>
          <div>{copy[mode].passwordLabel}</div>
          <input type="text" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={onSubmit}>{copy[mode].primaryButton}</Button>
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
