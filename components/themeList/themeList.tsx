import { List, Typography, Divider } from 'antd';
import styles from "./themeList.module.scss";
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme } from '@/features/themes/themeSlice';
import RgbaColor from "@/assets/js/RgbaColor";
const ThemeList = (props: any) => {
    const { themeIndex, themes, colorTags } = useSelector(state => state.themes);
    const dispatch = useDispatch();
    const liClick: void = (e: number) => {
        dispatch(changeTheme(e));
    };
    return (
        <ul className={styles.ul}>
            {themes.map((theme, index) =>
                <li onClick={() => { liClick(index) }} key={index} className={`${styles.li} ${themeIndex == index ? styles.activeLi : ''}`}>
                    <div className={styles.title}>
                        {theme.name}
                    </div>
                    <div className={`${styles.colorList}`}>
                        {
                            colorTags.map((tag, index) =>
                                <i key={index} className={styles.colorIcon} tag={tag} style={getIconBackground(theme.colorList[tag])} ></i>
                            )
                        }
                    </div>
                </li>
            )}
        </ul>
    );
}
interface Color {
    main: RgbaColor,
    vice?: RgbaColor,
}

const getIconBackground = function (color: Color): object {
    return {
        background: color.vice ? `linear-gradient(135deg, ${color.main} 0%, ${color.main} 50%, ${color.vice} 50%, ${color.vice} 100%)` : `${color.main}`,
    };
}

export default ThemeList;