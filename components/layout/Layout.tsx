import styles from "./Layout.module.scss";
import { useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import ThemeList from "@/components/themeList/themeList";
import { useDispatch, useSelector } from "react-redux";

const { Header, Footer, Sider, Content } = Layout;


const CustomLayout = (props: any) => {
    const [themeSiderActive, setThemeSiderActive] = useState(false);
    const toggleThemeConfig = () => {
        setThemeSiderActive(!themeSiderActive);
    };

    return (
        <Layout className={styles.layout}>
            <Header className={styles.header}>
                <div className={`clear-float ${styles.option}`}>
                    <SettingOutlined onClick={toggleThemeConfig} className={`${styles.optionIcon} hover`} />
                </div>
            </Header>
            <Content className={styles.main}>
                {props.children ? props.children.main : null}
            </Content>
            <Footer>
                {props.children ? props.children.footer : null}
            </Footer>
            <div className={`${styles.themeSider} ${themeSiderActive ? styles.themeSiderActive : ''}`}>
                <ThemeList></ThemeList>
            </div>
        </Layout>
    );
};
export default CustomLayout;