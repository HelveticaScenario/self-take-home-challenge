import queryString from 'query-string'

export const kelvinToFahrenheit = (kelvin: number): number =>
  ((kelvin - 273.15) * 9) / 5 + 32

export type Immutable<T> = T extends  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function
  | boolean
  | number
  | string
  | null
  | undefined
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<Immutable<U>>
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<Immutable<K>, Immutable<V>>
  : T extends Set<infer S>
  ? ReadonlySet<Immutable<S>>
  : { readonly [P in keyof T]: Immutable<T[P]> }

export const makeEndpoint = <T>(url: string, query: T): string =>
  `${url}?${queryString.stringify(query)}`

export const validateEmailAddress = (address: string): boolean =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(address)
