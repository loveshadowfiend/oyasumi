import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsStore {
    theme: string;
    translatedLanguage: string[];

    updateTheme: (theme: string) => void;
    updateTranslatedLanguage: (language: string[]) => void;
}

const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            theme: "system",
            translatedLanguage: ["ru"],

            updateTheme: (theme: string) => {
                set({ theme: theme });
            },
            updateTranslatedLanguage: (language: string[]) => {
                set({ translatedLanguage: language });
            },
        }),
        {
            name: "settings-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useSettingsStore;
