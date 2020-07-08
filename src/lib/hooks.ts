import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const useUser = ({
  redirectTo,
  redirectIfFound,
}: {
  redirectTo?: string
  redirectIfFound?: boolean
} = {}): any => {
  const { data, error } = useSWR('/api/user', fetcher)
  const exists = data?.exists
  const finished = Boolean(data)
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
}
