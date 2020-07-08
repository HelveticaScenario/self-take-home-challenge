import { NextPage } from 'next'
import Router from 'next/router'
import { Spinner } from 'react-bootstrap'
import { useState } from 'react'
import AuthPage, { AuthPageMode } from '../components/AuthPage'
import { useUser } from '../lib/hooks'

const SignUpPage: NextPage = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })
  const [errorMsg, setErrorMsg] = useState('')
  const [signingUp, updateSigningUp] = useState(false)
  const signUp = async (email: string, password: string) => {
    try {
      if (errorMsg) {
        setErrorMsg('')
      }

      updateSigningUp(true)
      const res = await fetch('/api/signup', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        method: 'POST',
      })
      if (res.status === 200) {
        Router.push('/login')
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setErrorMsg(error.message)
    } finally {
      updateSigningUp(false)
    }
  }

  return (
    <div>
      <AuthPage
        mode={AuthPageMode.SignUp}
        onToggleMode={() => {
          Router.push('/login')
        }}
        onSubmit={(email, password) => {
          signUp(email, password)
        }}
      />
      {signingUp && (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            zIndex: 999,
            opacity: 0.5,
          }}
        >
          <Spinner animation="border" role="status" />
        </div>
      )}
    </div>
  )
}

export default SignUpPage
