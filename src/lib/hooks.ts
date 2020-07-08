import { useEffect, useState } from 'react'
import Router from 'next/router'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const useUser = ({
  redirectTo,
  redirectIfFound,
}: {
  redirectTo?: string
  redirectIfFound?: boolean
} = {}): { finished: boolean; hasUser: boolean } => {
  const [error, setError] = useState<any>()
  const [value, setValue] = useState<any>()
  const [pending, setPending] = useState(true)
  useEffect(() => {
    let cancel = false
    fetcher('/api/user')
      .then((response: any) => !cancel && setValue(response))
      .catch((error: any) => setError(error))
      .finally(() => setPending(false))
    return () => {
      cancel = true
    }
  }, [])
  const exists = value?.exists
  const finished = Boolean(!pending)
  const hasUser = Boolean(exists)
  if (error) {
    console.error(error)
  }

  useEffect(() => {
    if (!redirectTo || !finished) return
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo)
    }
  }, [redirectTo, redirectIfFound, finished, hasUser])
  return { finished, hasUser }
}
