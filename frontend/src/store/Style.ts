import { colors } from "quasar";

import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export enum Style {
    Dark,
    Light
}

interface StyleColors {
    primary: string;
    secondary: string;
    accent: string;
    dark: string;
}

@Module
export default class StyleClass extends VuexModule {
    @Mutation
    _setStyle (style: StyleColors) {
        console.log(colors.getBrand('dark'))
        colors.setBrand("primary", style.primary);
        colors.setBrand("secondary", style.secondary);
        colors.setBrand("accent", style.accent);
        colors.setBrand("dark", style.dark);
    }

    @Action({ commit: '_setStyle' })
    setStyle (style: Style) {
        switch (style) {
            case Style.Light: {
                return lightTheme;
            }
            case Style.Dark: {
                return darkTheme;
            }
        }
    }
}



const darkTheme = {
    name: "Dark",
    primary: "#222222",
    secondary: "#111111",
    accent: "#333333",
    dark: "#22252b"
};

const lightTheme = {
    name: "Light",
    primary: "#cce6ff",
    secondary: "#0052a3",
    accent: "#f57b00",
    dark: "#ffffff"
};
