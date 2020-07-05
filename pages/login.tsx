import { NextPage } from 'next'
import AuthPage, { AuthPageMode } from '../components/AuthPage'
import { useRouter } from 'next/router'

const LoginPage: NextPage = () => {
  const router = useRouter()
  return (
    <AuthPage
      mode={AuthPageMode.Login}
      onToggleMode={() => {
        router.push('/sign-up')
      }}
      onSubmit={()=>{
          router.push('/')
      }}
    />
  )
}

export default LoginPage
