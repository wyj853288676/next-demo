import { NextPage } from "next";
import scssStyles from "../styles/Test.module.scss";

const Test: NextPage = () => {
    return (
        <div className={scssStyles.test}>
            123
        </div>
    );
}

export default Test;