import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { themes, colorTags } from "./themes";
export interface ThemeState {
    themeIndex: number,
    styleGetters: Array<any>,
    commonColors: Object,
    themes: Array<Object>,
    colorTags: Array<Object>,
}

const initialState: ThemeState = {
    themeIndex: 0,
    styleGetters: [],
    commonColors: {
        success: "#67C23A",
        danger: "#F56C6C",
        warning: "#E6A23C",
        gray: "#909399",
        info: "#409EFF",
    },
    themes,
    colorTags,
};

export const themeSlice = createSlice({
    name: "themes",
    initialState,
    reducers: {
        changeTheme: (state, action) => {
            state.themeIndex = action.payload;
        },
        addStyle: (state) => {
            return state;
        },

    },
})

export const { changeTheme, addStyle } = themeSlice.actions

export default themeSlice.reducer;