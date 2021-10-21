import styles from "./Layout.module.scss";
import type { NextPage } from "next";
import Head from 'next/head';
const Layout: NextPage = (props: Object) => {
    return (
        <div>
            <Head >
                {props.children.header}
            </Head>
            <main>
                {props.children.main}
            </main>
            <footer>
                {props.children.footer}
            </footer>
        </div>
    );
};

export default Layout;