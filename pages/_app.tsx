import '../styles/globals.scss';
import 'antd/dist/antd.css';
import type { AppProps } from 'next/app';
import Layout from "../components/layout/layout";
import { Provider } from "react-redux";
import { store } from '../store';

function MyApp({ Component, pageProps }: AppProps) {
  console.log(pageProps);
  return (
    <Provider store={store}>
      <Layout>
        {
          {
            main: <Component {...pageProps} />
          }
        }
      </Layout>
    </Provider>
  );
}



export default MyApp;
