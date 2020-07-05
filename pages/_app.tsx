import '../style/index.css'
import App, {AppContext} from 'next/app'
import Router from "next/router";


// export function redirectUser(ctx, location) {
//   if (ctx.req) {
//     ctx.res.writeHead(302, { Location: location });
//     ctx.res.end();
//   } else {
//     Router.push(location);
//   }
// }


export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

// class MyApp extends App {
//     static async getInitialProps({Component, ctx}: AppContext) {

//     }
// }