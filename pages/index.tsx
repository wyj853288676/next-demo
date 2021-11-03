import { Component } from "react";
import { NextPage } from "next";
import Layout from "../components/layout/layout";
import { Provider } from "react-redux";
import { store } from '../store';

const Home: NextPage = () => {
    return (
        <Provider store={store}>
            <Layout>
                {{
                    main: <div>123</div>
                }}
            </Layout>
        </Provider>
    );
}

export default Home;
