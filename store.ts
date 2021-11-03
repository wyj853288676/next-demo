import { configureStore, getDefaultMiddleware, createStore } from "@reduxjs/toolkit";
import themeReducer from './features/themes/themeSlice';
export const store = configureStore({
    reducer: {
        themes: themeReducer,
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    }),
});

