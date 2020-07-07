import Head from 'next/head'
import { NextPage } from 'next'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { AddLocation } from '../components/AddLocation'

const Home: NextPage = () => {
  const router = useRouter()
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
            <Nav.Link
              onClick={() => {
                router.push('/login')
              }}
            >
              LOG OUT
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <AddLocation onAdd={() => {}} />
      </Container>
    </>
  )
}

export default Home
