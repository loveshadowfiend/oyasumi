import { create } from "zustand";

interface SettingsStore {
    theme: string;
    translatedLanguage: string[];

    updateTheme: (theme: string) => void;
    updateTranslatedLanguage: (language: string[]) => void;
}

const useSettingsStore = create<SettingsStore>()((set) => ({
    theme: localStorage.getItem("ui-theme") ?? "system",
    translatedLanguage: [localStorage.getItem("translated-language") ?? "en"],

    updateTheme: (theme: string) => {
        set({ theme: theme });
    },
    updateTranslatedLanguage: (language: string[]) => {
        set({ translatedLanguage: language });
    },
}));

export default useSettingsStore;
