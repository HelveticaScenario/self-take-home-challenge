import { NextPage } from 'next'
import Router from 'next/router'
import AuthPage, { AuthPageMode } from '../components/AuthPage'
import { useState } from 'react'
import { useUser } from '../lib/hooks'

const LoginPage: NextPage = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (email: string, password: string) => {
    if (errorMsg) setErrorMsg('')

    const body = {
      email,
      password,
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.status === 200) {
        Router.push('/')
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setErrorMsg(error.message)
    }
  }

  return (
    <AuthPage
      mode={AuthPageMode.Login}
      onToggleMode={() => {
        Router.push('/signup')
      }}
      onSubmit={handleSubmit}
    />
  )
}

export default LoginPage
