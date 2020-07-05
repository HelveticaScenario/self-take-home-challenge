import { NextPage } from 'next'
import { useRouter } from 'next/router'
import AuthPage, { AuthPageMode } from '../components/AuthPage'

const SignUpPage: NextPage = () => {
  const router = useRouter()
  return (
    <AuthPage
      mode={AuthPageMode.SignUp}
      onToggleMode={() => {
        router.push('/login')
      }}
      onSubmit={() => {
        router.push('/')
      }}
    />
  )
}

export default SignUpPage
