import '../../style/index.css'
import { AppProps } from 'next/app'
import Router from 'next/router'
import { Provider } from 'next-auth/client'
import { FC } from 'react'
// export function redirectUser(ctx, location) {
//   if (ctx.req) {
//     ctx.res.writeHead(302, { Location: location });
//     ctx.res.end();
//   } else {
//     Router.push(location);
//   }
// }

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const { session } = pageProps
  return (
    <Provider
      options={{ site: process.env.NEXT_PUBLIC_SITE }}
      session={session}
    >
      <Component {...pageProps} />
    </Provider>
  )
}
export default App
